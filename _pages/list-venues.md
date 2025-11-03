---
title: "Venues"
layout: page
permalink: "/venues/"
---

{% assign all_venues = site.venues %}

<!-- Extract unique categories -->
{% assign all_categories = "" | split: "," %}
{% assign categorized_venues = "" | split: "" %}
{% assign uncategorized_venues = "" | split: "" %}

{% for venue in all_venues %}
  {% if venue.categories == nil or venue.categories == empty %}
    {% assign uncategorized_venues = uncategorized_venues | push: venue %}
  {% else %}
    {% for category in venue.categories %}
      {% assign category_name = category | downcase %}
      {% unless all_categories contains category_name %}
        {% assign all_categories = all_categories | push: category_name %}
      {% endunless %}
    {% endfor %}
    {% assign categorized_venues = categorized_venues | push: venue %}
  {% endif %}
{% endfor %}
{% assign unique_categories = all_categories | uniq | sort %}

<!-- Display Uncategorized Venues if any -->
{% if uncategorized_venues.size > 0 %}
<section>
  <header>
    <h2>Venues</h2>
  </header>

  <div class="card-list">
    {% for venue in uncategorized_venues %}
      <article class="card card-row">
        <div class="row-content">
          <div>
            <h3><a href="{{ venue.url }}">{{ venue.title }}</a></h3>

            {% if venue.address %}
              <p><small>{{ venue.address }}</small></p>
            {% endif %}

            {% if venue.organization %}
              <p><small>Hosted by: 
                {% for org in venue.organization %}
                  {{ org | remove: '[[' | remove: ']]' }}{% unless forloop.last %}, {% endunless %}
                {% endfor %}
              </small></p>
            {% endif %}

            {% if venue.tags %}
              {% include topic-tags.html tags=venue.tags %}
            {% endif %}
          </div>

          <div class="row-actions">
            <a role="button" href="{{ venue.url }}">View</a>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
</section>
{% endif %}

<!-- Display Venues grouped by Category -->
{% for category in unique_categories %}
<section>
  <header>
    <h2>{{ category | replace: "-", " " | capitalize }} Venues</h2>
  </header>

  <div class="card-list">
    {% for venue in categorized_venues %}
      {% if venue.categories contains category %}
      <article class="card card-row">
        <div class="row-content">
          <div>
            <h3><a href="{{ venue.url }}">{{ venue.title }}</a></h3>

            {% if venue.address %}
              <p><small>{{ venue.address }}</small></p>
            {% endif %}

            {% if venue.organization %}
              <p><small>Hosted by: 
                {% for org in venue.organization %}
                  {{ org | remove: '[[' | remove: ']]' }}{% unless forloop.last %}, {% endunless %}
                {% endfor %}
              </small></p>
            {% endif %}

            {% if venue.tags %}
              {% include topic-tags.html tags=venue.tags %}
            {% endif %}
          </div>

          <div class="row-actions">
            <a role="button" href="{{ venue.url }}">View</a>
          </div>
        </div>
      </article>
      {% endif %}
    {% endfor %}
  </div>
</section>
{% endfor %}
