---
title: "Hacknights"
layout: page
permalink: "/hacknights/"
---

{% assign now = site.time %}
{% assign future_hacknights = site.hacknights | where_exp: "item", "item.date > now" | sort: "date" %}
{% assign past_hacknights = site.hacknights | where_exp: "item", "item.date <= now" | sort: "date" | reverse %}

<!-- Extract unique topics for filters -->
{% assign all_events = site.hacknights %}
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

<!-- Upcoming Hacknights -->
{% if future_hacknights.size > 0 %}
<section>
  <header>
    <h2>Upcoming Hacknights</h2>
  </header>
  <div id="hacknightsGrid" class="card-grid">
    {% for event in future_hacknights %}
      {% assign formatted_topics = "" | split: "," %}
      {% for tag in event.tags %}
        {% if tag contains "topic/" %}
          {% assign topic_name = tag | replace: "topic/", "" | capitalize %}
          {% assign formatted_topics = formatted_topics | push: topic_name %}
        {% endif %}
      {% endfor %}
      {% assign topics_string = formatted_topics | join: ", " %}

      <article class="card filterRow" data-topics="{{ topics_string }}">
        <div class="card-body">
          <p><strong>Hacknight #{{ event.number }}</strong></p>
          <h3><a href="{{ event.url }}">{{ event.topic }}</a></h3>
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
        <div class="card-footer">
          {% if event.eventUrl %}
            <a role="button" class="outline" href="{{ event.eventUrl }}" target="_blank" rel="noopener">Event Link</a>
          {% endif %}
          <a role="button" href="{{ event.url }}">View</a>
        </div>
      </article>
    {% endfor %}
  </div>
</section>
{% endif %}

<!-- Past Hacknights -->
<section>
  <header>
    <h2>Past Hacknights</h2>
  </header>
  <div id="pastHacknightsList" class="card-list">
    {% for event in past_hacknights %}
      {% assign formatted_topics = "" | split: "," %}
      {% for tag in event.tags %}
        {% if tag contains "topic/" %}
          {% assign topic_name = tag | replace: "topic/", "" | capitalize %}
          {% assign formatted_topics = formatted_topics | push: topic_name %}
        {% endif %}
      {% endfor %}
      {% assign topics_string = formatted_topics | join: ", " %}

      <article class="card card-row filterRow" data-topics="{{ topics_string }}">
        <div class="row-content">
        {% if event.image %}
          <a href="{{ event.url }}">
            <div class="hacknight-thumbnail">
              <img src="{{ site.baseurl }}/assets/images/hacknights/thumbnails/{{ event.image }}" alt="{{ event.topic }}" class="hacknight-image">
            </div>
          </a>
        {% endif %}
          <div class="row-text">
            <small>
              {{ event.date | date: "%B %d, %Y" }} – Hacknight #{{ event.number }}
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
