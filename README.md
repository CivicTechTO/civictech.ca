# CivicTech Toronto

The website repository for [CivicTech.ca](https://civictech.ca) — a community of Torontonians working on civic challenges through technology, design, and collaboration.

## Get Involved

Visit [civictech.ca](https://civictech.ca) to learn more about our community, attend events, and get connected.

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute to this website.

## Local Development

This site is built with [Hugo](https://gohugo.io). Image processing is built into Hugo, so there is nothing else to install.

1. **Install Hugo (extended edition, 0.153 or later)**

   On **macOS** with [Homebrew](https://brew.sh):

   ```bash
   brew install hugo
   ```

   For other platforms, see the [Hugo installation guide](https://gohugo.io/installation/). Verify the version:

   ```bash
   hugo version
   # Should show v0.153.0 or later, with "+extended"
   ```

2. **Clone the Repository (with the archives submodule)**

   ```bash
   git clone --recurse-submodules https://github.com/CivicTechTO/civictech.ca.git
   cd civictech.ca
   ```

   If you already cloned without submodules:

   ```bash
   git submodule update --init --recursive
   ```

3. **Run the Local Server**

   ```bash
   hugo server        # or: make serve
   ```

4. **View the Site**

   Open your browser to [localhost:1313](http://localhost:1313)

The first build processes every meetup image and takes 10–15 seconds. Processed images are cached in `resources/`, so later builds take about a second; `make clean` clears the cache.

### Checking Your Changes

```bash
make check      # build, then check JSON-LD, the feed, redirects, links and entities
make validate   # check that every meetup image: front matter points at a real file
```

CI runs both on pull requests, plus a [Pa11y](https://pa11y.org/) accessibility check (WCAG 2 AA) on one page of each type, and posts the Pa11y report as a comment.

### Common Issues

**Missing pages or images**
The content lives in the `archives/` submodule. If it's empty, run `git submodule update --init --recursive`.

**"redirect_from URLs missing from assets/redirects.csv"**
The archives added an old URL to a record's `redirect_from`. Add a row to `assets/redirects.csv` for each URL listed (see [docs/hugo-migration.md](docs/hugo-migration.md#legacy-urls)).

**Old URLs on a local server**
macOS file names aren't case-sensitive, so `hugo server` answers old mixed-case URLs such as `/people/Lilly%20Tong/` directly. On the live site they are forwarded by `404.html`.

## Development Scripts

### Update Submodule

```bash
make update     # or: git submodule update --remote --merge
```

## Project Structure

Content is managed in the `archives/` submodule, which holds the historical data about events, people, projects, and organizations. See [archives/README.md](archives/README.md) for more details. Hugo mounts it read-only (`module.mounts` in `hugo.toml`).

| Path | What it holds |
| --- | --- |
| `hugo.toml` | Site configuration, including the archive mounts |
| `layouts/` | Templates |
| `content/` | Site pages (about, code of conduct, feedback, …) and list page settings |
| `data/` | Navigation, footer and social link data |
| `assets/` | Files Hugo processes: icons, logo, `redirects.csv` |
| `static/` | Files copied as they are: CSS, JavaScript, images, `llms.txt` |
| `scripts/` | Output and image checks |
| `docs/` | Plans and notes, including [the move from Jekyll](docs/hugo-migration.md) |

## License

This project uses a dual-license structure:

- **Code** (Hugo templates, scripts, stylesheets, etc.): [MIT License](LICENSE)
- **Content** (website pages, documentation, archive content): [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

See [LICENSE](LICENSE) for full details.
