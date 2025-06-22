# CivicTech.ca GitHub Pages Migration Evaluation

This repository contains a draft website created with Jekyll for evaluating the feasibility and process of migrating the [CivicTech.ca](https://civictech.ca) website from WordPress to GitHub Pages.

## Purpose

The goal of this project is to explore the advantages and limitations of using Jekyll with GitHub Pages as a potential alternative to WordPress. The objective is to create a static, secure, and low-maintenance website that is easy to update and contributes to open, accessible web content.

## Why GitHub Pages?

Migrating to GitHub Pages offers multiple advantages:

- **Free Hosting** - GitHub Pages provides free hosting for public repositories, reducing hosting costs.
- **Version Control** - Using Git and GitHub enhances content version control, transparency, and collaboration.
- **Security** - Static websites are generally more secure than dynamic sites with databases, reducing some risks.
- **Open Source Collaboration** - GitHub fosters open-source collaboration, enabling contributors to submit pull requests.

## Limitations and Considerations

- **No Dynamic Content** - As a static site, GitHub Pages cannot handle server-side processing, so we rely on third-party services for dynamic features.
- **Markdown Formatting** - Content editing requires familiarity with Markdown and Git workflows, which might increase the learning curve for non-technical contributors.
- **Limited Plugin Support** - Jekyll has fewer plugins compared to WordPress, so certain functionalities may need custom solutions.

## Getting Started

Before you start, consider taking a look at the [GitHub Pages documentation](https://docs.github.com/en/pages)

1. **Clone the Repository**
   ```
   git clone https://github.com/CivicTechTO/civictechto.github.io.git
   ```
2. **Install Jekyll and Bundler**  
   Follow the [Jekyll installation guide](https://jekyllrb.com/docs/installation/) to set up Jekyll and Bundler.

3. **Install Dependencies**

   ```
   bundle install
   ```

4. **Run the Local Server**  
   Start a local development server:
   ```
   bundle exec jekyll serve
   ```

   Or use [incremental regeneration](https://jekyllrb.com/docs/configuration/incremental-regeneration/), which is faster but not stable:
   ```
   bundle exec jekyll serve  --incremental
   ```

5. **Visit Local Site**  
   Open your browser and go to `http://localhost:4000` to see the site.

## Warnings and Pitfalls

Using Jekyll with GitHub Pages offers simplicity but comes with certain setup considerations:

1. **Ruby Version Management**  
   If you encounter Ruby version conflicts, consider using a Ruby version manager like **RVM** or **rbenv**. For example, install RVM by following [these instructions](https://rvm.io/rvm/install) and use the required Ruby version specified in `.ruby-version`.

2. **Bundle Install Errors**  
   If you encounter issues with `bundle install`, ensure that your Ruby environment matches the requirements in `Gemfile`. Older versions of certain gems may not be compatible with newer Ruby versions, so adjust as needed.

3. **Jekyll-GitHub Pages Compatibility**  
   GitHub Pages restricts Jekyll plugins for security reasons. Refer to the [GitHub Pages documentation](https://pages.github.com/versions/) for supported plugins and dependencies. Unsupported plugins will not work on the live site, which may require alternative solutions.

---

## Contributing

This repository is currently under review, pending decision on next steps.

---

Handy Notes ~ Submodule Updates

```zsh
git submodule update --remote --merge
```


Local Development generative categories and tags data
```zsh
./_scripts/generate_category_data.sh
./_scripts/generate_tag_data.sh
```

and pages
```zsh
./_scripts/generate_category_pages.sh
./_scripts/generate_tag_pages.sh
```