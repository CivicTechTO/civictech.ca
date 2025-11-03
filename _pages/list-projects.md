---
title: "Projects"
layout: page
permalink: "/projects/"
---

{% assign all_projects = site.projects %}

<!-- Extract unique topics -->
{% assign topic_tags = "" | split: "," %}
{% for project in all_projects %}
  {% for tag in project.tags %}
    {% if tag contains "topic/" %}
      {% assign topic_name = tag | replace: "topic/", "" | replace: "-", " " | capitalize %}
      {% assign topic_tags = topic_tags | push: topic_name %}
    {% endif %}
  {% endfor %}
{% endfor %}
{% assign unique_topics = topic_tags | uniq | sort %}

<!-- Featured Projects -->
{% assign open_projects = all_projects | where_exp: "item", "item.categories contains 'contributors/open'" %}

<!-- Split Breakout and Other Projects -->
{% assign breakout_projects = all_projects | where_exp: "item", "item.tags contains 'from/breakout'" %}
{% assign other_projects = all_projects | reject: "tags", "from/breakout" %}

<!-- Featured Projects -->
{% if open_projects.size > 0 %}
<section>
  <header>
    <h2 id="featured">Current Open Projects</h2>
  </header>
  <p>These are some of our currently community projects open to new contributors.</p>

  <div class="card-grid">
    {% for project in open_projects %}
      <article class="card">
        {% if project.image %}
            <img class="ogimage listed" src="{{ project.image }}">
          {% endif%}
        <div class="card-body">
          <h3><a href="{{ project.url }}">{{ project.title }}</a></h3>
          {% if project.excerpt %}
            <p>{{ project.excerpt }}</p>
          {% endif %}
          {% if project.tags %}
            {% include topic-tags.html tags=project.tags %}
          {% endif %}
          {% if project.categories %}
            {% include namespaced-categories.html categories=project.categories namespaces="status,contributors,format" %}
          {% endif %}
        </div>
        <div class="card-footer">
          {% if project.project_website %}
            <a role="button" class="outline" href="{{ project.project_website }}" target="_blank" rel="noopener">Website</a>
          {% endif %}
        </div>
      </article>
    {% endfor %}
  </div>
</section>
{% endif %}


<!-- Projects Originating from CivicTech Toronto -->
{% if breakout_projects.size > 0 %}
<section>
  <header class="sticky">
    <h2 id="breakout">Projects Originating from CivicTech Toronto ({{ breakout_projects.size }})</h2>
  </header>
  <div class="card-list">
    {% for project in breakout_projects %}
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
        <div class="row-content">
          {% if project.image %}
            <img class="ogimage listed" src="{{ project.image }}">
          {% endif%}
          <div>
            <h3><a href="{{ project.url }}">{{ project.title }}</a></h3>
            {% if project.excerpt %}
              <p>{{ project.excerpt }}</p>
            {% endif %}
            {% if project.tags %}
              {% include topic-tags.html tags=project.tags %}
            {% endif %}
            {% if project.categories %}
              {% include namespaced-categories.html categories=project.categories namespaces="status,contributors,format" %}
            {% endif %}
          </div>
          <div class="row-actions">
            {% if project.project_website %}
              <a role="button" class="outline" href="{{ project.project_website }}" target="_blank" rel="noopener">Website</a>
            {% endif %}
          </div>
        </div>
      </article>
      {% endunless %}
    {% endfor %}
  </div>
</section>
{% endif %}

<!-- Other Community Projects -->
{% if other_projects.size > 0 %}
<section>
  <header class="sticky">
    <h2 id="community">Other Community Projects ({{ other_projects.size }})</h2>
  </header>
  <div class="card-list">
    {% for project in other_projects %}
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
        <div class="row-content">
          {% if project.image %}
            <img class="ogimage listed" src="{{ project.image }}">
          {% endif %}

          <div>
            <h3><a href="{{ project.url }}">{{ project.title }}</a></h3>
            {% if project.excerpt %}
              <p>{{ project.excerpt }}</p>
            {% endif %}
            {% if project.tags %}
              {% include topic-tags.html tags=project.tags %}
            {% endif %}
            {% if project.categories %}{% include namespaced-categories.html categories=project.categories namespaces="status,contributors" %}{% endif %}
          </div>
          <div class="row-actions">
            {% if project.project_website %}
              <a role="button" class="outline" href="{{ project.project_website }}" target="_blank" rel="noopener">Website</a>
            {% endif %}
          </div>
        </div>
      </article>
      {% endunless %}
    {% endfor %}
  </div>
</section>
{% endif %}
