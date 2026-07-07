# The Platform — standalone site

Standalone landing site for Eric Lombardi's platform (13 chapters + PDF), designed to be
linked from ericforolp.ca. Static HTML — no build step.

- Live: https://elombardi-website.github.io/platform/
- Nav links back to https://www.ericforolp.ca; Sign-up + Donate buttons in the header.
- To update: edit files, then `git add -A && git commit -m "..." && git push`
  (redeploys automatically in ~1 minute).
- Source of truth for content is the Platform JSON in the "HSR Proposal" project —
  regenerate via PlatformSite/generate_site.py, then re-apply the standalone nav/footer
  (ask Claude).
