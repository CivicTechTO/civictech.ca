# llms.txt Implementation Design

**Date:** 2026-02-03  
**Status:** Approved

## Overview

Create an `llms.txt` file for the Civic Tech Toronto website to help Large Language Models understand the organization, its mission, structure, and how to navigate the website's content.

## Goal

Provide comprehensive organizational context to LLMs so they can accurately answer questions about Civic Tech Toronto by surfacing all key information that the website already provides.

## Approach

**Hybrid structure:** Main `llms.txt` file with essential organizational info plus references to existing detailed web pages.

### Why Hybrid?

- LLMs get core context immediately without parsing huge files
- Website already has well-structured content that LLMs can follow
- Easier to maintain — no content duplication
- Follows llms.txt convention as a lightweight "map" to deeper content
- Jekyll collections structure is already LLM-friendly

## File Structure

### Main File: `/llms.txt`

**Location:** Repository root  
**URL:** `https://civictech.ca/llms.txt`  
**Size:** ~500-800 lines  
**Format:** Plain text with markdown-style formatting

**Purpose:** Help LLMs understand:
- What Civic Tech Toronto is
- Mission and values
- How the community operates
- Website content structure
- Contact info and participation methods
- Links to deeper content

## Content Organization

The `llms.txt` file will be organized as follows:

```
# Civic Tech Toronto - LLM Context

## About This File
- Purpose and how LLMs should use this information
- Last updated date

## Organization Overview  
- What is Civic Tech Toronto
- Mission and values
- Community demographics (volunteer-run, weekly meetups, hybrid attendance)

## How We Meet
- Weekly Tuesday schedule (7pm-9pm ET)
- Event format (welcome → presentation → projects → social)
- Hybrid (in-person + online)
- Registration links (Guild platform)

## Website Structure & Navigation
- Explanation of Jekyll collections (meetups, projects, people, organizations, venues, resources)
- How content is organized (tags, categories, permalinks)
- Key pages and what they contain

## Key Information
- Contact: hi@civictech.ca
- Code of Conduct summary + link to full version
- How to get involved (attend, volunteer, speak, sponsor)
- Social/communication channels

## Content Collections Guide
- Brief description of each collection type with links
- Topics taxonomy overview
- How historical data is structured (archives submodule)

## External References
- Links to key pages for deeper info
```

## Technical Implementation

### Jekyll Configuration

Modify `_config.yml` to include llms.txt in the built site:

```yaml
include:
  - _pages
  - llms.txt  # Add this line
```

### File Details

- **Format:** Plain text, markdown-style formatting
- **Encoding:** UTF-8
- **No Jekyll frontmatter** (static file, not a page)
- **Absolute URLs** for all references (https://civictech.ca/...)

### Maintenance

- Manual updates when organizational info changes
- Static content is appropriate (no automated generation needed)
- Could optionally add update reminders to CI/git hooks

## Content Strategy

### Writing Style

- Clear, factual, direct tone
- Present tense where appropriate
- Assume no prior knowledge of Civic Tech Toronto
- Use full name first, then "CTTO" or "the community"

### Link Strategy

- Use absolute URLs for external LLM consumption
- Link to existing pages rather than duplicating content
- Provide context about what each linked page contains

### Information Freshness

- **Static facts in llms.txt:** Mission, general structure, contact info
- **Dynamic data via links:** Current events, active projects
- Include "Last updated: YYYY-MM-DD" timestamp

### Special Considerations

- Mention dual-license structure (MIT for code, CC BY-NC-SA for content)
- Highlight archives git submodule structure
- Provide founding/historical context for the community
- Note volunteer-run nature

## Dynamic Content Handling

For content that changes frequently (like events):

- Include general event information (schedule, format, how to RSVP)
- Reference the live events page for current listings
- Avoid snapshots that become stale
- Provide pattern/structure info rather than specific instances

## Validation Plan

After creation:
1. Test by having an LLM read the file and answer questions about CTTO
2. Verify all links work and point to correct content
3. Check formatting renders correctly as plain text
4. Confirm file is accessible at https://civictech.ca/llms.txt

## Files to Create/Modify

1. **Create:** `/llms.txt` - Main LLM context file
2. **Modify:** `/_config.yml` - Add llms.txt to include list

## Success Criteria

- LLMs can accurately answer questions about:
  - What Civic Tech Toronto is and its mission
  - When and how to attend events
  - How to get involved
  - Where to find projects, resources, and other content
  - Community structure and values
- File is accessible and properly served by Jekyll
- Links resolve correctly
- Content is maintainable and doesn't duplicate existing pages
