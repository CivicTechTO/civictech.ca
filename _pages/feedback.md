---
title: "Share Your Feedback"
layout: page
permalink: "/feedback/"
excerpt: "Help us make Civic Tech Toronto better. This form is completely anonymous — we never collect names or email addresses."
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">

<style>
/* ================================================================
   FEEDBACK PAGE — "The Public Square"
   Warm editorial civic design: DM Serif Display + DM Sans
   Toronto red (#C8102E) accent on cream ground
   ================================================================ */

/* Override layout h1 with display serif */
article > header hgroup h1 {
  font-family: 'DM Serif Display', Georgia, serif;
  font-weight: 400;
  line-height: 1.1;
}

/* ---- Wrapper + custom properties ---- */
.feedback-wrapper {
  --fb-cream:       #F7F3EE;
  --fb-white:       #FFFFFF;
  --fb-ink:         #1A1A2E;
  --fb-muted:       #6B6B7A;
  --fb-red:         #C8102E;
  --fb-red-light:   #FFF5F5;
  --fb-red-mid:     #FDDDE2;
  --fb-border:      #E2DDD8;
  --fb-green:       #2D6A4F;
  --fb-green-light: #EDFAF4;
  --fb-radius:      12px;
  --fb-serif:       'DM Serif Display', Georgia, serif;
  --fb-sans:        'DM Sans', system-ui, sans-serif;

  font-family: var(--fb-sans);
  color: var(--fb-ink);
  max-width: 600px;
}

/* ---- Card base ---- */
.fb-card {
  background: var(--fb-white);
  border: 1.5px solid var(--fb-border);
  border-radius: var(--fb-radius);
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.fb-card:focus-within {
  border-color: var(--fb-red);
  box-shadow: 0 0 0 3px var(--fb-red-mid);
}
.fb-card fieldset {
  border: none;
  padding: 0;
  margin: 0;
}
.fb-card fieldset + fieldset {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--fb-border);
}

/* ---- Legend ---- */
.fb-card legend,
.fb-conditional legend,
.fb-expander-body legend {
  font-family: var(--fb-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--fb-ink);
  margin-bottom: 0.75rem;
  padding: 0;
  float: none;
  width: 100%;
}

/* ---- Meetup select ---- */
.fb-select-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fb-muted);
  margin-bottom: 0.5rem;
}
#meetup {
  width: 100%;
  font-family: var(--fb-sans);
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid var(--fb-border);
  border-radius: 8px;
  background-color: var(--fb-cream);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231A1A2E' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  color: var(--fb-ink);
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
  margin: 0;
}
#meetup:focus {
  outline: none;
  border-color: var(--fb-red);
}

/* ---- Pill radio toggles ---- */
.pill-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.pill-group label {
  position: relative;
  cursor: pointer;
  display: inline-flex;
}
.pill-group input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}
.pill-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  border: 1.5px solid var(--fb-border);
  border-radius: 100px;
  font-family: var(--fb-sans);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--fb-muted);
  background: var(--fb-cream);
  transition: all 0.15s ease;
  user-select: none;
  white-space: nowrap;
}
.pill-group input[type="radio"]:checked + .pill-btn {
  background: var(--fb-red);
  border-color: var(--fb-red);
  color: #fff;
}
.pill-group label:hover .pill-btn {
  border-color: var(--fb-red);
  color: var(--fb-red);
}
.pill-group input[type="radio"]:checked + .pill-btn:hover {
  background: var(--fb-red);
  color: #fff;
}
.pill-group input[type="radio"]:focus-visible + .pill-btn {
  outline: 2px solid var(--fb-red);
  outline-offset: 2px;
}

/* ---- Rating scale ---- */
.rating-scale {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
}
.rating-scale label {
  position: relative;
  cursor: pointer;
  display: inline-flex;
}
.rating-scale input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}
.rating-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1.5px solid var(--fb-border);
  border-radius: 8px;
  font-family: var(--fb-serif);
  font-size: 1.1rem;
  color: var(--fb-muted);
  background: var(--fb-cream);
  transition: all 0.15s ease;
  user-select: none;
}
.rating-scale input[type="radio"]:checked + .rating-btn {
  background: var(--fb-red);
  border-color: var(--fb-red);
  color: #fff;
  transform: scale(1.1);
}
.rating-scale label:hover .rating-btn {
  border-color: var(--fb-red);
  color: var(--fb-red);
  background: var(--fb-red-light);
}
.rating-scale input[type="radio"]:focus-visible + .rating-btn {
  outline: 2px solid var(--fb-red);
  outline-offset: 2px;
}
.rating-hint {
  font-size: 0.75rem;
  color: var(--fb-muted);
  margin: 0;
}

/* ---- Conditional sections (CSS-driven show/hide) ---- */
.fb-conditional {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
  transition: max-height 0.4s ease, opacity 0.3s ease, margin-bottom 0.3s ease;
}
.fb-conditional.is-visible {
  max-height: 1400px;
  opacity: 1;
  margin-bottom: 1rem;
}
.fb-conditional-inner {
  padding: 1.25rem 1.5rem;
  background: var(--fb-white);
  border: 1.5px solid var(--fb-border);
  border-left: 3px solid var(--fb-red);
  border-radius: var(--fb-radius);
}
.fb-conditional h3 {
  font-family: var(--fb-serif);
  font-size: 1.05rem;
  font-weight: 400;
  font-style: italic;
  color: var(--fb-red);
  margin: 0 0 1.25rem;
}
.fb-conditional fieldset {
  border: none;
  padding: 0;
  margin: 0 0 1.25rem;
}
.fb-conditional fieldset:last-child {
  margin-bottom: 0;
}
.fb-conditional fieldset + fieldset {
  padding-top: 1.25rem;
  border-top: 1px solid var(--fb-border);
}

/* ---- Expanders (details/summary) ---- */
.fb-expander {
  border: 1.5px solid var(--fb-border);
  border-radius: var(--fb-radius);
  margin-bottom: 1rem;
  overflow: hidden;
}
.fb-expander summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  font-family: var(--fb-sans);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  list-style: none;
  background: var(--fb-cream);
  color: var(--fb-ink);
  user-select: none;
  transition: background 0.15s ease;
}
.fb-expander summary::-webkit-details-marker { display: none; }
.fb-expander summary:hover { background: var(--fb-red-mid); }
.fb-expander summary::after {
  content: '+';
  font-size: 1.4rem;
  color: var(--fb-red);
  font-weight: 300;
  line-height: 1;
}
.fb-expander[open] summary::after { content: '−'; }

.fb-expander-body {
  padding: 1.5rem;
  background: var(--fb-white);
  border-top: 1.5px solid var(--fb-border);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.fb-expander-body > label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fb-muted);
  margin-bottom: -0.85rem; /* tighten label–input gap within the flex column */
}
.fb-expander-body textarea,
.fb-expander-body input[type="text"] {
  width: 100%;
  font-family: var(--fb-sans);
  font-size: 0.95rem;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid var(--fb-border);
  border-radius: 8px;
  background: var(--fb-cream);
  color: var(--fb-ink);
  transition: border-color 0.2s ease;
  resize: vertical;
  box-sizing: border-box;
  margin: 0;
}
.fb-expander-body textarea:focus,
.fb-expander-body input[type="text"]:focus {
  outline: none;
  border-color: var(--fb-red);
}
.fb-expander-body select {
  width: 100%;
  font-family: var(--fb-sans);
  font-size: 0.95rem;
  padding: 0.65rem 2.5rem 0.65rem 0.9rem;
  border: 1.5px solid var(--fb-border);
  border-radius: 8px;
  background-color: var(--fb-cream);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231A1A2E' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  color: var(--fb-ink);
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
  margin: 0;
}
.fb-expander-body select:focus {
  outline: none;
  border-color: var(--fb-red);
}
.fb-expander-body fieldset {
  border: none;
  padding: 0;
  margin: 0;
}
.privacy-note {
  font-size: 0.8rem;
  color: var(--fb-muted);
  line-height: 1.5;
  margin: 0;
  padding: 0.75rem;
  background: var(--fb-cream);
  border-radius: 6px;
}

/* ---- Submit button ---- */
.fb-submit-row { margin-top: 1.5rem; }
#submit-btn {
  width: 100%;
  font-family: var(--fb-sans);
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  background: var(--fb-red);
  color: #fff;
  border: none;
  border-radius: var(--fb-radius);
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: background 0.2s ease, transform 0.1s ease, opacity 0.2s ease;
  margin: 0;
}
#submit-btn:not(:disabled):hover {
  background: #A60D26;
  transform: translateY(-1px);
}
#submit-btn:not(:disabled):active { transform: translateY(0); }
#submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ---- Status messages ---- */
#success-message {
  text-align: center;
  padding: 3rem 2rem;
  background: var(--fb-green-light);
  border: 1.5px solid var(--fb-green);
  border-radius: var(--fb-radius);
}
#success-message p {
  color: var(--fb-green);
  font-family: var(--fb-sans);
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;
}
#success-message p::before { content: '✓  '; }

#error-message {
  padding: 1rem 1.25rem;
  background: var(--fb-red-light);
  border: 1.5px solid var(--fb-red);
  border-radius: 8px;
  margin-top: 0.75rem;
}
#error-message p {
  color: var(--fb-red);
  font-size: 0.9rem;
  margin: 0;
}
#error-message a {
  color: var(--fb-red);
  font-weight: 600;
}
</style>

<div class="feedback-wrapper">

<form id="feedback-form" novalidate>

  <div class="fb-card">
    <label class="fb-select-label" for="meetup">Which meetup are you rating?</label>
    <select id="meetup" name="meetup">
      <option value="">Select a meetup…</option>
      {% assign recent_meetups = site.meetups | sort: "date" | reverse %}
      {% for meetup in recent_meetups limit:10 %}<option value="{{ meetup.number }}">Hacknight #{{ meetup.number }} – {{ meetup.date | date: "%B %d, %Y" }}{% if meetup.topic %} – {{ meetup.topic }}{% endif %}</option>{% endfor %}
    </select>
  </div>

  <div class="fb-card">
    <fieldset>
      <legend>Were you attending in person or online?</legend>
      <div class="pill-group">
        <label><input type="radio" name="attendance_mode" value="in-person"><span class="pill-btn">In Person</span></label>
        <label><input type="radio" name="attendance_mode" value="online"><span class="pill-btn">Online</span></label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Is this your first time at Civic Tech Toronto?</legend>
      <div class="pill-group">
        <label><input type="radio" name="first_time" value="yes"><span class="pill-btn">Yes, first time</span></label>
        <label><input type="radio" name="first_time" value="no"><span class="pill-btn">I've been before</span></label>
      </div>
    </fieldset>
  </div>

  <div class="fb-card">
    <fieldset>
      <legend>How was tonight overall?</legend>
      <div class="rating-scale">
        <label><input type="radio" name="overall_rating" value="1"><span class="rating-btn">1</span></label>
        <label><input type="radio" name="overall_rating" value="2"><span class="rating-btn">2</span></label>
        <label><input type="radio" name="overall_rating" value="3"><span class="rating-btn">3</span></label>
        <label><input type="radio" name="overall_rating" value="4"><span class="rating-btn">4</span></label>
        <label><input type="radio" name="overall_rating" value="5"><span class="rating-btn">5</span></label>
      </div>
      <p class="rating-hint">1 = poor &nbsp;&nbsp; 5 = excellent</p>
    </fieldset>
  </div>

  <!-- Conditional: new attendee questions -->
  <section id="new-attendee-section" class="fb-conditional" aria-labelledby="new-attendee-heading">
    <div class="fb-conditional-inner">
      <h3 id="new-attendee-heading">As a first-timer…</h3>

      <fieldset>
        <legend>Did you feel welcome tonight?</legend>
        <div class="rating-scale">
          <label><input type="radio" name="felt_welcome" value="1"><span class="rating-btn">1</span></label>
          <label><input type="radio" name="felt_welcome" value="2"><span class="rating-btn">2</span></label>
          <label><input type="radio" name="felt_welcome" value="3"><span class="rating-btn">3</span></label>
          <label><input type="radio" name="felt_welcome" value="4"><span class="rating-btn">4</span></label>
          <label><input type="radio" name="felt_welcome" value="5"><span class="rating-btn">5</span></label>
        </div>
        <p class="rating-hint">1 = not at all &nbsp;&nbsp; 5 = very welcome</p>
      </fieldset>

      <fieldset>
        <legend>Did you understand what was going on?</legend>
        <div class="rating-scale">
          <label><input type="radio" name="understood" value="1"><span class="rating-btn">1</span></label>
          <label><input type="radio" name="understood" value="2"><span class="rating-btn">2</span></label>
          <label><input type="radio" name="understood" value="3"><span class="rating-btn">3</span></label>
          <label><input type="radio" name="understood" value="4"><span class="rating-btn">4</span></label>
          <label><input type="radio" name="understood" value="5"><span class="rating-btn">5</span></label>
        </div>
        <p class="rating-hint">1 = confused &nbsp;&nbsp; 5 = totally clear</p>
      </fieldset>

      <fieldset>
        <legend>Would you come back?</legend>
        <div class="pill-group">
          <label><input type="radio" name="would_return" value="yes"><span class="pill-btn">Yes</span></label>
          <label><input type="radio" name="would_return" value="maybe"><span class="pill-btn">Maybe</span></label>
          <label><input type="radio" name="would_return" value="no"><span class="pill-btn">No</span></label>
        </div>
      </fieldset>
    </div>
  </section>

  <!-- Conditional: online attendee questions -->
  <section id="online-section" class="fb-conditional" aria-labelledby="online-heading">
    <div class="fb-conditional-inner">
      <h3 id="online-heading">Online experience</h3>

      <fieldset>
        <legend>Could you hear and see what was happening clearly?</legend>
        <div class="rating-scale">
          <label><input type="radio" name="av_quality" value="1"><span class="rating-btn">1</span></label>
          <label><input type="radio" name="av_quality" value="2"><span class="rating-btn">2</span></label>
          <label><input type="radio" name="av_quality" value="3"><span class="rating-btn">3</span></label>
          <label><input type="radio" name="av_quality" value="4"><span class="rating-btn">4</span></label>
          <label><input type="radio" name="av_quality" value="5"><span class="rating-btn">5</span></label>
        </div>
        <p class="rating-hint">1 = poor &nbsp;&nbsp; 5 = excellent</p>
      </fieldset>

      <fieldset>
        <legend>Did you feel like an equal participant, not just a viewer?</legend>
        <div class="rating-scale">
          <label><input type="radio" name="felt_included" value="1"><span class="rating-btn">1</span></label>
          <label><input type="radio" name="felt_included" value="2"><span class="rating-btn">2</span></label>
          <label><input type="radio" name="felt_included" value="3"><span class="rating-btn">3</span></label>
          <label><input type="radio" name="felt_included" value="4"><span class="rating-btn">4</span></label>
          <label><input type="radio" name="felt_included" value="5"><span class="rating-btn">5</span></label>
        </div>
        <p class="rating-hint">1 = not at all &nbsp;&nbsp; 5 = fully included</p>
      </fieldset>
    </div>
  </section>

  <!-- Optional expander: general feedback -->
  <details class="fb-expander">
    <summary>Tell us more <span style="font-size:0.8em;color:var(--fb-muted);font-weight:400;">(optional)</span></summary>
    <div class="fb-expander-body">
      <label for="liked">What worked well tonight?</label>
      <textarea id="liked" name="liked" rows="3"></textarea>
      <label for="improve">What could be better?</label>
      <textarea id="improve" name="improve" rows="3"></textarea>
    </div>
  </details>

  <!-- Optional expander: equity questions -->
  <details class="fb-expander">
    <summary>About you <span style="font-size:0.8em;color:var(--fb-muted);font-weight:400;">(optional)</span></summary>
    <div class="fb-expander-body">
      <p class="privacy-note">All fields in this section are completely optional and anonymous. This information helps us understand who is showing up and whether everyone feels included.</p>

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
        <div class="pill-group">
          <label><input type="radio" name="racialized" value="yes"><span class="pill-btn">Yes</span></label>
          <label><input type="radio" name="racialized" value="no"><span class="pill-btn">No</span></label>
          <label><input type="radio" name="racialized" value="prefer-not-to-say"><span class="pill-btn">Prefer not to say</span></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Do you have a disability or chronic condition?</legend>
        <div class="pill-group">
          <label><input type="radio" name="disability" value="yes"><span class="pill-btn">Yes</span></label>
          <label><input type="radio" name="disability" value="no"><span class="pill-btn">No</span></label>
          <label><input type="radio" name="disability" value="prefer-not-to-say"><span class="pill-btn">Prefer not to say</span></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Do you feel like someone like you belongs in this space?</legend>
        <div class="rating-scale">
          <label><input type="radio" name="belongs_here" value="1"><span class="rating-btn">1</span></label>
          <label><input type="radio" name="belongs_here" value="2"><span class="rating-btn">2</span></label>
          <label><input type="radio" name="belongs_here" value="3"><span class="rating-btn">3</span></label>
          <label><input type="radio" name="belongs_here" value="4"><span class="rating-btn">4</span></label>
          <label><input type="radio" name="belongs_here" value="5"><span class="rating-btn">5</span></label>
        </div>
        <p class="rating-hint">1 = not at all &nbsp;&nbsp; 5 = absolutely</p>
      </fieldset>

      <fieldset>
        <legend>Were tonight's topics or speakers relevant to your community or experience?</legend>
        <div class="rating-scale">
          <label><input type="radio" name="topics_relevant" value="1"><span class="rating-btn">1</span></label>
          <label><input type="radio" name="topics_relevant" value="2"><span class="rating-btn">2</span></label>
          <label><input type="radio" name="topics_relevant" value="3"><span class="rating-btn">3</span></label>
          <label><input type="radio" name="topics_relevant" value="4"><span class="rating-btn">4</span></label>
          <label><input type="radio" name="topics_relevant" value="5"><span class="rating-btn">5</span></label>
        </div>
        <p class="rating-hint">1 = not relevant &nbsp;&nbsp; 5 = very relevant</p>
      </fieldset>
    </div>
  </details>

  <div class="fb-submit-row">
    <button type="submit" id="submit-btn" disabled>Submit Feedback</button>
  </div>

</form>

<div id="success-message" role="alert" hidden>
  <p>Thanks — your feedback helps us improve every week.</p>
</div>

<div id="error-message" role="alert" hidden>
  <p>Something went wrong. You can try again or email <a href="mailto:hi@civictech.ca">hi@civictech.ca</a>.</p>
</div>

</div><!-- /.feedback-wrapper -->

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
      newAttendeeSection.classList.toggle('is-visible', input.value === 'yes');
    });
  });

  // Show/hide online section
  form.querySelectorAll('input[name="attendance_mode"]').forEach(function (input) {
    input.addEventListener('change', function () {
      onlineSection.classList.toggle('is-visible', input.value === 'online');
    });
  });

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    errorMessage.hidden = true;

    var now = new Date();
    var data = buildFormData(now);
    var meetupNumber = meetupSelect.value;
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

  function buildFormData(now) {
    var firstTime = getRadio('first_time');
    var attendanceMode = getRadio('attendance_mode');
    var overallRating = getRadio('overall_rating');

    var data = {
      meetup_number: meetupSelect.value,
      submitted_at: now.toISOString(),
    };

    if (attendanceMode) data.attendance_mode = attendanceMode;
    if (firstTime !== undefined) data.first_time = firstTime === 'yes';
    if (overallRating) data.overall_rating = parseInt(overallRating, 10);

    if (firstTime === 'yes') {
      var newAttendee = {};
      var fw = getRadio('felt_welcome');
      var un = getRadio('understood');
      var wr = getRadio('would_return');
      if (fw) newAttendee.felt_welcome = parseInt(fw, 10);
      if (un) newAttendee.understood_what_was_happening = parseInt(un, 10);
      if (wr) newAttendee.would_return = wr;
      if (Object.keys(newAttendee).length) data.new_attendee = newAttendee;
    }

    if (attendanceMode === 'online') {
      var online = {};
      var av = getRadio('av_quality');
      var fi = getRadio('felt_included');
      if (av) online.av_quality = parseInt(av, 10);
      if (fi) online.felt_included = parseInt(fi, 10);
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
    if (bh) equity.belongs_here = parseInt(bh, 10);
    if (tr) equity.topics_relevant = parseInt(tr, 10);
    if (Object.keys(equity).length) data.equity = equity;

    return data;
  }
})();
</script>
