# Safety Superheroes

A free, offline-capable Progressive Web App that teaches real-world safety skills to autistic children through comic-book-style superhero stories, flashcards, and original mini-games.

**Live app:** https://evanpark46-prog.github.io/autism-app/Safety%20App/index.html

> This project is not affiliated with any existing comic book or superhero franchise. All heroes, emblems, and artwork described here are original to this app.

## What it is

Safety Superheroes teaches 27 safety topics — from street safety and stranger safety to body boundaries, online safety, self-advocacy, and self-regulation — through:

- **Story mode**: three difficulty levels per topic, each a branching narrative (narrative beats, decision points, dialogue, matching, and sequencing steps) starring a recurring kid protagonist, Alex.
- **Flashcards**: quick review of each topic's key ideas, in solo or guided (repeat-then-quiz) modes.
- **Video mode**: checkpoint quizzes layered over a topic video, with a full quiz-only fallback when no video is set.
- **A hero wall**: every topic has a matching original superhero (name, power, and emblem) that "unlocks" on completion.
- **Original mini-games**: Hero Quiz Rush (streak-based review quiz), Word Power Quiz with a Sky Chase bonus round, and Sort It Out — all built from the same topic content, no licensed characters.

The whole app is plain HTML/CSS/vanilla JS with no build step (aside from a small content-bundling script), works fully offline via a service worker, and stores all preferences and progress locally in the browser — no accounts, no ads, no tracking.

## Design principles

- **Calm by default.** Calm Mode ships on for first-time visitors: it disables animation/transitions, mutes sound effects, and simplifies the UI. `prefers-reduced-motion` is respected everywhere in parallel.
- **Bilingual.** Every string ships in English and Spanish via a shared `UI_STRINGS` dictionary (`js/i18n.js`).
- **Accessible.** WCAG 2.1 AA color contrast, 44x44px minimum touch targets, and semantic markup are treated as launch requirements, not nice-to-haves.
- **Private.** No login, no analytics tracking by default, no data leaves the device.

## Project layout

```
Safety App/              the live app (note: folder name has a literal space)
  index.html, *.html      one shell page per screen (home, topic, games, badges, ...)
  js/data.js              source of truth for all topic content (TOPICS + CONTENT.en/es)
  js/heroes.js            one superhero per topic (emblem, name, power, tagline)
  js/categories.js        groups topics into the home page's category sections
  tools/build-content.js  splits js/data.js into content/<topic-id>.js + js/topics-index.js
  content/                generated per-topic bundles (lazy-loaded by topic.html)
  service-worker.js       offline precache; bump CACHE_NAME after editing any shell file

conversat-learning-planets-nextjs/   an early-stage, separate Next.js prototype (not the main app)
```

## Adding or editing a lesson topic

1. Edit `js/data.js`: add an entry to the `TOPICS` array, plus a matching `CONTENT.en.<id>` and `CONTENT.es.<id>` block (copy an existing topic's shape).
2. Run `node tools/build-content.js` to regenerate `content/<id>.js` and `js/topics-index.js`.
3. Add a hero entry in `js/heroes.js` and place the topic in a category in `js/categories.js`.
4. Bump `CACHE_NAME` in `service-worker.js`.

## Running locally

No build step is required to view the app. Serve the `Safety App/` folder with any static file server, e.g.:

```
npx http-server "Safety App" -p 8099
```

then open `http://localhost:8099/index.html`.

## Deployment

The app is deployed via GitHub Pages from the `main` branch. The root `index.html` redirects to `Safety App/index.html`.

## History note

Earlier root-level files (`Roadmap`, `Privacy.md`, `Product Specs.md`, `Background Research.md`, `Interviews.md`) describe an initial AAC communication-app concept that predates Safety Superheroes and was not built. They're kept for historical context but no longer reflect the current app.
