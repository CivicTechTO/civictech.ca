# CivicTech Toronto Archive

👋 Welcome to the CivicTech Toronto Archive!

## 01. About

This repository contains historical data and resources related to past CivicTech Toronto events and Activities.

### Initiative Updates

- 2025-10-18: Completed conservative generative tagging with human oversight on hacknights up to # 514
- 2025-06-15: Considerable milestone rework to support launch of updated CivicTech Toronto website.
- 2025-02-12: Release (Happy Valentines Day Toronto `(⸝⸝♥‿♥⸝⸝)`) – @jordyarms
- 2025-02-11: Preparation for release – @jordyarms
- 2025-01-24: Initializing a git archive – @jordyarms

## 02. Format

The archive utilizes Markdown files with YAML frontmatter to ensure that data is both human-readable and sustainable. This combination allows for easy editing and management of the archive's data.

### YAML

YAML is a human-readable data serialization standard that is commonly used for configuration files and data exchange between languages with different data structures.

The YAML frontmatter at the beginning of each Markdown file stores metadata such as event dates, titles, and descriptions, which aids in organizing and processing the content efficiently.

https://en.wikipedia.org/wiki/YAML | https://yaml.org

### Markdown

Markdown is a lightweight markup language with plain text formatting syntax. It is often used to create formatted text using a plain-text editor.

In this archive, Markdown files are used to document events, and they include frontmatter to store metadata. Frontmatter in this archive is a block of YAML at the top of the file may contain key-value pairs, which can be used by static site generators and other tools to process the content.

https://en.wikipedia.org/wiki/Markdown | https://commonmark.org | https://www.markdownguide.org

#### Obsidian Markdown Wikilinks-flavored Links

Currently the Markdown and YAML frontmatter make use of Obsidian-style wikilinks. This feature allows for creation of internal links between notes using double square brackets. For example, `[[Note Title]]` will link to a note titled "Note Title".

There is a substantial tradeoff between convenience in editing and the sustainable use of linked data URLs. Therefore, the use of Wikilinks may be subject to change in future refinements.

## 03. Structure

### Overview

To explore the archived events, projects and other information you can navigate through the folders in this repository.

```
archive/
├── _announcements/   # Documentation of instances of announcements (predominantly historical content).
├── _hacknights/      # Documentation of instances of hacknights.
├── _organizations/   # Documentation of instances of organizations (& supporters).
├── _people/          # Documentation of instances of speakers & organizers.
├── _projects/        # Documentation of instances of projects.
├── _venues/          # Documentation of instances of venues.
├── utilities/
│   ├── automations/ # Automation based tooling for archiving convenience.
│   ├── reference/   # Reference matterials regarding archiving activity.
│   ├── sources/     # Reuseable text snippets applicable to automations.
│   └── templates/   # Markdown templates applicable to authoring efforts.
└── README.md        # This file  -(·.·-)
```

## 04. Contributing

Further interaction is possible through cloning the archive locally or making use of integrated edited tools.

We welcome contributions to improve this archive. If you have materials not yet included, please submit a pull request or reach out via [\#org-archives](https://civictechto.slack.com/archives/C08A7SC2TC2).

### Git-based Version Management

Using git for version management ensures that the maintenance of this repository is accessible and transparent. Git allows for tracking changes, collaborating with others, and maintaining a history of modifications, making it easier to manage and update the archive efficiently.

### Tools for Editing

See the [Tools Reference](utilities/reference/tools_reference.md) file.

## 05. License

The content is licensed with a CREATIVE COMMONS ATTRIBUTION-NONCOMMERCIAL-SHAREALIKE 4.0 License [CC BY-NC-SA 4.0 License](LICENSE), you can read more at [https://creativecommons.org/licenses/by-nc-sa/4.0/](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## 06. Community & Support

For questions, concerns or comments reach out to [\#org-archives](https://civictechto.slack.com/archives/C08A7SC2TC2) slack channel via the Civic Tech Toronto slack.

## 07. Acknowledgments

Special thanks to all contributors, community members, speakers, and organizations supporting our CivicTech Toronto community.
