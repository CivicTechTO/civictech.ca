# Contributing to CivicTech Toronto

Thank you for your interest in contributing to CivicTech Toronto's website! We welcome contributions from the community.

All contributors are expected to follow our [Code of Conduct](https://civictech.ca/code-of-conduct/).

## Ways to Contribute

### Archive Content Contributions

The `archives/` directory contains historical data about CivicTech Toronto events, people, projects, organizations, and resources. This content is primarily maintained by the community archivist, but we welcome contributions for:

- Resource recommendations
- Community project additions or updates
- Speaker profile corrections or enhancements
- Historical event information corrections

**How to contribute archive content:**

1. **Submit an issue** describing the correction, addition, or update you'd like to make
2. **Submit a pull request** with your proposed changes (see [archives/README.md](archives/README.md) for details on the archive structure)
3. **Join the conversation** on Slack in the [#org-archives](https://civictechto.slack.com/archives/C08A7SC2TC2) channel

For detailed information about the archive, see [archives/README.md](archives/README.md).

### Website & Code Contributions

Contributions to improve the website pages, functionality, design, or developer experience are welcome!

#### Getting Started

1. **Fork the repository** and clone it locally
2. **Follow the setup instructions** in the [README.md](README.md) to get your development environment running
3. **Create a new branch** for your changes:
   ```bash
   git checkout -b your-feature-name
   ```

#### Making Changes

- Website pages are located in `content/`, templates in `layouts/`, and styles and scripts in `static/assets/`
- Test your changes locally by running `hugo server`
- Preview at [localhost:1313](http://localhost:1313) before submitting
- Run `make check` to catch broken links, redirects, structured data and feed problems

#### Submitting a Pull Request

1. **Test locally** - Make sure the site builds, `make check` passes, and pages display correctly
2. **Write a clear description** - Explain what your changes do and why
3. **Link to related issues** - If your PR addresses an issue, reference it
4. **Be responsive** - Be prepared to discuss and iterate on your changes

Example PR description:

```
## Summary
Brief description of what this PR does

## Changes
- List of specific changes made

## Testing
How you tested these changes locally

Fixes #123
```

## Questions or Need Help?

- **GitHub Issues** - For bug reports, feature requests, or questions about contributing
- **Slack** - Join the conversation on [CivicTech Toronto Slack](https://civictechto.slack.com)
  - [#org-archives](https://civictechto.slack.com/archives/C08A7SC2TC2) for archive-related discussions
  - General channels for website and community questions

## Development Notes

### Updating the Archives Submodule

If you're working with archive content:

```bash
git submodule update --remote --merge
```

### Tags and Categories

Tag and category pages are built by Hugo from the archive front matter, so there's nothing to regenerate. A new namespace (the part before the `/`, as in `topic/open-data`) must be added to `params.namespaces` in `hugo.toml`; the build stops with a message if one is missing.

## License

This project uses a dual-license structure:

- **Code contributions** (Hugo templates, scripts, stylesheets, etc.) are licensed under the **MIT License**
- **Content contributions** (website pages, documentation, archive content) are licensed under **CC BY-NC-SA 4.0**

By contributing to this project, you agree that your contributions will be licensed under the appropriate license based on the type of contribution. See [LICENSE](LICENSE) for full details.
