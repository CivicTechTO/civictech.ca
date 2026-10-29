#!/usr/bin/env ruby
# frozen_string_literal: true

# Manages _data/redirects.csv, the site's list of legacy URL redirects.
#
# The meetup redirects used to live only in each meetup's `redirect_from`
# front matter in the archives submodule. That data is historical: the dated
# blog permalinks stop in May 2025 and the /hacknights/N/ ones after #530. So
# it was exported once to _data/redirects.csv, which this repo now owns and
# edits directly.
#
#   ruby _scripts/redirects.rb export   # one-time export; overwrites the CSV,
#                                       # including rows added by hand since
#   ruby _scripts/redirects.rb check    # fails if the archives gained a
#                                       # redirect_from the CSV doesn't have
#
# Rows added by hand after the export: the redirect_from entries of the
# site's own _pages (/hacknights/, /get-in-touch/, /volunteer-with-us/).
#
# Paths are normalized to a leading and trailing slash. When two meetups
# claim the same old URL, the export picks the meetup whose number appears in
# the URL's `hacknight-N` slug. Four 2021–2022 URLs were listed on both
# meetup N and N+1, and N+1 used to win.

require "csv"
require "date"
require "yaml"

ARCHIVES_DIR = ENV.fetch("ARCHIVES_DIR", "archives")
MEETUPS_DIR = File.join(ARCHIVES_DIR, "_meetups")
CSV_PATH = ENV.fetch("REDIRECTS_CSV", "_data/redirects.csv")

def normalize(path)
  "/#{path.to_s.strip.delete_prefix('/').delete_suffix('/')}/"
end

# Returns { from => [meetup file numbers] } for every published meetup.
def archive_redirects
  claims = Hash.new { |h, k| h[k] = [] }
  Dir[File.join(MEETUPS_DIR, "*.md")].each do |file|
    front_matter = File.read(file)[/\A---\n(.*?)\n---/m, 1] or next
    data = YAML.safe_load(front_matter, permitted_classes: [Date, Time])
    next if data["published"] == false

    meetup = File.basename(file, ".md")
    Array(data["redirect_from"]).each { |from| claims[normalize(from)] << meetup }
  end
  claims
end

def export
  rows = archive_redirects.map do |from, meetups|
    meetup =
      if meetups.uniq.size == 1
        meetups.first
      else
        slug_number = from[/hacknight-(\d+)/, 1]
        meetups.find { |m| m == slug_number } or
          abort "❌ #{from} is claimed by meetups #{meetups.join(', ')} and its slug names none of them"
      end
    [from, "/events/#{meetup}/", meetup.to_i]
  end

  CSV.open(CSV_PATH, "w") do |csv|
    csv << %w[from to]
    rows.sort_by { |from, _, meetup| [meetup, from] }.each { |from, to, _| csv << [from, to] }
  end
  puts "✅ Wrote #{rows.size} redirects to #{CSV_PATH}"
end

def check
  known = CSV.read(CSV_PATH, headers: true).map { |row| normalize(row["from"]) }
  missing = archive_redirects.keys - known
  if missing.any?
    missing.sort.each { |from| puts "❌ #{from} is in the archives' redirect_from but not in #{CSV_PATH}" }
    abort "❌ #{missing.size} redirect(s) missing from #{CSV_PATH}."
  end
  puts "✅ All archive redirect_from entries are in #{CSV_PATH}"
end

case ARGV.first
when "export" then export
when "check" then check
else abort "usage: #{$PROGRAM_NAME} export|check"
end
