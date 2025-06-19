---
title: "About Us"
layout: page
permalink: "/about-us/"
redirect_from: /get-in-touch/
---


<section>
  <h2>What is Civic Tech Toronto?</h2>
  <p>Civic Tech Toronto is a vibrant and diverse community of Torontonians engaged in understanding and creating solutions for civic challenges through technology, design, and other innovative means.</p>
</section>

<section>
  <h2>Who's Invited?</h2>
  <p>We invite people from all backgrounds and skill levels to join us. Whether you’re a tech expert, a curious beginner, or passionate about civic issues, your presence and contribution are valued.</p>
  <p>Civic Tech Toronto is committed to fostering a safe, inclusive, and enjoyable environment for collaboration. We believe in the power of diverse perspectives and a human-centred approach in tackling civic issues, leading to remarkable outcomes.</p>
  <a href="/code-of-conduct" class="secondary">Code of Conduct</a>
</section>


<section>
  <hgroup>
  <h2>What to Expect?</h2>
  <p>A typical Tuesday evening Hacknight</p>
  </hgroup>
  <div class="grid">
    <article>
      <figure class="figure-image">
        <img
          src="{{ site.baseurl }}/assets/images/icon-happy-speech-bubble.png"
          alt="socializing icon"
        />
        <figcaption>
          <strong>7:00 pm</strong> Introductions to each other and Civic Tech Toronto
        </figcaption>
      </figure>
    </article>
    <article>
      <figure class="figure-image">
        <img
          src="{{ site.baseurl }}/assets/images/icon-podium.png"
          alt="presentation icon"
        />
        <figcaption>
          <strong>7:20 pm</strong> Scheduled speaker presents to the group
        </figcaption>
      </figure>
    </article>
    <article>
      <figure class="figure-image">
        <img
          src="{{ site.baseurl }}/assets/images/icon-collaboration.png"
          alt="collaboration icon"
        />
        <figcaption>
          <strong>7:50 pm</strong> Attendees collaborate on projects
        </figcaption>
      </figure>
  </article>
</div>
</section>

<section>
<hgroup>
<h3>Past Speakers</h3>
Some of our past hacknight speakers
</hgroup>

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
<a href="{{ '/speakers' | relative_url }}">See all past speakers here!</a>
</section>

<section>
<hgroup>
<h3>Our supporters</h3>
Some of our past supporters
</hgroup>
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
  <hgroup>
  <h2>How to Get Involved?</h2>
  <p>Here are some ways to connect and contribute.</p>
  </hgroup>
  <div class="grid">
    <article>
      <h3>Attend</h3>
      <p>The easiest way to get involved is to come out to one of our weekly hacknights!</p>
      <a role="button" href="https://guild.host/civic-tech-toronto/events" target="_blank">Sign Up<span aria-hidden="true">&nbsp;↗</span></a>
    </article>
    <article>
      <h3>Speak</h3>
      <p>If you’re interested in presenting you can get in touch with us to set up a chat.</p>
        <a role="button" href="mailto:hi@civictech.ca">hi@civictech.ca</a>
    </article>
    <article>
      <h3>Support</h3>
      <p>As a volunteer run community we are always looking for support. Our hacknights switch venues on a monthly basis. If you have a venue you can provide or other means to support please reach out!</p>
      <a role="button" href="mailto:hi@civictech.ca">hi@civictech.ca</a>
    </article>
  </div>
</section>