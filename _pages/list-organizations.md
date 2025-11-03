---
title: "Organizations"
layout: page
permalink: "/organizations/"
---

{% assign all_orgs = site.organizations %}

<!-- Extract unique categories -->
{% assign all_categories = "" | split: "," %}
{% assign uncategorized_orgs = "" | split: "" %}
{% for org in all_orgs %}
  {% if org.categories %}
    {% for category in org.categories %}
      {% assign category_name = category | downcase %}
      {% unless all_categories contains category_name %}
        {% assign all_categories = all_categories | push: category_name %}
      {% endunless %}
    {% endfor %}
  {% else %}
    {% assign uncategorized_orgs = uncategorized_orgs | push: org %}
  {% endif %}
{% endfor %}
{% assign unique_categories = all_categories | uniq | sort %}

<!-- Organizations grouped by Category -->

{% for category in unique_categories %}
<section>
  <header>
    <h2>{{ category | replace: "-", " " | capitalize }} Organizations</h2>
  </header>

  <div class="card-list">
    {% for org in all_orgs %}
      {% if org.categories contains category %}
      <article class="card card-row">
        <div class="row-content">
          <div>
            <h3><a href="{{ org.url }}">{{ org.title }}</a></h3>

            {% if org.description %}
              <p>{{ org.description }}</p>
            {% endif %}

            {% if org.tags %}
              {% include topic-tags.html tags=org.tags %}
            {% endif %}
          </div>

          <div class="row-actions">
            {% if org.website %}
              <a role="button" class="outline" href="{{ org.website }}" target="_blank" rel="noopener">Website</a>
            {% endif %}
            <a role="button" href="{{ org.url }}">View</a>
          </div>
        </div>
      </article>
      {% endif %}
    {% endfor %}
  </div>
</section>
{% endfor %}

<!-- Uncategorized Organizations -->

{% if uncategorized_orgs.size > 0 %}
<section>
  <header>
    <h2>Other Organizations</h2>
  </header>

  <div class="card-list">
    {% for org in uncategorized_orgs %}
      <article class="card card-row">
        <div class="row-content">
          <div>
            <h3><a href="{{ org.url }}">{{ org.title }}</a></h3>

            {% if org.description %}
              <p>{{ org.description }}</p>
            {% endif %}

            {% if org.tags %}
              {% include topic-tags.html tags=org.tags %}
            {% endif %}
          </div>

          <div class="row-actions">
            {% if org.website %}
              <a role="button" class="outline" href="{{ org.website }}" target="_blank" rel="noopener">Website</a>
            {% endif %}
            <a role="button" href="{{ org.url }}">View</a>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
</section>
{% endif %}
