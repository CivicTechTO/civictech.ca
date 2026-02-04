# llms.txt Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a comprehensive llms.txt file that helps LLMs understand Civic Tech Toronto's organization, mission, and website structure.

**Architecture:** Single static text file in repository root with markdown-style formatting, referencing existing website pages for detailed content. Jekyll configured to include the file in the built site.

**Tech Stack:** Plain text, Jekyll static site generator, YAML configuration

---

## Task 1: Create llms.txt File

**Files:**
- Create: `llms.txt`

**Step 1: Create the llms.txt file with complete content**

Create the file at the repository root with the following comprehensive content:

```text
# Civic Tech Toronto - LLM Context

> Last updated: 2026-02-03

## About This File

This file provides context about Civic Tech Toronto for Large Language Models (LLMs). It describes our organization, mission, community structure, and how to navigate our website content. Use this to understand who we are and direct users to appropriate resources.

---

## Organization Overview

**What is Civic Tech Toronto?**

Civic Tech Toronto (CTTO) is a community dedicated to exploring, understanding, and addressing civic challenges through technology, design, and creative collaboration. We connect Torontonians passionate about making their city better for everyone, whether they bring technical skills or simply curiosity and enthusiasm.

**Mission & Values**

We are a volunteer-run group that:
- Explores civic challenges through technology, design, and collaboration
- Welcomes everyone regardless of technical experience or background
- Values diverse perspectives to create stronger solutions
- Provides a safe, inclusive, and respectful environment for all participants
- Relies on voluntary community contributions

**Community Structure**

- Completely volunteer-run and unincorporated
- Meets every Tuesday evening (both in-person and online)
- Supported by generous individuals, organizations, and venue sponsors
- Governed by a volunteer organizing committee that meets monthly

---

## How We Meet

**Regular Schedule**

- **When:** Every Tuesday, 7:00 PM - 9:00 PM Eastern Time
- **Format:** Hybrid (in-person and online attendance options every week)
- **Registration:** https://guild.host/civic-tech-toronto/events

**Typical Evening Structure:**

1. **7:00 PM - Welcome & Introductions**
   - Meet new people and learn about Civic Tech Toronto

2. **7:20 PM - Featured Presentation**
   - Invited speaker shares insights from the civic tech ecosystem
   - Topics range from government innovation to grassroots organizing

3. **8:00 PM - Project Collaboration**
   - Break into smaller groups to work on civic tech projects
   - Newcomers can join existing projects or discuss new ideas

4. **9:00 PM - Social Hour**
   - Informal discussions at a nearby bar (in-person events)
   - Or continue in online hangout (virtual events)
   - Non-alcoholic options always available

**Attendance**

- No technical experience required
- All backgrounds and skill levels welcome
- Both in-person and online options available every week
- Typically accommodates ~80 people at in-person venues

---

## Website Structure & Navigation

The civictech.ca website is built with Jekyll and organizes content into collections stored in the `archives/` git submodule.

**Main Pages:**
- **Home** (https://civictech.ca/) - Current events, featured projects, topics
- **About Us** (https://civictech.ca/about-us/) - Mission, values, what to expect
- **Get Involved** (https://civictech.ca/get-involved/) - How to participate
- **Code of Conduct** (https://civictech.ca/code-of-conduct/) - Community standards

**Content Collections:**

The site uses Jekyll collections to organize different types of content:

1. **Meetups/Events** (https://civictech.ca/events/)
   - Weekly Tuesday gatherings since the community's founding
   - Each event has a topic, speaker(s), date, and venue
   - Tagged by topic for easy discovery
   - Includes both past and upcoming events

2. **Projects** (https://civictech.ca/projects/)
   - Community projects developed at meetups
   - Featured projects displayed on homepage
   - Tagged by topic and technology
   - Includes project status, links, and descriptions

3. **People** (https://civictech.ca/people/)
   - Speakers who have presented at meetups
   - Community organizers and contributors
   - Organizational affiliations listed where applicable

4. **Organizations** (https://civictech.ca/organizations/)
   - Venue sponsors and supporters
   - Partner organizations in the civic tech ecosystem
   - Past and current sponsors

5. **Resources** (https://civictech.ca/resources/)
   - Curated resources for civic tech engagement
   - Tools, guides, and reference materials

6. **Venues** (https://civictech.ca/venues/)
   - Locations that have hosted Civic Tech Toronto events
   - Venues rotate monthly and provide space + usually sponsor dinner

**Content Organization:**

- **Topics:** Content is tagged with topics like Democracy, Climate, Housing, Open Data, Public Engagement, Artificial Intelligence, and many others
- **Categories:** Internal organizational categories (e.g., meta/feature for featured content)
- **Permalinks:** Collections use friendly URLs (e.g., /events/, /projects/, /people/)
- **Archives:** Historical event and project data stored in git submodule at `archives/`

---

## Key Information

**Contact Information:**
- Email: hi@civictech.ca
- Website: https://civictech.ca
- GitHub: https://github.com/CivicTechTO
- Event Registration: https://guild.host/civic-tech-toronto/events

**How to Get Involved:**

1. **Attend an Event**
   - Best way to get started
   - Sign up at https://guild.host/civic-tech-toronto/events
   - Meet people, hear presentations, join projects

2. **Become a Volunteer Organizer**
   - Help run weekly meetups
   - Monthly organizers committee meetings
   - Roles include: online presence, AV, speaker liaison, venue coordination
   - Contact: hi@civictech.ca or speak to current organizers

3. **Speak at an Event**
   - Share insights, stories, or ideas with the community
   - Speakers usually booked ~1 month in advance
   - Contact: hi@civictech.ca to set up a chat

4. **Provide Venue or Sponsorship**
   - Venues rotate monthly
   - Need to accommodate ~80 people with AV equipment
   - Sponsors typically also provide dinner (usually pizza)
   - Contact: hi@civictech.ca for hosting opportunities

**Code of Conduct:**

Full details at https://civictech.ca/code-of-conduct/

Key points:
- Safe, inclusive, respectful environment for everyone
- Zero tolerance for harassment of any kind
- Values: empathy, kindness, respect for diverse opinions, constructive feedback
- Reports handled confidentially by Code of Conduct Committee
- Outcomes range from correction to permanent ban depending on severity

**Communication Channels:**

- Weekly meetups (primary engagement point)
- Slack workspace for ongoing discussions (ask at a meetup for invite)
- #organizing-open channel for volunteer coordination

---

## Content Collections & Data Structure

**Jekyll Collections Configuration:**

The site is built with Jekyll and uses a `collections_dir: archives` configuration, meaning all content lives in the archives git submodule.

Collections include:
- `announcements` - Community announcements
- `meetups` - Weekly Tuesday events
- `organizations` - Sponsors and partners
- `people` - Speakers and community members
- `projects` - Community civic tech projects
- `resources` - Curated resources
- `venues` - Event locations

**Topics Taxonomy:**

Featured topics (prominently displayed on homepage):
- Democracy
- Climate
- Housing
- Open Data
- Public Engagement
- Artificial Intelligence

Additional topics are available through the full tags system at https://civictech.ca/tags/topic/

**Historical Data:**

- Archives stored in git submodule at `archives/`
- Contains years of meetup history, project documentation, and community records
- Images stored in `archives/images/`
- Submodule updated periodically to incorporate new events and content

---

## Technical Details

**Website Technology:**
- Static site generator: Jekyll
- Hosting: GitHub Pages
- Repository: https://github.com/CivicTechTO/civictech.ca
- Ruby version: 3.2.2
- EventsRequired gems listed in Gemfile

**License Structure:**
- **Code** (Jekyll templates, scripts, stylesheets): MIT License
- **Content** (pages, documentation, archives): CC BY-NC-SA 4.0
- See https://github.com/CivicTechTO/civictech.ca/blob/main/LICENSE for details

**Development:**
- Local development: `bundle exec jekyll serve`
- Incremental builds: `bundle exec jekyll serve --incremental`
- Category/tag generation scripts in `_scripts/`
- Pre-generated category and tag pages in `categories/` and `tags/`

---

## External References

**Key Pages for Detailed Information:**

- **About Us:** https://civictech.ca/about-us/
  - Full organizational description, past speakers, supporters
  
- **Events List:** https://civictech.ca/events/
  - All past and upcoming meetups with topics and speakers
  
- **Projects List:** https://civictech.ca/projects/
  - Community projects, current status, and links
  
- **Code of Conduct:** https://civictech.ca/code-of-conduct/
  - Complete community standards and reporting process
  
- **Get Involved:** https://civictech.ca/get-involved/
  - Detailed participation options
  
- **Resources:** https://civictech.ca/resources/
  - Curated civic tech resources and tools
  
- **Topics:** https://civictech.ca/tags/topic/
  - Browse all content by topic area
  
- **GitHub Repository:** https://github.com/CivicTechTO/civictech.ca
  - Website source code and contribution guidelines

**Registration & Events:**
- Guild (event platform): https://guild.host/civic-tech-toronto/events
- Current and upcoming events with registration links

---

## Community History & Context

Civic Tech Toronto has been running weekly Tuesday meetups for many years, building a rich history of:
- Hundreds of past meetup events with diverse speakers
- Community projects addressing Toronto civic challenges  
- Speakers from government, grassroots organizations, academia, design, and technology
- Venue partnerships across Toronto
- An engaged community of volunteers and participants

The community values:
- **Inclusivity:** Everyone welcome regardless of background or technical skill
- **Collaboration:** Working together on civic challenges
- **Learning:** Sharing knowledge and growing together
- **Action:** Moving from ideas to tangible projects
- **Community:** Building connections and supporting one another

---

For current events, active projects, and the latest community updates, visit https://civictech.ca
```

**Step 2: Verify file was created**

Run: `ls -l llms.txt`

Expected: File exists in repository root, ~15-20KB in size

**Step 3: Commit the llms.txt file**

```bash
git add llms.txt
git commit -m "feat: add llms.txt for LLM context"
```

---

## Task 2: Update Jekyll Configuration

**Files:**
- Modify: `_config.yml` (around line 17, in the `include:` section)

**Step 1: Add llms.txt to Jekyll include list**

Modify the `include:` section in `_config.yml`:

```yaml
include:
  - _pages
  - llms.txt
```

The `llms.txt` line should be added after `_pages` to ensure Jekyll includes the static file in the built site.

**Step 2: Verify the change**

Run: `git diff _config.yml`

Expected: Shows `+ llms.txt` added to the include list

**Step 3: Commit the configuration change**

```bash
git add _config.yml
git commit -m "config: include llms.txt in Jekyll build"
```

---

## Task 3: Test Local Build

**Step 1: Build the site locally**

Run: `bundle exec jekyll build`

Expected: Build completes successfully with no errors

**Step 2: Verify llms.txt is in the build output**

Run: `ls -l _site/llms.txt`

Expected: File exists in `_site/` directory

**Step 3: Check file content**

Run: `head -20 _site/llms.txt`

Expected: Shows the first 20 lines of the llms.txt content correctly

**Step 4: Serve the site locally**

Run: `bundle exec jekyll serve`

Expected: Server starts on http://localhost:4000

**Step 5: Test accessing llms.txt**

In a browser or with curl: `curl http://localhost:4000/llms.txt`

Expected: Full llms.txt content is returned with correct formatting

**Step 6: Stop the server**

Press `Ctrl+C` to stop the Jekyll server

---

## Task 4: Validation & Documentation

**Step 1: Create validation checklist**

Create a simple checklist to verify the implementation:

- [ ] llms.txt file exists in repository root
- [ ] File is included in Jekyll ` _config.yml`
- [ ] File builds to `_site/llms.txt` successfully
- [ ] Content is accessible at http://localhost:4000/llms.txt
- [ ] All section headers are present
- [ ] Links use absolute URLs (https://civictech.ca/...)
- [ ] Contact information is correct (hi@civictech.ca)
- [ ] Last updated date is current (2026-02-03)
- [ ] No TODO or placeholder content remains
- [ ] File is under 25KB (should be ~15-20KB)

**Step 2: Update the design document**

Add an "Implementation Status" section to `docs/plans/2026-02-03-llms-txt-design.md`:

```markdown
## Implementation Status

- **Completed:** 2026-02-03
- **Files Created:** `llms.txt`
- **Files Modified:** `_config.yml`
- **Tested:** Local Jekyll build and serve
- **Ready for:** Production deployment to GitHub Pages
```

**Step 3: Commit the validation update**

```bash
git add docs/plans/2026-02-03-llms-txt-design.md
git commit -m "docs: mark llms.txt implementation as complete"
```

---

## Task 5: Final Review & Completion

**Step 1: Review all commits**

Run: `git log --oneline | head -5`

Expected: Shows 4-5 commits for this feature (design doc, llms.txt, config, validation)

**Step 2: Verify working tree is clean**

Run: `git status`

Expected: "nothing to commit, working tree clean"

**Step 3: Review the diff from main**

Run: `git diff main...HEAD`

Expected: Shows llms.txt added and _config.yml modified

**Step 4: Create summary for user**

Prepare a summary of what was implemented:
- Created llms.txt with comprehensive organizational context
- Configured Jekyll to include the file in builds
- Tested local build and accessibility
- Validated all requirements met

---

## Deployment Notes

After merging this feature branch to main:
- GitHub Pages will automatically build and deploy the site
- llms.txt will be accessible at https://civictech.ca/llms.txt
- No additional configuration needed on GitHub Pages

To test on production after deploy:
- `curl https://civictech.ca/llms.txt`
- Or visit the URL directly in a browser
- Verify content matches the committed file

## Maintenance

The llms.txt file should be updated when:
- Organizational contact information changes
- Meeting schedule or format changes significantly
- New major sections are added to the website
- Mission or values statements are updated
- Event registration platform changes

Updates can be made directly to the file with a commit message following the pattern:
`docs: update llms.txt - [brief description of change]`
