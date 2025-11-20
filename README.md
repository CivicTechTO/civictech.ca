# CivicTech Toronto

The website repository for [CivicTech.ca](https://civictech.ca) — a community of Torontonians working on civic challenges through technology, design, and collaboration.

## Get Involved

Visit [civictech.ca](https://civictech.ca) to learn more about our community, attend events, and get connected.

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute to this website.

## Local Development

This site is built with Jekyll, which requires Ruby. Follow these steps to get set up:

1. **Install Ruby**

   **This project requires Ruby 3.2.2** (specified in `.ruby-version`).

   We strongly recommend installing Ruby using a Ruby version manager like [RBENV](https://rbenv.org).

   Verify your Ruby version:

   ```bash
   ruby -v
   # Should show: ruby 3.2.2
   ```

2. **Clone the Repository**

   ```bash
   git clone https://github.com/CivicTechTO/civictech.ca.git
   cd civictech.ca
   ```

2. **Install Dependencies**

   Bundler manages Ruby gem dependencies:

   ```bash
   gem install bundler
   bundle install
   ```

   If you see errors about missing Ruby version, make sure you've completed the Prerequisites section above.

   **Additional dependencies for image processing:**

   If using **macOS**, you can get libvips from [homebrew](https://brew.sh):

   ```sh
   brew install vips imagemagick
   ```

   > [!TIP]
   >
   > Additional Resources
   >
   > - [GitHub Pages documentation](https://docs.github.com/en/pages)
   > - [Jekyll installation guide](https://jekyllrb.com/docs/installation/)


3. **Run the Local Server**

   Standard mode:

   ```bash
   bundle exec jekyll serve
   ```

   Or use [incremental regeneration](https://jekyllrb.com/docs/configuration/incremental-regeneration/) (faster but less stable):

   ```bash
   bundle exec jekyll serve --incremental
   ```

4. **View the Site**

   Open your browser to [localhost:4000](http://localhost:4000)

### Common Issues

**Ruby Version Management**
If you encounter Ruby version conflicts, use a Ruby version manager like [RVM](https://rvm.io/rvm/install) or rbenv. Check `.ruby-version` for the required version.

**Bundle Install Errors**
Ensure your Ruby environment matches the `Gemfile` requirements. Older gem versions may not be compatible with newer Ruby versions.

**Jekyll-GitHub Pages Compatibility**
GitHub Pages restricts Jekyll plugins for security. See [supported versions](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll#plugins) for details.

## Development Scripts

### Update Submodule

```bash
git submodule update --remote --merge
```

### Generate Categories and Tags Data

```bash
./_scripts/generate_category_data.sh
./_scripts/generate_tag_data.sh
```

### Generate Category and Tag Pages

```bash
./_scripts/generate_category_pages.sh
./_scripts/generate_tag_pages.sh
```

## Project Structure

This site uses Jekyll with content managed in the `archives/` submodule. The archives contain historical data about events, people, projects, and organizations. See [archives/README.md](archives/README.md) for more details.

## License

This project uses a dual-license structure:

- **Code** (Jekyll templates, scripts, stylesheets, etc.): [MIT License](LICENSE)
- **Content** (website pages, documentation, archive content): [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

See [LICENSE](LICENSE) for full details.
