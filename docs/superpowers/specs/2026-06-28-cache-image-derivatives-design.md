# Cache image derivatives across builds (issue #140)

## Problem

`bundle exec jekyll build` regenerates the full historical set of meetup image
derivatives on every CI run. Build time grows linearly with content volume
(~450 meetup images today; `done in 93.602 seconds` in recent logs).

### Root cause

`jekyll_picture_tag` (JPT) only regenerates a derivative when its output file is
absent:

```ruby
# generated_image.rb
def generate
  generate_image unless @source.missing || exists?
end

def exists?
  File.exist?(absolute_filename)
end
```

The output path is the Jekyll **destination**, not a source-tree folder:

```ruby
# instructions/children/config.rb — DestDir
File.join(site.config['destination'], pconfig['output'])  # => _site/assets/thumbs
```

JPT registers `assets/thumbs` in Jekyll's `keep_files`, so Jekyll does not wipe
`_site/assets/thumbs` when it cleans the destination before a build. Locally,
`_site` persists between builds, so repeated local builds are already
incremental. In CI, `_site` starts empty every run, so all derivatives are
regenerated from scratch.

## Goal

Make CI builds reuse unchanged derivatives and regenerate only new/changed
source images, while producing identical responsive output.

## Correctness note

JPT's generated filename embeds an MD5 of the source content:

```ruby
# generated_image.rb
def name
  @name ||= "#{@source.base_name}-#{@width}-#{id}.#{@format}"
end

def id
  @id ||= Digest::MD5.hexdigest(settings.join)[0..8]  # settings include @source.digest
end
```

A changed source image therefore produces a **new** filename and regenerates
correctly. Caching the output directory carries no stale-image risk; old
derivatives from changed sources simply become orphaned files.

## Design

Add one step to `.github/workflows/pages.yml`, immediately before
**Build Jekyll site**:

```yaml
- name: Cache generated image derivatives
  uses: actions/cache@v4
  with:
    path: _site/assets/thumbs
    key: jpt-thumbs-${{ hashFiles('archives/images/**') }}
    restore-keys: |
      jpt-thumbs-
```

### Behaviour

- **Exact key hit** (no source images changed): full restore of
  `_site/assets/thumbs`; JPT's `File.exist?` check skips every derivative; zero
  generation. No new cache is saved (the key already exists).
- **Key miss** (an image added or changed): `restore-keys` restores the most
  recent `jpt-thumbs-*` cache; JPT generates only the new/changed derivatives;
  the post-job step saves a fresh cache under the new content-hash key.

A content-varying key is required because GitHub Actions cache entries are
immutable — a static key would never persist newly generated derivatives, so
new content would regenerate on every run.

### Data flow

```
checkout (submodules: recursive)
  -> actions/cache restore  -> populates _site/assets/thumbs
  -> make generate          -> tag/category data + pages
  -> bundle exec jekyll build
        keep_files protects _site/assets/thumbs from cleanup
        JPT skips existing derivatives, generates only new ones
  -> upload-pages-artifact   -> uploads _site
  -> actions/cache post-step -> saves updated _site/assets/thumbs (on key miss)
```

### Edge cases

- **First run after merge:** cold cache, one-time full generation (expected).
- **Orphaned derivatives:** changed sources leave old files in the cache; total
  size is tens of MB versus GitHub's 10 GB per-repo cache limit, so no cleanup
  is needed.
- **Scope:** only `_site/assets/thumbs` is cached — never HTML — so there is no
  stale-page risk.

## Scope boundaries

- Caches all JPT output regardless of source collection (events, people,
  projects, organizations), because they all write under `assets/thumbs` and the
  key hashes all of `archives/images/**`.
- Does **not** fix the missing `hacknight_549.avif` warning (issue #141) or add
  source-image validation (issue #142). Those are tracked separately.

## Documentation

Add a short note to `README.md` / `CLAUDE.md`:

- CI caches image derivatives in `_site/assets/thumbs`, keyed on
  `archives/images/**`.
- `make clean` wipes `_site`, forcing a full local regeneration on the next
  build.

## Verification

1. **Local cold vs. warm build** (libvips/imagemagick installed locally):
   - `make clean && time bundle exec jekyll build` — cold: emits many
     `Generating new image file:` lines.
   - `time bundle exec jekyll build` — warm: no `Generating new image file:`
     lines, materially faster.
2. **CI:** after merge, confirm the first run populates the cache and a
   subsequent no-image-change run restores it (no `Generating new image file:`
   spam, reduced build time) in the Actions logs.

## Acceptance criteria

- [ ] No-content-change CI builds regenerate no historical derivatives.
- [ ] Adding one new meetup image generates only that image's derivative.
- [ ] Build time for unchanged-content runs is materially reduced (before/after
      captured).
- [ ] Dev workflow docs updated for the caching behaviour.
