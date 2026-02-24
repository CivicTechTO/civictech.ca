# Feedback Survey Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an anonymous post-meetup feedback form at `/feedback/` that commits JSON responses to a public `CivicTechTO/feedback` GitHub repo via the GitHub Contents API.

**Architecture:** A new Jekyll page at `_pages/feedback.md` using vanilla JavaScript for conditional question logic and GitHub API submission. A scoped fine-grained PAT is injected at build time via a Jekyll config override (locally: `_config.local.yml`; in CI: a GitHub Actions secret appended to `_config.yml` before the build step).

**Tech Stack:** Jekyll 4, Pico CSS (existing), vanilla JS (fetch API + btoa), GitHub Contents API v3

---

## Prerequisites (Manual — Do Before Any Code)

### Step 1: Create the `CivicTechTO/feedback` repo

Go to https://github.com/organizations/CivicTechTO/repositories/new and create a **public** repo named `feedback`. Initialize it with a README.

### Step 2: Create a fine-grained PAT

1. Go to https://github.com/settings/personal-access-tokens/new
2. Name: `civictech-ca feedback form`
3. Resource owner: `CivicTechTO`
4. Repository access: **Only select repositories** → `CivicTechTO/feedback`
5. Permissions: **Contents → Read and write**
6. Generate token and copy it — you'll need it in Tasks 2 and 3

---

## Task 1: Configure token in Jekyll and CI

**Files:**
- Modify: `_config.yml`
- Modify: `.gitignore`
- Modify: `Makefile`
- Modify: `.github/workflows/pages.yml`

**Step 1: Add token placeholder to `_config.yml`**

Add this line near the top of `_config.yml`, after the `description:` block:

```yaml
feedback_token: ""
```

**Step 2: Add `_config.local.yml` to `.gitignore`**

Append to `.gitignore`:

```
# Local config override (contains secrets)
_config.local.yml
```

**Step 3: Create `_config.local.yml` locally (do not commit)**

Create a new file `_config.local.yml` in the project root:

```yaml
feedback_token: "YOUR_PAT_HERE"
```

Replace `YOUR_PAT_HERE` with the token from the prerequisite step.

**Step 4: Update `Makefile` serve targets to use local config when present**

Replace both `serve` and `serve-incremental` targets:

```makefile
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
```

**Step 5: Add secret injection step to `pages.yml`**

In `.github/workflows/pages.yml`, add this step immediately **before** the "Build Jekyll site" step:

```yaml
      - name: Inject feedback token
        run: echo "feedback_token: $FEEDBACK_TOKEN" >> _config.yml
        env:
          FEEDBACK_TOKEN: ${{ secrets.FEEDBACK_TOKEN }}
```

**Step 6: Add `FEEDBACK_TOKEN` secret to the GitHub repo**

Go to https://github.com/CivicTechTO/civictech.ca/settings/secrets/actions and add a new secret:
- Name: `FEEDBACK_TOKEN`
- Value: the PAT from the prerequisite step

**Step 7: Verify locally**

```bash
make serve
```

Open http://localhost:4000. Site should load normally. No errors about missing config.

**Step 8: Commit**

```bash
git add _config.yml .gitignore Makefile .github/workflows/pages.yml
git commit -m "Configure feedback form token injection for build"
```

---

## Task 2: Create the feedback page — form structure and core questions

**Files:**
- Create: `_pages/feedback.md`

**Step 1: Create `_pages/feedback.md` with core questions**

```markdown
---
title: "Share Your Feedback"
layout: page
permalink: "/feedback/"
---

<p>Help us make Civic Tech Toronto better. This form is completely anonymous — we never collect names or email addresses.</p>

<form id="feedback-form" novalidate>

  <label for="meetup">Which meetup are you giving feedback on?</label>
  <select id="meetup" name="meetup">
    <option value="">Select a meetup…</option>
    {% assign recent_meetups = site.meetups | sort: "date" | reverse %}
    {% for meetup in recent_meetups limit:10 %}
    <option value="{{ meetup.number }}">
      Hacknight #{{ meetup.number }} – {{ meetup.date | date: "%B %d, %Y" }}{% if meetup.topic %} – {{ meetup.topic }}{% endif %}
    </option>
    {% endfor %}
  </select>

  <fieldset>
    <legend>Were you attending in person or online?</legend>
    <label><input type="radio" name="attendance_mode" value="in-person"> In Person</label>
    <label><input type="radio" name="attendance_mode" value="online"> Online</label>
  </fieldset>

  <fieldset>
    <legend>Is this your first time at Civic Tech Toronto?</legend>
    <label><input type="radio" name="first_time" value="yes"> Yes</label>
    <label><input type="radio" name="first_time" value="no"> No</label>
  </fieldset>

  <fieldset>
    <legend>How was tonight overall?</legend>
    <div class="rating-row">
      <label><input type="radio" name="overall_rating" value="1"> 1</label>
      <label><input type="radio" name="overall_rating" value="2"> 2</label>
      <label><input type="radio" name="overall_rating" value="3"> 3</label>
      <label><input type="radio" name="overall_rating" value="4"> 4</label>
      <label><input type="radio" name="overall_rating" value="5"> 5</label>
    </div>
    <small>1 = poor, 5 = excellent</small>
  </fieldset>

  <!-- Conditional: new attendee questions -->
  <section id="new-attendee-section" hidden>
    <h3>As a first-timer…</h3>

    <fieldset>
      <legend>Did you feel welcome tonight?</legend>
      <div class="rating-row">
        <label><input type="radio" name="felt_welcome" value="1"> 1</label>
        <label><input type="radio" name="felt_welcome" value="2"> 2</label>
        <label><input type="radio" name="felt_welcome" value="3"> 3</label>
        <label><input type="radio" name="felt_welcome" value="4"> 4</label>
        <label><input type="radio" name="felt_welcome" value="5"> 5</label>
      </div>
      <small>1 = not at all, 5 = very welcome</small>
    </fieldset>

    <fieldset>
      <legend>Did you understand what was going on?</legend>
      <div class="rating-row">
        <label><input type="radio" name="understood" value="1"> 1</label>
        <label><input type="radio" name="understood" value="2"> 2</label>
        <label><input type="radio" name="understood" value="3"> 3</label>
        <label><input type="radio" name="understood" value="4"> 4</label>
        <label><input type="radio" name="understood" value="5"> 5</label>
      </div>
      <small>1 = confused, 5 = totally clear</small>
    </fieldset>

    <fieldset>
      <legend>Would you come back?</legend>
      <label><input type="radio" name="would_return" value="yes"> Yes</label>
      <label><input type="radio" name="would_return" value="maybe"> Maybe</label>
      <label><input type="radio" name="would_return" value="no"> No</label>
    </fieldset>
  </section>

  <!-- Conditional: online attendee questions -->
  <section id="online-section" hidden>
    <h3>Online experience</h3>

    <fieldset>
      <legend>Could you hear and see what was happening clearly?</legend>
      <div class="rating-row">
        <label><input type="radio" name="av_quality" value="1"> 1</label>
        <label><input type="radio" name="av_quality" value="2"> 2</label>
        <label><input type="radio" name="av_quality" value="3"> 3</label>
        <label><input type="radio" name="av_quality" value="4"> 4</label>
        <label><input type="radio" name="av_quality" value="5"> 5</label>
      </div>
      <small>1 = poor, 5 = excellent</small>
    </fieldset>

    <fieldset>
      <legend>Did you feel like an equal participant, not just a viewer?</legend>
      <div class="rating-row">
        <label><input type="radio" name="felt_included" value="1"> 1</label>
        <label><input type="radio" name="felt_included" value="2"> 2</label>
        <label><input type="radio" name="felt_included" value="3"> 3</label>
        <label><input type="radio" name="felt_included" value="4"> 4</label>
        <label><input type="radio" name="felt_included" value="5"> 5</label>
      </div>
      <small>1 = not at all, 5 = fully included</small>
    </fieldset>
  </section>

  <!-- Optional expander: general feedback -->
  <details>
    <summary>Tell us more (optional)</summary>

    <label for="liked">What worked well tonight?</label>
    <textarea id="liked" name="liked" rows="3"></textarea>

    <label for="improve">What could be better?</label>
    <textarea id="improve" name="improve" rows="3"></textarea>
  </details>

  <!-- Optional expander: equity questions -->
  <details>
    <summary>About you (optional)</summary>
    <p><small>All fields in this section are completely optional and anonymous. This information helps us understand who is showing up and whether everyone feels included.</small></p>

    <label for="gender_identity">How do you describe your gender identity?</label>
    <input type="text" id="gender_identity" name="gender_identity" placeholder="Your own words">

    <label for="age_range">Age range</label>
    <select id="age_range" name="age_range">
      <option value="">Prefer not to say</option>
      <option value="under-18">Under 18</option>
      <option value="18-24">18–24</option>
      <option value="25-34">25–34</option>
      <option value="35-44">35–44</option>
      <option value="45-54">45–54</option>
      <option value="55+">55+</option>
    </select>

    <fieldset>
      <legend>Do you identify as a racialized person?</legend>
      <label><input type="radio" name="racialized" value="yes"> Yes</label>
      <label><input type="radio" name="racialized" value="no"> No</label>
      <label><input type="radio" name="racialized" value="prefer-not-to-say"> Prefer not to say</label>
    </fieldset>

    <fieldset>
      <legend>Do you have a disability or chronic condition?</legend>
      <label><input type="radio" name="disability" value="yes"> Yes</label>
      <label><input type="radio" name="disability" value="no"> No</label>
      <label><input type="radio" name="disability" value="prefer-not-to-say"> Prefer not to say</label>
    </fieldset>

    <fieldset>
      <legend>Do you feel like someone like you belongs in this space?</legend>
      <div class="rating-row">
        <label><input type="radio" name="belongs_here" value="1"> 1</label>
        <label><input type="radio" name="belongs_here" value="2"> 2</label>
        <label><input type="radio" name="belongs_here" value="3"> 3</label>
        <label><input type="radio" name="belongs_here" value="4"> 4</label>
        <label><input type="radio" name="belongs_here" value="5"> 5</label>
      </div>
      <small>1 = not at all, 5 = absolutely</small>
    </fieldset>

    <fieldset>
      <legend>Were tonight's topics or speakers relevant to your community or experience?</legend>
      <div class="rating-row">
        <label><input type="radio" name="topics_relevant" value="1"> 1</label>
        <label><input type="radio" name="topics_relevant" value="2"> 2</label>
        <label><input type="radio" name="topics_relevant" value="3"> 3</label>
        <label><input type="radio" name="topics_relevant" value="4"> 4</label>
        <label><input type="radio" name="topics_relevant" value="5"> 5</label>
      </div>
      <small>1 = not relevant, 5 = very relevant</small>
    </fieldset>
  </details>

  <button type="submit" id="submit-btn" disabled>Submit Feedback</button>

</form>

<div id="success-message" hidden>
  <p>Thanks — your feedback helps us improve every week.</p>
</div>

<div id="error-message" hidden>
  <p>Something went wrong. You can try again or email <a href="mailto:hi@civictech.ca">hi@civictech.ca</a>.</p>
</div>
```

**Step 2: Verify locally**

```bash
make serve
```

Visit http://localhost:4000/feedback/ — the form should render with the meetup dropdown populated, all fieldsets visible, and the two `<details>` expanders collapsed. The submit button should be disabled. No JS yet so no interactivity.

**Step 3: Commit**

```bash
git add _pages/feedback.md
git commit -m "Add feedback page with form structure and all questions"
```

---

## Task 3: Add a small CSS rule for inline rating rows

**Files:**
- Modify: `assets/css/custom.css`

**Step 1: Read `assets/css/custom.css` first**, then append:

```css
/* Feedback form: inline rating scale */
.rating-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
}
.rating-row label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
```

**Step 2: Verify locally**

```bash
make serve
```

Visit http://localhost:4000/feedback/ — rating inputs should now appear side-by-side on one line rather than stacked.

**Step 3: Commit**

```bash
git add assets/css/custom.css
git commit -m "Add inline rating row style for feedback form"
```

---

## Task 4: Add conditional question JS and submit-enable logic

**Files:**
- Modify: `_pages/feedback.md` — add `<script>` block at the bottom (before the closing of the file)

**Step 1: Add the following `<script>` block at the very end of `_pages/feedback.md`**

```html
<script>
(function () {
  var form = document.getElementById('feedback-form');
  var submitBtn = document.getElementById('submit-btn');
  var meetupSelect = document.getElementById('meetup');
  var newAttendeeSection = document.getElementById('new-attendee-section');
  var onlineSection = document.getElementById('online-section');

  // Enable submit button once a meetup is selected
  meetupSelect.addEventListener('change', function () {
    submitBtn.disabled = !meetupSelect.value;
  });

  // Show/hide new-attendee section based on first_time radio
  form.querySelectorAll('input[name="first_time"]').forEach(function (input) {
    input.addEventListener('change', function () {
      newAttendeeSection.hidden = (input.value !== 'yes');
    });
  });

  // Show/hide online section based on attendance_mode radio
  form.querySelectorAll('input[name="attendance_mode"]').forEach(function (input) {
    input.addEventListener('change', function () {
      onlineSection.hidden = (input.value !== 'online');
    });
  });
})();
</script>
```

**Step 2: Verify locally**

```bash
make serve
```

Visit http://localhost:4000/feedback/ and confirm:
- Submit button is disabled until you select a meetup from the dropdown
- Selecting "Yes" for first-time reveals the new-attendee questions; selecting "No" hides them again
- Selecting "Online" reveals the online section; "In Person" hides it

**Step 3: Commit**

```bash
git add _pages/feedback.md
git commit -m "Add conditional question visibility and submit-enable JS"
```

---

## Task 5: Add GitHub API submission

**Files:**
- Modify: `_pages/feedback.md` — replace the `<script>` block with the full version below

**Step 1: Replace the existing `<script>` block** (the one added in Task 4) with this complete version:

```html
<script>
(function () {
  var GITHUB_TOKEN = '{{ site.feedback_token }}';
  var FEEDBACK_REPO = 'CivicTechTO/feedback';

  var form = document.getElementById('feedback-form');
  var submitBtn = document.getElementById('submit-btn');
  var meetupSelect = document.getElementById('meetup');
  var newAttendeeSection = document.getElementById('new-attendee-section');
  var onlineSection = document.getElementById('online-section');
  var successMessage = document.getElementById('success-message');
  var errorMessage = document.getElementById('error-message');

  // Enable submit button once a meetup is selected
  meetupSelect.addEventListener('change', function () {
    submitBtn.disabled = !meetupSelect.value;
  });

  // Show/hide new-attendee section
  form.querySelectorAll('input[name="first_time"]').forEach(function (input) {
    input.addEventListener('change', function () {
      newAttendeeSection.hidden = (input.value !== 'yes');
    });
  });

  // Show/hide online section
  form.querySelectorAll('input[name="attendance_mode"]').forEach(function (input) {
    input.addEventListener('change', function () {
      onlineSection.hidden = (input.value !== 'online');
    });
  });

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    errorMessage.hidden = true;

    var data = buildFormData();
    var meetupNumber = meetupSelect.value;
    var now = new Date();
    var dateStr = now.toISOString().slice(0, 10);
    var randomSuffix = Math.random().toString(36).slice(2, 8);
    var filename = 'submissions/' + dateStr + '-hacknight-' + meetupNumber + '-' + randomSuffix + '.json';
    var jsonStr = JSON.stringify(data, null, 2);
    // btoa with unicode support
    var encoded = btoa(unescape(encodeURIComponent(jsonStr)));

    fetch('https://api.github.com/repos/' + FEEDBACK_REPO + '/contents/' + filename, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + GITHUB_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Add feedback for hacknight #' + meetupNumber,
        content: encoded
      })
    })
    .then(function (response) {
      if (!response.ok) throw new Error('GitHub API error: ' + response.status);
      form.hidden = true;
      successMessage.hidden = false;
    })
    .catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Feedback';
      errorMessage.hidden = false;
    });
  });

  function getRadio(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : undefined;
  }

  function getText(id) {
    var el = form.querySelector('#' + id);
    return (el && el.value.trim()) ? el.value.trim() : undefined;
  }

  function getSelect(id) {
    var el = form.querySelector('#' + id);
    return (el && el.value) ? el.value : undefined;
  }

  function buildFormData() {
    var firstTime = getRadio('first_time');
    var attendanceMode = getRadio('attendance_mode');
    var overallRating = getRadio('overall_rating');

    var data = {
      meetup_number: meetupSelect.value,
      submitted_at: new Date().toISOString(),
    };

    if (attendanceMode) data.attendance_mode = attendanceMode;
    if (firstTime !== undefined) data.first_time = firstTime === 'yes';
    if (overallRating) data.overall_rating = parseInt(overallRating);

    if (firstTime === 'yes') {
      var newAttendee = {};
      var fw = getRadio('felt_welcome');
      var un = getRadio('understood');
      var wr = getRadio('would_return');
      if (fw) newAttendee.felt_welcome = parseInt(fw);
      if (un) newAttendee.understood_what_was_happening = parseInt(un);
      if (wr) newAttendee.would_return = wr;
      if (Object.keys(newAttendee).length) data.new_attendee = newAttendee;
    }

    if (attendanceMode === 'online') {
      var online = {};
      var av = getRadio('av_quality');
      var fi = getRadio('felt_included');
      if (av) online.av_quality = parseInt(av);
      if (fi) online.felt_included = parseInt(fi);
      if (Object.keys(online).length) data.online = online;
    }

    var general = {};
    var liked = getText('liked');
    var improve = getText('improve');
    if (liked) general.liked = liked;
    if (improve) general.improve = improve;
    if (Object.keys(general).length) data.general = general;

    var equity = {};
    var gi = getText('gender_identity');
    var ar = getSelect('age_range');
    var ra = getRadio('racialized');
    var di = getRadio('disability');
    var bh = getRadio('belongs_here');
    var tr = getRadio('topics_relevant');
    if (gi) equity.gender_identity = gi;
    if (ar) equity.age_range = ar;
    if (ra) equity.racialized = ra;
    if (di) equity.disability = di;
    if (bh) equity.belongs_here = parseInt(bh);
    if (tr) equity.topics_relevant = parseInt(tr);
    if (Object.keys(equity).length) data.equity = equity;

    return data;
  }
})();
</script>
```

**Step 2: Verify the happy path locally**

```bash
make serve
```

Visit http://localhost:4000/feedback/ and submit a test response (the local PAT in `_config.local.yml` must be set). After submitting:
- The form disappears
- "Thanks — your feedback helps us improve every week." appears
- Check `https://github.com/CivicTechTO/feedback/tree/main/submissions` — a new JSON file should be there

**Step 3: Verify the error path**

Temporarily blank out `feedback_token` in `_config.local.yml`, rebuild (`make serve`), and submit. The error message should appear and the button should re-enable.

Restore the real token when done.

**Step 4: Commit**

```bash
git add _pages/feedback.md
git commit -m "Add GitHub API submission to feedback form"
```

---

## Task 6: Add README to the feedback repo

This is done directly on GitHub, not in this repo.

**Step 1:** Go to `https://github.com/CivicTechTO/feedback` and edit `README.md` to document the schema:

```markdown
# CivicTechTO Feedback

Anonymous post-meetup feedback submitted via [civictech.ca/feedback](https://civictech.ca/feedback).

Each submission is a JSON file in `submissions/` named:
`YYYY-MM-DD-hacknight-NNN-RANDOM.json`

## Schema

| Field | Type | Description |
|---|---|---|
| `meetup_number` | string | Hacknight number |
| `submitted_at` | ISO 8601 string | Submission timestamp (UTC) |
| `attendance_mode` | `"in-person"` \| `"online"` | How they attended |
| `first_time` | boolean | First visit to CivicTechTO |
| `overall_rating` | 1–5 | Overall night rating |
| `new_attendee.felt_welcome` | 1–5 | (first-timers only) |
| `new_attendee.understood_what_was_happening` | 1–5 | (first-timers only) |
| `new_attendee.would_return` | `"yes"` \| `"maybe"` \| `"no"` | (first-timers only) |
| `online.av_quality` | 1–5 | (online attendees only) |
| `online.felt_included` | 1–5 | (online attendees only) |
| `general.liked` | string | Free text |
| `general.improve` | string | Free text |
| `equity.gender_identity` | string | Free text, self-described |
| `equity.age_range` | string | Age bracket |
| `equity.racialized` | `"yes"` \| `"no"` \| `"prefer-not-to-say"` | |
| `equity.disability` | `"yes"` \| `"no"` \| `"prefer-not-to-say"` | |
| `equity.belongs_here` | 1–5 | Sense of belonging |
| `equity.topics_relevant` | 1–5 | Topic relevance to respondent |

All fields except `meetup_number` and `submitted_at` are optional and may be absent.
```

---

## Task 7: Create branch and open PR

**Step 1: Check what branch you're on**

```bash
git status
```

If not already on a feature branch, create one now (or check if this was done at the start):

```bash
git checkout -b feature/feedback-survey
```

**Step 2: Push**

```bash
git push -u origin feature/feedback-survey
```

**Step 3: Open PR**

```bash
gh pr create \
  --title "Add anonymous post-meetup feedback survey at /feedback/" \
  --body "Adds a Jekyll page at civictech.ca/feedback for anonymous attendee feedback. Responses are committed as JSON files to the public CivicTechTO/feedback repo via the GitHub Contents API. Includes progressive disclosure (conditional questions for first-timers and online attendees, optional expanders for free text and equity questions). Closes #63... (add relevant issue number)"
```

**Note:** Before merging, confirm the `FEEDBACK_TOKEN` secret is set in the repo's Actions secrets (Settings → Secrets and variables → Actions).
