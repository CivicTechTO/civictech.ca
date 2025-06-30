---
title: "About Us"
layout: page
permalink: "/about-us/"
redirect_from: /get-in-touch/
---


<section>
  <h2>What is Civic Tech Toronto?</h2>
  <p><strong>Civic Tech Toronto</strong> is a community dedicated to exploring, understanding, and addressing civic challenges through technology, design, and creative collaboration. We connect Torontonians passionate about making their city better for everyone, whether they bring technical skills or simply curiosity and enthusiasm.</p>

  <p>In practice, we are a volunteer-run group that meets every Tuesday evening, with both in-person and online attendance options available every week. Our gatherings typically begin with a short presentation by an invited speaker or community member, followed by time for participants to collaborate on projects, discuss ideas, or simply socialize. Afterward, many of us head to a nearby bar for informal conversations and drinks (including non-alcoholic options). Everyone is welcome to join!</p>
</section>

<section>
  <h2>Who’s Invited?</h2>
  <p>Everyone. Our community includes people with no technical experience whatsoever alongside developers, designers, policy enthusiasts, activists, and curious newcomers. We strongly believe that diverse perspectives make for stronger solutions. Whatever your background or skill level, you're welcome to contribute and learn.</p>
  <p>We are committed to providing a safe, inclusive, and respectful environment for everyone.</p>
  <a href="/code-of-conduct" class="secondary">Read our Code of Conduct →</a>
</section>


<section>
  <h2>What to Expect</h2>
  <p>Our community gathers weekly on Tuesday evenings. Here’s what a typical evening looks like:</p>
  <ul>
    <li><strong>7:00 PM – Welcome and Introductions</strong><br />Meet new people and learn about Civic Tech Toronto.</li>
    <li><strong>7:20 PM – Featured Presentation</strong><br />Hear from an invited speaker sharing insights, stories, or ideas from the civic tech ecosystem.</li>
    <li><strong>8:00 PM – Project Collaboration</strong><br />Break into smaller groups to work together, learn from each other, and develop civic solutions.</li>
    <li><strong>9:00 PM – Social Hour</strong><br />Join us at a nearby bar for informal discussions, socializing, and drinks of any kind.</li>
  </ul>
</section>

<section>
<h2>Past Speakers</h2>
<p>We’ve welcomed speakers from across the international civic tech community, including government leaders, grassroots organizers, academics, designers, and more.</p>

<div class="custom_grid">
  {% assign featured_speakers = site.people | where_exp: "person", "person.categories contains 'meta/feature'" | sort: "date" | reverse %}

  {% for speaker in featured_speakers limit:9 %}
    <hgroup>
      <a href="{{speaker.url}}" alt="{{speark.title}}"><h4>{{ speaker.title }}</h4></a>
      <p>
        {% if speaker.organization %}
          {% assign organization_list = "" | split: "" %}
          {% for organization in speaker.organization %}
            {% assign organization_name = organization | remove: '[[' | remove: ']]' %}
            {% assign organization_list = organization_list | push: organization_name %}
          {% endfor %}
          {{ organization_list | join: ", " }}
        {% else %}
          Unassociated
        {% endif %}
      </p>
    </hgroup>
  {% endfor %}
</div>
<a href="{{ '/people' | relative_url }}">See all past speakers here!</a>
</section>

<section>
<h2>Our Supporters</h2>
<p>Our activities have been supported by generous individuals, organizations, and partners committed to civic engagement.</p>
<div class="custom_grid">
  {% assign featured_sponsors = site.organizations | where_exp: "organization", "organization.categories contains 'meta/feature'" | sort: "date" | reverse %}

  {% for sponsor in featured_sponsors limit:9 %}
    <div>
      <hgroup>
        <h4>{{ sponsor.title }}</h4>
        <p>
          {% if sponsor.website %}
          {% if sponsor.image %}
            <div class="hacknight-thumbnail">
              <img src="{{ site.baseurl }}/assets/images/organizations/{{ sponsor.image }}" alt="{{ sponsor.title }} Logo" class="hacknight-image">
            </div>
          {% endif %}
            <a href="{{ sponsor.social.website }}">{{ sponsor.social.website }}</a>
          {% else %}
            No website listed
          {% endif %}
        </p>
      </hgroup>
    </div>
  {% endfor %}
</div>
</section>

<section>
  <h2>Get Involved</h2>
  <p>There are several ways to participate:</p>
  <div class="grid">
    <article>
      <h3>Attend an Event</h3>
      <p>The best way to get started is to join one of our weekly gatherings, meet new people, and learn something new.</p>
      <a role="button" href="https://guild.host/civic-tech-toronto/events" target="_blank">Sign Up<span aria-hidden="true">&nbsp;↗</span></a>
    </article>
    <article>
      <h3>Speak or Present</h3>
      <p>Have a topic you'd like to share with the community? We're always looking for new voices.</p>
      <a role="button" href="mailto:hi@civictech.ca">Email us →</a>
    </article>
    <article>
      <h3>Offer Support</h3>
      <p>We’re volunteer-run and always appreciate help, whether it's offering a venue, sponsorship, or other forms of support.</p>
      <a role="button" href="mailto:hi@civictech.ca">Get in Touch →</a>
    </article>
  </div>
</section>