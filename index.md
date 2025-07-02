---
title: "Civic Tech Toronto | A space to learn and collaborate"
layout: homepage
---
<article class="grid">
  <figure>
    <img
      src="assets/images/CivicTechTO-InPerson.jpg"
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
    <p>Our events are hybrid, join us in person or online.</p>
    <div class="button-list">
      <a role="button" class="outline" href="https://guild.host/ctto/events" target="_blank">Sign up on Guild<span aria-hidden="true">&nbsp;↗</span></a>
      <a role="button" class="secondary outline" href="{{'/hacknights' | relative_url }}">See past events</a>
    </div>
  </div>
</article>

<!-- === Recent Hacknights ===  -->

<!-- Past Hacknights -->

{% assign now = site.time %}
{% assign recent_hacknights = site.hacknights | where_exp: "item", "item.date <= now" | sort: "date" | reverse %}

<section>
  <header>
    <h2>Recent Events</h2>
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

      <article class="card card-row filterRow" data-topics="{{ topics_string }}">
        <div class="row-content">
        {% if event.image %}
          <div class="hacknight-thumbnail">
            <img src="{{ site.baseurl }}/assets/images/hacknights/thumbnails/{{ event.image }}" alt="{{ event.topic }}" class="hacknight-image">
          </div>
        {% endif %}
          <div class="row-text">
            <small>{{ event.date | date: "%B %d, %Y" }}</small><br/>
            <strong>Hacknight #{{ event.number }}</strong><br/>
            <a href="{{ event.url }}"><strong>{{ event.topic }}</strong></a>
            {% include topic-tags.html tags=event.tags %}
            {% if event.speakers %}
              <br/>
              {% assign speakers_list = "" | split: "" %}
              {% for speaker in event.speakers %}
                {% assign speaker_name = speaker | remove: '[[' | remove: ']]' %}
                {% assign speakers_list = speakers_list | push: speaker_name %}
              {% endfor %}
              <small>with {{ speakers_list | join: ", " }}</small>
            {% endif %}
          </div>

          <div class="row-actions">
            <a role="button" href="{{ event.url }}">View</a>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
  <a href="{{ '/hacknights' | relative_url }}">See all Hacknights here.</a>
</section>



<!-- === Projects Feature ===  -->

{% assign current_projects = site.projects | where_exp: "item", "item.categories contains 'meta/feature'" %}

<section>
  <header>
    <h2>Current Featured Projects</h2>
  </header>
  <div class="card-list">
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

      <article class="card card-row filterRow" data-topics="{{ topics_string }}">
        <div class="row-content">
          <div class="row-text">
            <h3><a href="{{ project.url }}">{{ project.title }}</a></h3>
            {% if project.excerpt %}
              <p>{{ project.excerpt }}</p>
            {% endif %}
            {% if project.tags %}
              {% include topic-tags.html tags=project.tags %}
            {% endif %}
          </div>
          <div class="row-actions">
            {% if project.project_website %}
              <a role="button" class="outline" href="{{ project.project_website }}" target="_blank" rel="noopener">Website</a>
            {% endif %}
            <a role="button" href="{{ project.url }}">View</a>
          </div>
        </div>
      </article>
      {% endunless %}
    {% endfor %}
  </div>
  <a href="{{ '/projects' | relative_url }}">See all projects here.</a>

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
