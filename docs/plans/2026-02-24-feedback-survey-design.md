# Feedback Survey Page — Design

**Date:** 2026-02-24
**Status:** Approved

## Overview

A post-meetup feedback survey at `civictech.ca/feedback`. Fully anonymous, no login required. Designed to be completable in ~30 seconds (core questions only) or in more depth via optional expanders. Responses are committed as JSON files to the public `CivicTechTO/feedback` GitHub repo.

---

## Architecture

**New file:** `_pages/feedback.md` with `permalink: /feedback/`
**Layout:** existing `page` layout
**JS:** vanilla JavaScript (consistent with site conventions)

### Submission Flow

1. User fills out the form and clicks Submit
2. JS assembles a JSON object from all field values
3. JS calls the GitHub Contents API:
   `PUT /repos/CivicTechTO/feedback/contents/submissions/<filename>.json`
   using a fine-grained PAT scoped to Contents: write on that repo only
4. File is committed directly to `CivicTechTO/feedback`
5. Page replaces the form with a thank-you message

### File Naming

`submissions/YYYY-MM-DD-hacknight-NNN-<6-char-random>.json`

Sortable by date, identifiable by meetup number, random suffix prevents collision.

### PAT Handling

Stored as a Jekyll config variable — set in `_config.yml` locally (gitignored) and as a GitHub Actions secret in CI. Rendered into the page at build time. Never committed in plaintext.

The token is technically visible in rendered page source. This is acceptable: it is scoped so narrowly (write-only to one public repo) that the worst-case abuse is noise in the feedback repo.

### Feedback Repo

A new public repo `CivicTechTO/feedback` must be created. A `README.md` there should document the JSON schema. No CI or processing pipeline is needed at launch — the JSON files are the artifact.

---

## Meetup Dropdown

Jekyll populates the last ~10 meetups at build time from `site.meetups`, rendered as `<option>` elements. No dynamic fetching. The site must be rebuilt after each meetup for the latest event to appear in the dropdown (this happens automatically via the existing weekly scheduled rebuild).

---

## Question Set

### Always Visible (core — ~30 seconds)

| # | Question | Input type |
|---|---|---|
| 1 | Which meetup are you giving feedback on? | Dropdown (required) |
| 2 | Were you attending in person or online? | Toggle: In Person / Online |
| 3 | Is this your first time at Civic Tech Toronto? | Yes / No |
| 4 | How was tonight overall? | 1–5 scale |

### Conditionally Shown

**If first time = Yes:**

| Question | Input type |
|---|---|
| Did you feel welcome tonight? | 1–5 scale |
| Did you understand what was going on? | 1–5 scale |
| Would you come back? | Yes / Maybe / No |

**If attendance mode = Online:**

| Question | Input type |
|---|---|
| Could you hear and see what was happening clearly? | 1–5 scale |
| Did you feel like an equal participant, not just a viewer? | 1–5 scale |

### "Tell us more" Expander (optional, for all)

| Question | Input type |
|---|---|
| What worked well tonight? | Free text |
| What could be better? | Free text |

### "About you" Expander (optional, equity section)

Labelled clearly as anonymous and entirely optional.

| Question | Input type |
|---|---|
| How do you describe your gender identity? | Free text |
| Age range | Select: Under 18 / 18–24 / 25–34 / 35–44 / 45–54 / 55+ |
| Do you identify as a racialized person? | Yes / No / Prefer not to say |
| Do you have a disability or chronic condition? | Yes / No / Prefer not to say |
| Do you feel like someone like you belongs in this space? | 1–5 scale |
| Were tonight's topics or speakers relevant to your community or experience? | 1–5 scale |

---

## Form UX

- Single-column layout, narrow max-width, mobile-first
- No required fields except the meetup dropdown
- Conditional questions slide in when relevant toggles change
- Optional sections use native `<details>`/`<summary>` (Pico CSS compatible)
- Submit button disabled until meetup is selected

**Submission states:**
- **Submitting:** button shows "Sending…", disabled
- **Success:** form replaced with "Thanks — your feedback helps us improve every week."
- **Error:** inline message below button: "Something went wrong. You can try again or email hi@civictech.ca."

---

## JSON Schema

```json
{
  "meetup_number": "519",
  "submitted_at": "2026-02-24T20:15:00Z",
  "attendance_mode": "in-person",
  "first_time": true,
  "overall_rating": 4,
  "new_attendee": {
    "felt_welcome": 5,
    "understood_what_was_happening": 4,
    "would_return": "yes"
  },
  "online": {
    "av_quality": null,
    "felt_included": null
  },
  "general": {
    "liked": "The speaker was great",
    "improve": "More breakout time"
  },
  "equity": {
    "gender_identity": "non-binary",
    "age_range": "25-34",
    "racialized": "yes",
    "disability": "no",
    "belongs_here": 4,
    "topics_relevant": 3
  }
}
```

Fields not applicable to a given respondent are omitted or `null`.
