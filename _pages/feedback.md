---
title: "Share Your Feedback"
layout: page
permalink: "/feedback/"
excerpt: "Help us make Civic Tech Toronto better. Responses are anonymous — we never collect names or email addresses — but are stored in a public repository."
---

<style>
/* ================================================================
   FEEDBACK PAGE STYLES
   Uses Pico CSS variables to match the rest of the site.
   ================================================================ */

/* ---- Wrapper ---- */
.feedback-wrapper {
  max-width: 600px;
}

/* ---- Card base ---- */
.fb-card {
  background: var(--pico-card-background-color);
  border: 1.5px solid var(--pico-muted-border-color);
  border-radius: var(--pico-border-radius);
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.fb-card:focus-within {
  border-color: var(--pico-primary);
  box-shadow: 0 0 0 3px var(--pico-primary-background);
}
.fb-card fieldset {
  border: none;
  padding: 0;
  margin: 0;
}
.fb-card fieldset + fieldset {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--pico-muted-border-color);
}

/* ---- Legend ---- */
.fb-card legend,
.fb-conditional legend,
.fb-expander-body legend {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--pico-color);
  margin-bottom: 0.75rem;
  padding: 0;
  float: none;
  width: 100%;
}

/* ---- Hacknight date picker ---- */
.fb-select-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--pico-color);
  margin-bottom: 0.5rem;
}
#meetup {
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border: 2px solid var(--pico-muted-border-color);
  border-radius: var(--pico-border-radius);
  background-color: var(--pico-form-element-background-color);
  color: var(--pico-color);
  transition: border-color 0.2s ease;
  margin: 0;
}
#meetup:focus {
  outline: none;
  border-color: var(--pico-primary);
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
  border: 1.5px solid var(--pico-muted-border-color);
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--pico-muted-color);
  background: var(--pico-muted-background-color);
  transition: all 0.15s ease;
  user-select: none;
  white-space: nowrap;
}
.pill-group input[type="radio"]:checked + .pill-btn {
  background: var(--pico-primary);
  border-color: var(--pico-primary);
  color: var(--pico-primary-inverse);
}
.pill-group label:hover .pill-btn {
  border-color: var(--pico-primary);
  color: var(--pico-primary);
}
.pill-group input[type="radio"]:checked + .pill-btn:hover {
  background: var(--pico-primary);
  color: var(--pico-primary-inverse);
}
.pill-group input[type="radio"]:focus-visible + .pill-btn {
  outline: 2px solid var(--pico-primary);
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
  border: 1.5px solid var(--pico-muted-border-color);
  border-radius: var(--pico-border-radius);
  font-size: 1.1rem;
  color: var(--pico-muted-color);
  background: var(--pico-muted-background-color);
  transition: all 0.15s ease;
  user-select: none;
}
.rating-scale input[type="radio"]:checked + .rating-btn {
  background: var(--pico-primary);
  border-color: var(--pico-primary);
  color: var(--pico-primary-inverse);
  transform: scale(1.1);
}
.rating-scale label:hover .rating-btn {
  border-color: var(--pico-primary);
  color: var(--pico-primary);
  background: var(--pico-primary-background);
}
.rating-scale input[type="radio"]:focus-visible + .rating-btn {
  outline: 2px solid var(--pico-primary);
  outline-offset: 2px;
}
.rating-hint {
  font-size: 0.75rem;
  color: var(--pico-muted-color);
  margin: 0;
}

/* ---- Inline follow-up fields (within a conditional section) ---- */
.fb-followup {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.3s ease, opacity 0.25s ease;
}
.fb-followup.is-visible {
  max-height: 200px;
  opacity: 1;
}
.fb-followup label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--pico-color);
  margin: 0.75rem 0 0.35rem;
}
.fb-followup textarea {
  width: 100%;
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  border: 1.5px solid var(--pico-muted-border-color);
  border-radius: var(--pico-border-radius);
  background: var(--pico-form-element-background-color);
  color: var(--pico-color);
  resize: vertical;
  box-sizing: border-box;
  margin: 0;
  transition: border-color 0.2s ease;
}
.fb-followup textarea:focus {
  outline: none;
  border-color: var(--pico-primary);
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
  background: var(--pico-card-background-color);
  border: 1.5px solid var(--pico-muted-border-color);
  border-left: 3px solid var(--pico-primary);
  border-radius: var(--pico-border-radius);
}
.fb-conditional h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--pico-color);
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
  border-top: 1px solid var(--pico-muted-border-color);
}

/* ---- Expanders (details/summary) ---- */
.fb-expander {
  border: 1.5px solid var(--pico-muted-border-color);
  border-radius: var(--pico-border-radius);
  margin-bottom: 1rem;
  overflow: hidden;
}
.fb-expander summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  list-style: none;
  background: var(--pico-muted-background-color);
  color: var(--pico-color);
  user-select: none;
  transition: background 0.15s ease;
}
.fb-expander summary::-webkit-details-marker { display: none; }
.fb-expander summary:hover { background: var(--pico-primary-background); }
.fb-expander summary::after {
  content: '+';
  font-size: 1.4rem;
  color: var(--pico-primary);
  font-weight: 300;
  line-height: 1;
}
.fb-expander[open] summary::after { content: '−'; }

.fb-expander-body {
  padding: 1.5rem;
  background: var(--pico-card-background-color);
  border-top: 1.5px solid var(--pico-muted-border-color);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.fb-expander-body > label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--pico-color);
  margin-bottom: -0.85rem; /* tighten label–input gap within the flex column */
}
.fb-expander-body textarea,
.fb-expander-body input[type="text"] {
  width: 100%;
  font-size: 0.95rem;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid var(--pico-muted-border-color);
  border-radius: var(--pico-border-radius);
  background: var(--pico-form-element-background-color);
  color: var(--pico-color);
  transition: border-color 0.2s ease;
  resize: vertical;
  box-sizing: border-box;
  margin: 0;
}
.fb-expander-body textarea:focus,
.fb-expander-body input[type="text"]:focus {
  outline: none;
  border-color: var(--pico-primary);
}
.fb-expander-body select {
  width: 100%;
  font-size: 0.95rem;
  padding: 0.65rem 2.5rem 0.65rem 0.9rem;
  border: 1.5px solid var(--pico-muted-border-color);
  border-radius: var(--pico-border-radius);
  background-color: var(--pico-form-element-background-color);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='currentColor' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  color: var(--pico-color);
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
  margin: 0;
}
.fb-expander-body select:focus {
  outline: none;
  border-color: var(--pico-primary);
}
.fb-expander-body fieldset {
  border: none;
  padding: 0;
  margin: 0;
}
.privacy-note {
  font-size: 0.8rem;
  color: var(--pico-muted-color);
  line-height: 1.5;
  margin: 0;
  padding: 0.75rem;
  background: var(--pico-muted-background-color);
  border-radius: var(--pico-border-radius);
}

/* ---- Public notice banner ---- */
.fb-public-notice {
  font-size: 0.875rem;
  color: var(--pico-color);
  line-height: 1.5;
  margin: 0 0 1.25rem;
  padding: 0.75rem 1rem;
  background: var(--pico-muted-background-color);
  border-left: 3px solid var(--pico-primary);
  border-radius: var(--pico-border-radius);
}
.fb-public-notice a {
  color: var(--pico-primary);
}

/* ---- Submit button ---- */
.fb-submit-row { margin-top: 1.5rem; }
#submit-btn {
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  background: var(--pico-primary);
  color: var(--pico-primary-inverse);
  border: none;
  border-radius: var(--pico-border-radius);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease, opacity 0.2s ease;
  margin: 0;
}
#submit-btn:not(:disabled):hover {
  background: var(--pico-primary-hover);
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
  background: #EDFAF4;
  border: 1.5px solid #2D6A4F;
  border-radius: var(--pico-border-radius);
}
#success-message p {
  color: #2D6A4F;
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;
}
#success-message p::before { content: '✓  '; }

#error-message {
  padding: 1rem 1.25rem;
  background: #fff5f5;
  border: 1.5px solid #c0392b;
  border-radius: var(--pico-border-radius);
  margin-top: 0.75rem;
}
#error-message p {
  color: #c0392b;
  font-size: 0.9rem;
  margin: 0;
}
#error-message a {
  color: #c0392b;
  font-weight: 600;
}
</style>

<div class="feedback-wrapper">

<p class="fb-public-notice"><strong>Public notice:</strong> Responses are anonymous but stored openly in a <a href="https://github.com/CivicTechTO/feedback" target="_blank" rel="noopener">public GitHub repository</a>. Do not include any personal information.</p>

<form id="feedback-form" novalidate>

  <div class="fb-card">
    <label class="fb-select-label" for="meetup">Which Tuesday are you giving feedback on?</label>
    <input type="date" id="meetup" name="meetup">
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
        <div id="return-maybe-followup" class="fb-followup">
          <label for="return_maybe_reason">What would need to be different?</label>
          <textarea id="return_maybe_reason" name="return_maybe_reason" rows="2"></textarea>
        </div>
        <div id="return-no-followup" class="fb-followup">
          <label for="return_no_reason">Why not?</label>
          <textarea id="return_no_reason" name="return_no_reason" rows="2"></textarea>
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
    <summary>Tell us more <span style="font-size:0.8em;color:var(--pico-muted-color);font-weight:400;">(optional)</span></summary>
    <div class="fb-expander-body">
      <label for="liked">What worked well tonight?</label>
      <textarea id="liked" name="liked" rows="3"></textarea>
      <label for="improve">What could be better?</label>
      <textarea id="improve" name="improve" rows="3"></textarea>
    </div>
  </details>

  <!-- Optional expander: equity questions -->
  <details class="fb-expander">
    <summary>About you <span style="font-size:0.8em;color:var(--pico-muted-color);font-weight:400;">(optional)</span></summary>
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
  var meetupInput = document.getElementById('meetup');
  var newAttendeeSection = document.getElementById('new-attendee-section');
  var onlineSection = document.getElementById('online-section');
  var successMessage = document.getElementById('success-message');
  var errorMessage = document.getElementById('error-message');

  // Initialise date picker: default to most recent Tuesday, restrict to Tuesdays
  function toLocalDateString(d) {
    // Avoids UTC-offset errors that toISOString() causes for western timezones
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }
  function getMostRecentTuesday() {
    var d = new Date();
    var daysBack = (d.getDay() + 5) % 7; // days since last Tuesday (0 when today is Tue)
    d.setDate(d.getDate() - daysBack);
    return toLocalDateString(d);
  }
  var recentTuesday = getMostRecentTuesday();
  meetupInput.value = recentTuesday;
  // min is 10 weeks before the most recent Tuesday (still a Tuesday, so step=7 aligns)
  var minDate = new Date(recentTuesday);
  minDate.setDate(minDate.getDate() - 70);
  meetupInput.setAttribute('min', toLocalDateString(minDate));
  meetupInput.setAttribute('step', '7');
  submitBtn.disabled = false;

  // Validate selection is a Tuesday (fallback for browsers that ignore step)
  meetupInput.addEventListener('change', function () {
    var parts = meetupInput.value.split('-');
    var dayOfWeek = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)).getDay();
    submitBtn.disabled = !meetupInput.value || dayOfWeek !== 2;
  });

  // Show/hide would_return follow-up questions
  var returnMaybeFollowup = document.getElementById('return-maybe-followup');
  var returnNoFollowup = document.getElementById('return-no-followup');
  form.querySelectorAll('input[name="would_return"]').forEach(function (input) {
    input.addEventListener('change', function () {
      returnMaybeFollowup.classList.toggle('is-visible', input.value === 'maybe');
      returnNoFollowup.classList.toggle('is-visible', input.value === 'no');
    });
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
    var hacknightDate = meetupInput.value;
    var randomSuffix = Math.random().toString(36).slice(2, 8);
    var filename = 'submissions/' + hacknightDate + '-feedback-' + randomSuffix + '.json';
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
        message: 'Add feedback for hacknight on ' + hacknightDate,
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
      hacknight_date: meetupInput.value,
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
      if (wr === 'maybe') {
        var maybeReason = getText('return_maybe_reason');
        if (maybeReason) newAttendee.would_return_reason = maybeReason;
      } else if (wr === 'no') {
        var noReason = getText('return_no_reason');
        if (noReason) newAttendee.would_return_reason = noReason;
      }
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
