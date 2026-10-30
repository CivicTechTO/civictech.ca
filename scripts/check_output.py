#!/usr/bin/env python3
"""Check the Hugo POC's built site for problems a page-by-page look would miss.

Usage: python3 scripts/check_output.py [public-dir]   (default public/)

Standard library only. Exits non-zero and lists each failure. Checks:
  jsonld     every ld+json block parses; meetups are Events; no literal entities
  feed       feed.xml is Atom with complete entries; summaries have no entities
  redirects  every _redirects target exists, and each old URL is served by a
             redirect stub or the 404.html map with the same target;
             every assets/redirects.csv row is included
  links      internal href/src/srcset and og/twitter image URLs resolve
  entities   no double-escaped entities (&amp;rsquo;) in HTML
"""

import csv
import functools
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

BASE = "https://civictech.ca"
ROOT = Path(__file__).resolve().parent.parent
PUBLIC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "public"
ENTITY = re.compile(r"&(?:[a-zA-Z]+|#\d+);")
DOUBLE_ESCAPED = re.compile(r"&amp;(?:[a-zA-Z]+|#\d+);")
ATOM = "{http://www.w3.org/2005/Atom}"

failures = {}


def fail(check, message):
    failures.setdefault(check, []).append(message)


@functools.cache
def listing(directory):
    return set(os.listdir(directory)) if directory.is_dir() else set()


def is_file(path):
    """Path.is_file, but case-sensitive on macOS too, as web hosts are."""
    parts = path.relative_to(PUBLIC).parts
    directory = PUBLIC
    for part in parts:
        if part not in listing(directory):
            return False
        directory = directory / part
    return directory.is_file()


def resolves(path):
    """Whether a site path such as /events/1/ maps to a built file."""
    path = unquote(path)
    target = PUBLIC / path.lstrip("/")
    if path.endswith("/"):
        return is_file(target / "index.html")
    return is_file(target) or is_file(target / "index.html")


def internal_path(url):
    """The site path of an internal URL, or None for external ones."""
    if url.startswith(BASE + "/"):
        url = url[len(BASE):]
    if not url.startswith("/") or url.startswith("//"):
        return None
    return urlsplit(url).path


class Page(HTMLParser):
    """Collects the parts of a page the checks look at."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.urls = []
        self.jsonld = []
        self.refresh = None
        self._in_jsonld = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "script" and a.get("type") == "application/ld+json":
            self._in_jsonld = True
            self.jsonld.append("")
        if tag == "meta" and a.get("http-equiv") == "refresh":
            self.refresh = a.get("content", "").split("url=", 1)[-1]
        if tag == "meta" and a.get("property", a.get("name")) in ("og:image", "twitter:image"):
            self.urls.append(a.get("content", ""))
        for attr in ("href", "src"):
            if a.get(attr):
                self.urls.append(a[attr])
        if a.get("srcset"):
            self.urls += [c.split()[0] for c in a["srcset"].split(",") if c.strip()]

    def handle_endtag(self, tag):
        if tag == "script":
            self._in_jsonld = False

    def handle_data(self, data):
        if self._in_jsonld:
            self.jsonld[-1] += data


def strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for v in value.values():
            yield from strings(v)
    elif isinstance(value, list):
        for v in value:
            yield from strings(v)


def check_pages():
    broken = {}
    for file in sorted(PUBLIC.rglob("*.html")):
        rel = "/" + str(file.relative_to(PUBLIC)).removesuffix("index.html")
        html = file.read_text(encoding="utf-8")
        for match in set(DOUBLE_ESCAPED.findall(html)):
            fail("entities", f"{rel}: {match}")
        page = Page()
        page.feed(html)
        if page.refresh:
            continue  # redirect stubs are checked with the redirects
        for block in page.jsonld:
            try:
                data = json.loads(block)
            except json.JSONDecodeError as e:
                fail("jsonld", f"{rel}: {e}")
                continue
            for s in strings(data):
                if ENTITY.search(s):
                    fail("jsonld", f"{rel}: literal entity in {s[:60]!r}")
                    break
            if re.fullmatch(r"/events/\d+/", rel):
                missing = [k for k in ("name", "startDate") if not data.get(k)]
                if data.get("@type") != "Event" or missing:
                    fail("jsonld", f"{rel}: not a complete Event ({data.get('@type')}, missing {missing})")
        for url in page.urls:
            path = internal_path(url)
            if path is not None and not resolves(path):
                broken.setdefault(path, rel)
    for path, page in sorted(broken.items()):
        fail("links", f"{path} (linked from {page})")


def check_feed():
    try:
        feed = ET.parse(PUBLIC / "feed.xml").getroot()
    except (OSError, ET.ParseError) as e:
        fail("feed", f"feed.xml: {e}")
        return
    if feed.tag != ATOM + "feed":
        fail("feed", f"root element is {feed.tag}, not an Atom feed")
    entries = feed.findall(ATOM + "entry")
    if not entries:
        fail("feed", "no entries")
    for entry in entries:
        link = entry.find(ATOM + "link")
        label = link.get("href") if link is not None else "entry"
        for field in ("id", "title", "updated", "summary"):
            if not (entry.findtext(ATOM + field) or "").strip():
                fail("feed", f"{label}: empty <{field}>")
        if link is None or internal_path(link.get("href", "")) is None:
            fail("feed", f"{label}: missing or external <link>")
        elif not resolves(internal_path(link.get("href"))):
            fail("feed", f"{label}: link target not built")
        if ENTITY.search(entry.findtext(ATOM + "summary") or ""):
            fail("feed", f"{label}: literal entity in <summary>")
    if 'href="https://civictech.ca/feed.xml"' not in (PUBLIC / "index.html").read_text(encoding="utf-8"):
        fail("feed", "home page has no feed discovery link")


def check_redirects():
    stub_target = re.compile(r'http-equiv="refresh" content="0; url=([^"]+)"')
    page_404 = (PUBLIC / "404.html").read_text(encoding="utf-8")
    match = re.search(r"var moved = (\{.*?\});", page_404)
    moved = json.loads(match.group(1)) if match else {}
    if not match:
        fail("redirects", "404.html has no forwarding map")
    rules = {}
    for line in (PUBLIC / "_redirects").read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        old, new, _status = line.split()
        rules[unquote(old)] = new
        if not resolves(new):
            fail("redirects", f"{old} -> {new}: target not built")
            continue
        stub = PUBLIC / unquote(old).lstrip("/")
        stub = stub if stub.suffix == ".html" else stub / "index.html"
        if is_file(stub):
            found = stub_target.search(stub.read_text(encoding="utf-8"))
            served = internal_path(found.group(1)) if found else None
            if served != new:
                fail("redirects", f"{old}: stub goes to {served}, _redirects to {new}")
        elif moved.get(unquote(old)) != new:
            fail("redirects", f"{old}: no stub and 404.html map has {moved.get(unquote(old))}")
    with open(ROOT / "assets" / "redirects.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row["from"] not in rules:
                fail("redirects", f"{row['from']}: in assets/redirects.csv but not _redirects")


if __name__ == "__main__":
    if not (PUBLIC / "index.html").is_file():
        sys.exit(f"No built site at {PUBLIC}; run hugo first.")
    check_pages()
    check_feed()
    check_redirects()
    for check in ("jsonld", "feed", "redirects", "links", "entities"):
        problems = failures.get(check, [])
        print(f"{check}: {'ok' if not problems else f'{len(problems)} failed'}")
        for message in problems[:20]:
            print(f"  {message}")
        if len(problems) > 20:
            print(f"  … and {len(problems) - 20} more")
    sys.exit(1 if failures else 0)
