# Landing Page Analytics

## Overview

PostHog analytics are integrated into n.codes public landing pages to track user engagement and understand how visitors interact with our product.

## Tracked Events

### All Pages
- **page_view** - Recorded when any page loads
  - `page_path` - URL path visited
  - `page_title` - Page title

### Homepage (`/`)
- **external_link_click** - When users click external links (GitHub, Twitter, etc.)
  - `url` - Target URL
  - `text` - Link text
- **internal_link_click** - When users click anchor links (navigation within page)
  - `anchor` - Anchor href
  - `text` - Link text

### Demo Page (`/demo/`)
- **demo_loaded** - When demo app finishes initializing
- **demo_build_clicked** - When user clicks "Build with AI" button
- **demo_example_selected** - When user selects a demo example
  - `example_text` - Example description
- **demo_walkthrough_skipped** - When user skips the guided tour

### Changelog Page (`/changelog/`)
- **page_view** - Standard page view tracking

## What We Don't Track

- User personal information (name, email, IP address is hashed)
- Content inside text areas or input fields
- Form submissions or sensitive data
- Browsing history outside n.codes

## Privacy

- **Anonymous by default** - PostHog's person profiles identify unique browsers, not individuals
- **No personally identifiable information** - We don't collect or track PII
- **Privacy-compliant** - Compliant with GDPR, CCPA, and other privacy regulations
- **Transparent** - This document explains what we track

## Why We Track

We use this data to:
- Understand which features are most interesting to visitors
- Identify drop-off points in the demo experience
- Measure homepage engagement
- Optimize landing page content based on actual usage

## Opting Out

Users can opt out using browser privacy settings:
- **Do Not Track** header will be respected by PostHog
- Browser privacy mode / incognito will not be tracked
- You can block PostHog's domain if you prefer

## Implementation Details

PostHog is loaded asynchronously from `us.posthog.com`. The tracking script:
- Does not block page rendering
- Uses event capturing for non-blocking data collection
- Automatically batches events for efficiency
