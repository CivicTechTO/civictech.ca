# Makefile for civictech.ca (Hugo)

# Default target
all: serve

# Start the Hugo development server at http://localhost:1313/
serve:
	hugo server

# Build the site into public/
build:
	hugo --gc

# Check the built site: JSON-LD, feed, redirects, internal links, entities
check: build
	python3 scripts/check_output.py

# Validate that meetup image references resolve to source files
validate:
	bash scripts/validate_images.sh

# Update the archives submodule to its latest commit
update:
	git submodule update --remote --merge

# Remove the build output and the processed-image cache
clean:
	rm -rf public resources

.PHONY: all serve build check validate update clean
