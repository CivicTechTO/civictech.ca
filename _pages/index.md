---
title: "Civic Tech Toronto | A space to learn and collaborate"
layout: homepage
permalink: "/"
---

<article class="grid">
  <figure>
    <img
      src="{{ 'assets/images/CivicTechTO-InPerson.jpg' | relative_url }}"
      alt="Picture of a group of people sitting listening to a presentation at a Civic Tech Toronto Hacknight"
      style="border-radius: 4px;"
    />
  </figure>
  <div>
    <hgroup>
    <h1>Community for public good.</h1>
    <p>Every Tuesday from 7pm to 9pm – in person and online.</p>
    </hgroup>
    <p>We meet every Tuesday to work on projects, hear from thoughtful speakers, and connect with others who care about how technology can improve our communities.</p>
    <p>You don’t need to be in tech to join us—everyone’s welcome, no matter your background or experience.</p>
    <p>Our events are hybrid – join us in person or online.</p>
    <div class="button-list">
      <a role="button" class="outline" href="https://guild.host/ctto/events" target="_blank">Sign up on Guild<span aria-hidden="true">&nbsp;↗</span></a>
      <a role="button" class="secondary outline" href="{{'/hacknights' | relative_url }}">See past events</a>
    </div>
  </div>
</article>

<!-- === Recent Hacknights ===  -->

<!-- Past Hacknights -->

{% assign today = site.time | date: "%Y-%m-%d" %}

{% assign future_hacknights = "" | split: "" %}
{% assign recent_hacknights = "" | split: "" %}

{% for item in site.hacknights %}
{% assign item_day = item.date | date: "%Y-%m-%d" %}
{% if item_day >= today %}
{% assign future_hacknights = future_hacknights | push: item %}
{% else %}
{% assign recent_hacknights = recent_hacknights | push: item %}
{% endif %}
{% endfor %}

{% assign future_hacknights = future_hacknights | sort: "date" %}
{% assign recent_hacknights = recent_hacknights | sort: "date" | reverse %}

<section>
  <h2>Events</h2>
  {% if future_hacknights.size > 0 %}
  <header>
    <h3>Upcoming</h3>
  </header>
  <div id="hacknightsGrid" class="card-grid">
    {% for event in future_hacknights limit: 3 %}
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
            <a href="{{ event.url }}">
              <div class="hacknight-thumbnail">
                <img src="{{ site.baseurl }}/assets/images/hacknights/{{ event.image }}" alt="{{ event.topic }}" class="hacknight-image">
              </div>
            </a>
          {% endif %}
          <div>
            <small>{{ event.date | date: "%B %d, %Y" }} – Hacknight #{{ event.number }}</small>
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
  <div id="pastHacknightsList" class="grid">
    {% for event in recent_hacknights limit: 3 %}
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
            <a href="{{ event.url }}">
              <div class="hacknight-thumbnail">
                <img src="{{ site.baseurl }}/assets/images/hacknights/{{ event.image }}" alt="{{ event.topic }}" class="hacknight-image">
              </div>
            </a>
          {% endif %}
          <div>
            <small>{{ event.date | date: "%B %d, %Y" }} — Hacknight #{{ event.number }}</small>
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
    <a href="{{ '/hacknights' | relative_url }}">See all Hacknights here.</a>
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
