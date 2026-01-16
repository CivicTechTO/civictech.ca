---
title: "Meetups"
layout: page
permalink: "/events/"
redirect_from: /hacknights/
---

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

<!-- Extract unique topics for filters -->

{% assign all_events = site.meetups %}
{% assign topic_tags = "" | split: "," %}
{% for event in all_events %}
{% for tag in event.tags %}
{% if tag contains "topic/" %}
{% assign topic_name = tag | replace: "topic/", "" | replace: "-", " " | capitalize %}
{% assign topic_tags = topic_tags | push: topic_name %}
{% endif %}
{% endfor %}
{% endfor %}
{% assign unique_topics = topic_tags | uniq | sort %}

<!-- Helper snippets -->

{% capture render_speakers %}
{% if event.speakers %}
{% assign speakers_list = "" | split: "" %}
{% for speaker in event.speakers %}
{% assign speaker_name = speaker | remove: '[[' | remove: ']]' %}
{% assign speakers_list = speakers_list | push: speaker_name %}
{% endfor %}
<small>with {{ speakers_list | join: ", " }}</small>
{% endif %}
{% endcapture %}

{% capture render_topics %}
{% if event.tags %}
{% include topic-tags.html tags=event.tags %}
{% endif %}
{% endcapture %}

<!-- Upcoming Meetups -->

<section>
  <header>
    <h2>Upcoming Meetups</h2>
  </header>
  {% if future_meetups.size > 0 %}
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
  {% endif %}
  <p>All upcoming events will be listed on the <a href="https://guild.host/civic-tech-toronto/events" target="_blank" rel="noopener">Events Registration Page<span aria-hidden="true">&nbsp;↗</span></a></p>
</section>

<!-- Past Meetups -->
<section>
  <header>
    <h2>Past Meetups</h2>
  </header>
  <div id="pastMeetupsList" class="card-list">
    {% for event in recent_meetups %}
      {% assign formatted_topics = "" | split: "," %}
      {% for tag in event.tags %}
        {% if tag contains "topic/" %}
          {% assign topic_name = tag | replace: "topic/", "" | capitalize %}
          {% assign formatted_topics = formatted_topics | push: topic_name %}
        {% endif %}
      {% endfor %}
      {% assign topics_string = formatted_topics | join: ", " %}
      <article class="card card-row" data-topics="{{ topics_string }}">
        <div class="row-content">
          {% if event.image %}
            <div class="meetup-thumbnail">
              <a href="{{ event.url }}">
                {% picture events /events/{{ event.image }} alt="{{ event.topic }}" %}
              </a>
            </div>
          {% endif %}
          <div>
            <small>
              {{ event.date | date: "%B %d, %Y" }} – Meetup #{{ event.number }}
            </small>
            <br/>
            <h3>
              <a href="{{ event.url }}">
                {{ event.topic }}
              </a>
            </h3>
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
</section>
