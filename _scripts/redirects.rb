#!/usr/bin/env ruby
# frozen_string_literal: true

# Manages _data/redirects.csv, the site's list of legacy URL redirects.
#
# Old URLs used to live only in `redirect_from` front matter in the archives
# submodule (meetups and announcements). That data is historical: the dated
# blog permalinks stop in 2025 and the /hacknights/N/ ones after #530. So it
# was exported to _data/redirects.csv, which this repo now owns and edits
# directly.
#
#   ruby _scripts/redirects.rb export   # rewrite the archive-derived rows,
#                                       # keeping rows added by hand
#   ruby _scripts/redirects.rb check    # fail if the archives gained a
#                                       # redirect_from the CSV doesn't have
#
# Columns are `from,to`. `from` is an old URL path, normalized to a leading
# and trailing slash. `to` is either a site path ("/events/") or an archive
# record ("_meetups/99.md"). The site generator resolves a record to the
# record's current URL, so the CSV doesn't depend on any URL scheme. Rows
# added by hand use site paths: the redirect_from entries of the site's own
# _pages (/hacknights/, /get-in-touch/, /volunteer-with-us/).
#
# When two meetups claim the same old URL, the export picks the meetup whose
# number appears in the URL's `hacknight-N` slug. Four 2021–2022 URLs were
# listed on both meetup N and N+1, and N+1 used to win.

require "csv"
require "date"
require "yaml"

ARCHIVES_DIR = ENV.fetch("ARCHIVES_DIR", "archives")
CSV_PATH = ENV.fetch("REDIRECTS_CSV", "_data/redirects.csv")

def normalize(path)
  "/#{path.to_s.strip.delete_prefix('/').delete_suffix('/')}/"
end

# Returns { from => [archive records] } for every published document, where
# a record is its path relative to the archives ("_meetups/99.md").
def archive_redirects
  claims = Hash.new { |h, k| h[k] = [] }
  Dir[File.join(ARCHIVES_DIR, "_*", "*.md")].each do |file|
    front_matter = File.read(file)[/\A---\n(.*?)\n---/m, 1] or next
    data = YAML.safe_load(front_matter, permitted_classes: [Date, Time])
    next if data["published"] == false

    record = file.delete_prefix("#{ARCHIVES_DIR}/")
    Array(data["redirect_from"]).each { |from| claims[normalize(from)] << record }
  end
  claims
end

def export
  rows = archive_redirects.map do |from, records|
    record =
      if records.uniq.size == 1
        records.first
      else
        slug_number = from[/hacknight-(\d+)/, 1]
        records.find { |r| r == "_meetups/#{slug_number}.md" } or
          abort "❌ #{from} is claimed by #{records.join(', ')} and its slug names none of them"
      end
    [from, record]
  end
  # Meetups by number, then everything else by path.
  rows.sort_by! { |from, record| [record.start_with?("_meetups/") ? 0 : 1, record[/\d+/].to_i, record, from] }

  # Keep rows added by hand, unless an archive row now covers the same URL.
  derived = rows.map(&:first)
  by_hand = File.exist?(CSV_PATH) ? CSV.read(CSV_PATH, headers: true).reject { |row| row["to"].start_with?("_") } : []
  replaced, by_hand = by_hand.partition { |row| derived.include?(normalize(row["from"])) }
  puts "ℹ️  #{replaced.size} hand-added row(s) replaced by archive rows" if replaced.any?

  CSV.open(CSV_PATH, "w") do |csv|
    csv << %w[from to]
    rows.each { |row| csv << row }
    by_hand.each { |row| csv << [row["from"], row["to"]] }
  end
  puts "✅ Wrote #{rows.size} archive redirects and kept #{by_hand.size} added by hand in #{CSV_PATH}"
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
