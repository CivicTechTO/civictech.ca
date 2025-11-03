---
title: "Resources"
layout: page
permalink: "/resources/"
---

{% assign all_resources = site.resources %}

<!-- Extract unique categories -->
{% assign all_categories = "" | split: "," %}
{% for resource in all_resources %}
  {% for category in resource.categories %}
    {% assign category_name = category | downcase %}
    {% unless all_categories contains category_name %}
      {% assign all_categories = all_categories | push: category_name %}
    {% endunless %}
  {% endfor %}
{% endfor %}
{% assign unique_categories = all_categories | uniq | sort %}

<!-- Extract unique topic tags for filter -->
{% assign topic_tags = "" | split: "," %}
{% for resource in all_resources %}
  {% for tag in resource.tags %}
    {% if tag contains "topic/" %}
      {% assign topic_name = tag | replace: "topic/", "" | capitalize %}
      {% assign topic_tags = topic_tags | push: topic_name %}
    {% endif %}
  {% endfor %}
{% endfor %}
{% assign unique_topics = topic_tags | uniq | sort %}

<section>
  <ul>
    {% for category in unique_categories %}
      <li>
        <a href="#{{ category | slugify }}">
          {{ category | replace: "-", " " | capitalize }}
        </a>
      </li>
    {% endfor %}
  </ul>
</section>

<!-- Resources grouped by Category -->

{% for category in unique_categories %}
<section>
  <header class="sticky">
    <h2 id="{{ category | slugify }}">
      {{ category | replace: "-", " " | capitalize }}
    </h2>
  </header>

  <div id="resourcesList" class="card-list">
    {% for resource in all_resources %}
      {% if resource.categories contains category %}
      {% assign formatted_topics = "" | split: "," %}
      {% for tag in resource.tags %}
        {% if tag contains "topic/" %}
          {% assign topic_name = tag | replace: "topic/", "" | capitalize %}
          {% assign formatted_topics = formatted_topics | push: topic_name %}
        {% endif %}
      {% endfor %}
      {% assign topics_string = formatted_topics | join: ", " %}

      <article class="card card-row">
        <div class="row-content">
          <div>
            <h3>
              {% if resource.website %}
                <a href="{{ resource.website }}" target="_BLANK">
              {% endif %}
                {{ resource.title }}
              {% if resource.website %}</a>{% endif %}
            </h3>

            {% if resource.description %}
              <p>{{ resource.description }}</p>
            {% endif %}

            {% if resource.tags %}
              {% include topic-tags.html tags=resource.tags %}
            {% endif %}
          </div>
        </div>
      </article>
      {% endif %}
    {% endfor %}
  </div>
</section>
{% endfor %}
