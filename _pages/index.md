---
title: "Civic Tech Toronto | A space to learn and collaborate"
layout: homepage
permalink: "/"
---

<section class="home-hero">
  <div class="home-hero__content">
    <h1 class="home-hero__headline">Toronto's civic community, building together.</h1>
    <p class="home-hero__sub">We bring technologists, designers, and community advocates together to work on the issues that matter.<br><strong>No tech background required.</strong></p>
    <div class="button-list">
      <a role="button" href="{{ '/projects' | relative_url }}">Find your project →</a>
      <a role="button" class="outline" href="{{ '/events' | relative_url }}">See what we're working on</a>
    </div>
  </div>
  <div class="home-hero__mosaic">
    <img src="{{ 'assets/images/CivicTechTO-InPerson.jpg' | relative_url }}"
         alt="Community members at a Civic Tech Toronto meetup"
         class="home-hero__photo" />
  </div>
</section>

<!-- === Recent Meetups ===  -->

<!-- Past Meetups -->

{% assign today = site.time | date: "%Y-%m-%d" %}

{% assign future_meetups = "" | split: "" %}
{% assign recent_meetups = "" | split: "" %}

{% for item in site.meetups %}
{% assign item_day = item.date | date: "%Y-%m-%d" %}
{% if item_day >= today %}
{% assign future_meetups = future_meetups | push: item %}
{% else %}
{% assign recent_meetups = recent_meetups | push: item %}
{% endif %}
{% endfor %}

{% assign future_meetups = future_meetups | sort: "date" %}
{% assign recent_meetups = recent_meetups | sort: "date" | reverse %}

<section>
  <h2>Events</h2>
  {% if future_meetups.size > 0 %}
  <header>
    <h3>Upcoming</h3>
  </header>
  <div id="meetupsGrid" class="card-grid">
    {% for event in future_meetups limit: 3 %}
      {% assign formatted_topics = "" | split: "," %}
      {% for tag in event.tags %}
        {% if tag contains "topic/" %}
          {% assign topic_name = tag | replace: "topic/", "" | capitalize %}
          {% assign formatted_topics = formatted_topics | push: topic_name %}
        {% endif %}
      {% endfor %}
      {% assign topics_string = formatted_topics | join: ", " %}
      <article class="card">
        <div class="row-content row-content-column">
          {% if event.image %}
            <div class="meetup-thumbnail">
              <a href="{{ event.url }}">
                {% picture events /events/{{ event.image }} alt="{{ event.topic }}" %}
              </a>
            </div>
          {% endif %}
          <div>
            <small>{{ event.date | date: "%B %d, %Y" }} – Meetup #{{ event.number }}</small>
            <br/>
            <a href="{{ event.url }}"><strong>{{ event.topic }}</strong></a>
            {% include topic-tags.html tags=event.tags %}
            {% if event.speakers %}
              <p>
                {% assign speakers_list = "" | split: "" %}
                {% for speaker in event.speakers %}
                  {% assign speaker_name = speaker | remove: '[[' | remove: ']]' %}
                  {% assign speakers_list = speakers_list | push: speaker_name %}
                {% endfor %}
                <small>with {{ speakers_list | join: ", " }}</small>
              </p>
            {% endif %}
          </div>
        </div>
        <div class="card-footer">
          {% if event.eventUrl %}
            <a role="button" class="outline" href="{{ event.eventUrl }}" target="_blank" rel="noopener">Registration<span aria-hidden="true">&nbsp;↗</span></a>
          {% endif %}
        </div>
      </article>
    {% endfor %}
  </div>
    <p>All upcoming events will be listed on the <a href="https://guild.host/civic-tech-toronto/events" target="_blank" rel="noopener">Events Registration Page<span aria-hidden="true">&nbsp;↗</span></a></p>
  {% endif %}

  <header>
    <h3>Recent</h3>
  </header>
  <div id="pastMeetupsList" class="grid">
    {% for event in recent_meetups limit: 3 %}
      {% assign formatted_topics = "" | split: "," %}
      {% for tag in event.tags %}
        {% if tag contains "topic/" %}
          {% assign topic_name = tag | replace: "topic/", "" | capitalize %}
          {% assign formatted_topics = formatted_topics | push: topic_name %}
        {% endif %}
      {% endfor %}
      {% assign topics_string = formatted_topics | join: ", " %}

      <article class="card card-row">
        <div class="row-content row-content-column">
          {% if event.image %}
            <div class="meetup-thumbnail">
              <a href="{{ event.url }}">
                {% picture events /events/{{ event.image }} alt="{{ event.topic }}" %}
              </a>
            </div>
          {% endif %}
          <div>
            <small>{{ event.date | date: "%B %d, %Y" }} — Meetup #{{ event.number }}</small>
            <br/>
            <a href="{{ event.url }}"><strong>{{ event.topic }}</strong></a>
            {% include topic-tags.html tags=event.tags %}
            {% if event.speakers %}
              {% assign speakers_list = "" | split: "" %}
              {% for speaker in event.speakers %}
                {% assign speaker_name = speaker | remove: '[[' | remove: ']]' %}
                {% assign speakers_list = speakers_list | push: speaker_name %}
              {% endfor %}
              <small>with {{ speakers_list | join: ", " }}</small>
            {% endif %}
          </div>
        </div>
      </article>
    {% endfor %}

  </div>

  <div class="frontpage-action">
    <a href="{{ '/events' | relative_url }}">See all Meetups here.</a>
  </div>
</section>

<!-- === Come As You Are === -->
<section class="home-welcome">
  <div class="home-welcome__grid">
    <article class="home-welcome__card">
      <div class="home-welcome__icon" aria-hidden="true">◎</div>
      <h3>Not a developer?</h3>
      <p>We have designers, writers, researchers, and advocates who've never written a line of code.</p>
    </article>
    <article class="home-welcome__card">
      <div class="home-welcome__icon" aria-hidden="true">◎</div>
      <h3>New to Toronto?</h3>
      <p>Our community spans every neighbourhood and background.</p>
    </article>
    <article class="home-welcome__card">
      <div class="home-welcome__icon" aria-hidden="true">◎</div>
      <h3>Not sure where to start?</h3>
      <p>Show up once. You'll figure out the rest together.</p>
    </article>
  </div>
</section>

<!-- === Projects Feature ===  -->

{% assign current_projects = site.projects | where_exp: "item", "item.categories contains 'meta/feature'" %}

<section>
  <header>
    <h2>Current Featured Projects</h2>
  </header>
  <div class="grid">
    {% for project in current_projects %}
      {% unless project.feature %}
      {% assign formatted_topics = "" | split: "," %}
      {% for tag in project.tags %}
        {% if tag contains "topic/" %}
          {% assign topic_name = tag | replace: "topic/", "" | capitalize %}
          {% assign formatted_topics = formatted_topics | push: topic_name %}
        {% endif %}
      {% endfor %}
      {% assign topics_string = formatted_topics | join: ", " %}

      <article class="card card-row">
      <div>
          {% if project.image %}
          <img class="ogimage" src="{{ project.image }}">
          {% endif %}
          </div>
        <div class="row-content">
          <div>
            <h3><a href="{{ project.url }}">{{ project.title }}</a></h3>
            {% if project.excerpt %}
              <p>{{ project.excerpt }}</p>
            {% endif %}
            {% if project.tags %}
              {% include topic-tags.html tags=project.tags %}
            {% endif %}
          </div>
        </div>
      </article>
      {% endunless %}
    {% endfor %}

  </div>

  <div class="frontpage-action">
    <a href="{{ '/projects' | relative_url }}">See all projects here.</a>
  </div>

</section>

<!-- === Featured Topics ===  -->

<section>
  <header>
    <h2>Explore Topics</h2>
  </header>
  <div class="feautured-topic-links">
    {% for topic in site.data.featured_topics.topics %}
      <a role="button" class="outline" href="{{ '/tags/topic/' | append: topic.slug | append: '/' | relative_url }}">
        {{ topic.title }}
      </a>
    {% endfor %}
  </div>
  <div class="frontpage-action">
    <a href="{{ '/tags/topic' | relative_url }}">See all topics here.</a>
  </div>
</section>

<!-- === Call to Actions ===  -->

<section>
  <hgroup>
  <h2>Calls to Action</h2>
  <p>Things to click!</p>
  </hgroup>
  <div class="grid">
    <article>
      <h3>About Us</h3>
      <p>Learn about CivicTech Toronto.</p>
      <a role="button" href="{{ '/about-us' | relative_url  }}">About Us</a>
    </article>
    <article>
      <h3>See Resources</h3>
      <p>See resources useful for engaging in CivicTech.</p>
      <a role="button" href="{{ '/resources' | relative_url  }}">See Resources</a>
    </article>
    <article>
      <h3>Get Involved</h3>
      <p>Find out ways to get involved with the community.</p>
      <a role="button" href="{{ '/get-involved' | relative_url  }}">Get Involved</a>
    </article>
  </div>
</section>
