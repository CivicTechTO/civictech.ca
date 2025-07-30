# Makefile for CivicTech.ca GitHub Pages Migration Evaluation

REPO_URL=https://github.com/CivicTechTO/civictechto.github.io.git
JEKYLL=bundle exec jekyll
SCRIPTS_DIR=./_scripts

# Default target
all: serve

# Clone the repository
clone:
	git clone $(REPO_URL)

# Install Ruby dependencies
bundle:
	bundle install

# Start Jekyll server
serve:
	$(JEKYLL) serve

# Start Jekyll server with incremental regeneration
serve-incremental:
	$(JEKYLL) serve --incremental

# Generate category and tag data
generate-data:
	$(SCRIPTS_DIR)/generate_category_data.sh
	$(SCRIPTS_DIR)/generate_tag_data.sh

# Generate category and tag pages
generate-pages:
	$(SCRIPTS_DIR)/generate_category_pages.sh
	$(SCRIPTS_DIR)/generate_tag_pages.sh

# Generate all content
generate: generate-data generate-pages

# Update Git submodules
update-submodules:
	git submodule update --remote --merge

# Clean Jekyll output
clean:
	rm -rf _site .jekyll-metadata

.PHONY: all clone bundle serve serve-incremental generate-data generate-pages generate update-submodules clean
