---
title: "People"
layout: page
permalink: "/people/"
---

{% assign all_people = site.people %}

<section>
  <header>
    <h2>People</h2>
  </header>

  <div class="card-list">
  <aside>
  <nav>
  <ul>
    {% for person in all_people %}
    <li><a href="{{ person.url }}">{{ person.title }}</a></li>
    {% endfor %}
  </ul>
  </nav>
  </aside>
  </div>
</section>
