# Makefile for CivicTech.ca GitHub Pages Migration Evaluation

REPO_URL=https://github.com/CivicTechTO/civictechto.github.io.git
JEKYLL=bundle exec jekyll
SCRIPTS_DIR=./_scripts

# Default target
all: serve

# Install Ruby dependencies
install:
	bundle install

# Start Jekyll server (uses _config.local.yml if present)
serve:
	@if [ -f _config.local.yml ]; then \
		$(JEKYLL) serve --config _config.yml,_config.local.yml; \
	else \
		$(JEKYLL) serve; \
	fi

# Start Jekyll server with incremental regeneration
serve-incremental:
	@if [ -f _config.local.yml ]; then \
		$(JEKYLL) serve --incremental --config _config.yml,_config.local.yml; \
	else \
		$(JEKYLL) serve --incremental; \
	fi

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
update:
	git submodule update --remote --merge

# Clean Jekyll output
clean:
	rm -rf _site .jekyll-metadata

.PHONY: all bundle serve serve-incremental generate-data generate-pages generate update-submodules clean
