#!/usr/bin/env ruby
# frozen_string_literal: true

# Writes content/about-us.md from ../_pages/about-us.md, replacing its two
# Liquid loops with the featured-speakers and featured-supporters shortcodes.
# Run from hugo-poc/ after editing the Jekyll page:
#
#   ruby sync-about-us.rb

SOURCE = File.expand_path("../_pages/about-us.md", __dir__)
TARGET = File.expand_path("content/about-us.md", __dir__)

body = File.read(SOURCE).sub(/\A---\n.*?\n---\n/m, "")

# Each loop runs from its `{% assign featured_… %}` to the `{% endfor %}`
# that closes the grid.
body = body.sub(/^  \{% assign featured_speakers.*?\{% endfor %\}\n(?=\n<\/div>)/m, "{{< featured-speakers >}}\n")
body = body.sub(/^  \{% assign featured_sponsors.*?\{% endfor %\}\n(?=\n<\/div>)/m, "{{< featured-supporters >}}\n")
body = body.gsub("{{ '/people' | relative_url }}", "/people")

leftover = body.lines.grep(/\{%|\{\{ /)
abort "❌ Untranslated Liquid in #{SOURCE}:\n#{leftover.join}" if leftover.any?

File.write(TARGET, <<~MD + body)
  ---
  title: "About Us"
  ---
  <!-- Generated from _pages/about-us.md by sync-about-us.rb, with its two
       Liquid loops replaced by the featured-speakers and featured-supporters
       shortcodes. Keep in sync until the Jekyll site is retired. -->
MD
puts "✅ Wrote #{TARGET}"
