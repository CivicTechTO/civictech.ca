---
title: "Announcements"
layout: page
permalink: "/announcements/"
---

{% assign all_announcements = site.announcements | sort: "date" | reverse %}

<section>
  <header>
    <h2>Latest Announcements</h2>
  </header>

  <div class="card-list">
    {% for post in all_announcements %}
      <article class="card card-row">
        <div class="row-content">
          <div>
            <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
            <p><small>
              {% if post.date %}{{ post.date | date: "%B %d, %Y" }}{% endif %}
              {% if post.author %}
                • <span>
                  {% assign author_name = post.author | remove: '[[' | remove: ']]' %}
                  {{ author_name }}
                </span>
              {% endif %}
              </small>
            </p>
            {% if post.excerpt %}
              <p>{{ post.excerpt }}</p>
            {% else %}
              <p>{{ post.content | strip_html | truncatewords: 30 }}</p>
            {% endif %}
          </div>
          <div class="row-actions">
            <a role="button" href="{{ post.url }}">Read More</a>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
</section>
