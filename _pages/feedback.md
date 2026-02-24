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
    <option value="{{ meetup.number }}">Hacknight #{{ meetup.number }} – {{ meetup.date | date: "%B %d, %Y" }}{% if meetup.topic %} – {{ meetup.topic }}{% endif %}</option>
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

<div id="success-message" role="alert" hidden>
  <p>Thanks — your feedback helps us improve every week.</p>
</div>

<div id="error-message" role="alert" hidden>
  <p>Something went wrong. You can try again or email <a href="mailto:hi@civictech.ca">hi@civictech.ca</a>.</p>
</div>

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
