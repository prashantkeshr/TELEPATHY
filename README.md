<div align="center">

<img src="public/favicon.svg" width="72" height="72" alt="Telepathy logo" />

# Telepathy

**Meet someone new. Find something in common. Start a meaningful conversation.**

A privacy-first, peer-to-peer platform for meeting strangers, making friends, practicing a language, and exchanging knowledge and ideas — by text, voice, or video, with no account required.

[![License](https://img.shields.io/badge/license-choose--one-lightgrey)](#license)
![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-peer--to--peer-333333?logo=webrtc&logoColor=white)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

[Live demo](https://telepathy.dhurta.com) · [Report a bug](https://github.com/prashantkeshr/TELEPATHY/issues) · [Request a feature](https://github.com/prashantkeshr/TELEPATHY/issues)

</div>

---

## What is Telepathy?

Telepathy is a **stranger-chat and social-discovery platform** built around one idea: the best way to meet someone new isn't a random video roulette — it's a conversation that starts from something you actually have in common. Telepathy combines **random discovery**, **interest-based matching**, **language exchange**, and **knowledge exchange** in one modern, professional interface, and lets you talk by **text, voice, or video** over **direct peer-to-peer WebRTC connections**.

It's designed as a serious alternative to old-style anonymous video-chat sites: no forced camera or microphone access, no account wall, no centralized message storage, and no fake online-user counts or manipulative dark patterns. Conversations, profiles, and saved contacts live locally on your device by default — Telepathy only reaches out to the network when it actually needs to find you a peer or carry your call.

**Use it to:**
- Have a **random conversation** with someone new
- Meet people who share your **interests** — technology, AI, books, travel, philosophy, and more
- Find a **language exchange partner** to practice speaking with
- **Teach something, learn something** — a knowledge and skills exchange, not just small talk
- **Brainstorm an idea** or work through a problem with someone else who's interested
- Join a focused **topic room**, or create a **private, invite-only room** for someone you already know

## Table of contents

- [Why Telepathy is different](#why-telepathy-is-different)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Privacy & safety](#privacy--safety)
- [SEO & AI discoverability](#seo--ai-discoverability)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Why Telepathy is different

| | Typical stranger-chat sites | Telepathy |
|---|---|---|
| Camera / mic | Often requested immediately | Never enabled without an explicit action |
| Identity | Sometimes requires phone/email | No real name, phone, or email required |
| Matching | Pure random roulette | Random, interest, language, or knowledge-exchange modes |
| Data | Centrally logged | Local-first; conversations stay on your device by default |
| Online counts | Often fabricated | Never faked — only real, available data is shown |
| Architecture | Server-routed media | Direct peer-to-peer WebRTC, server only for rendezvous |
| Failure handling | Generic "Something went wrong" | Explicit detect → explain → retry → fallback → guide flow |

## Features

**Live today (Phase 1 — Foundation, Phase 2 — Profile):**
- Responsive application shell — desktop sidebar, mobile bottom navigation, adaptive from 320px to 4K
- Full dark / light / system theming, respecting `prefers-reduced-motion` and `prefers-color-scheme`
- Aurora gradient backdrops, an animated connection-themed hero graphic, and staggered entrance/hover motion — all disabled automatically under `prefers-reduced-motion`
- Command palette (<kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd>) for fast navigation
- An 8-step profile onboarding wizard (name, avatar, languages, interests, intent, conversation style, privacy, preview) with a **Conversation Passport** identity card that respects per-field visibility toggles
- Local-first storage on IndexedDB (Dexie) — profile, saved people, conversations, and ideas persist on-device
- Real, working Settings: theme control, live storage-usage inspector, one-click local data reset, profile editing
- A professional design-system component library (buttons, dialogs, toasts, chips, avatars, empty states, and more) built on outline icons, not emoji
- Installable PWA groundwork — manifest, icons, and offline-safe shell

**Designed and scaffolded, shipping in upcoming phases** (see [Roadmap](#roadmap)):
- Discovery filters · Real-time chat · WebRTC calling with audio/video fallback · Private & topic rooms with QR/invite links · Idea whiteboard & code sharing · Chunked P2P file transfer · Block/report/privacy center · Connection diagnostics · Full offline PWA · i18n (English, Hindi, and more)

Every unfinished feature says so honestly in the UI — Telepathy never simulates a fake "connecting…" animation or a matching flow that isn't actually wired up.

## Tech stack

- **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)** (strict mode)
- **[Vite](https://vite.dev/)** for the dev server and production build
- **[Tailwind CSS v4](https://tailwindcss.com/)** via `@tailwindcss/vite`, with a token-based design system (CSS custom properties, dark/light themes)
- **[React Router](https://reactrouter.com/)** for client-side routing
- **[Dexie.js](https://dexie.org/)** + `dexie-react-hooks` over IndexedDB for local-first, reactive persistence
- **[lucide-react](https://lucide.dev/)** for a single, consistent outline-icon system
- **WebRTC** (planned, Phase 5) for peer-to-peer text, audio, video, and file transfer, behind a replaceable signaling adapter

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- npm (bundled with Node)

### Install & run

```bash
git clone https://github.com/prashantkeshr/TELEPATHY.git
cd TELEPATHY
npm install
npm run dev
```

The app runs at `http://localhost:5173` (or `5178` if you use the bundled `TELEPATHY.bat` launcher on Windows, which also offers install/build/type-check/open-in-editor menu options).

### Other scripts

```bash
npm run build      # Type-check and build for production into dist/
npm run preview    # Preview the production build locally
npm run lint        # Lint with oxlint
```

## Project structure

```
telepathy/
├── public/                  # Static assets, manifest, robots.txt, sitemap.xml, llms.txt
├── src/
│   ├── app/                 # Router configuration
│   ├── components/ui/       # Design-system primitives (Button, Dialog, Toast, Avatar, …)
│   ├── features/            # One folder per product area (home, discovery, rooms, ideas, …)
│   ├── layouts/              # AppShell, Sidebar, mobile chrome, navigation config
│   ├── services/
│   │   ├── storage/          # Dexie (IndexedDB) schema and database instance
│   │   └── theme/            # Theme provider (dark/light/system)
│   ├── utils/                 # Small shared helpers
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css              # Design tokens and global styles
├── index.html                 # SEO meta tags, Open Graph/Twitter cards, JSON-LD
├── TELEPATHY.bat               # Windows dev/build/type-check launcher
└── package.json
```

As later phases land (WebRTC, signaling, rooms, safety, diagnostics), each gets its own folder under `src/services/` and `src/features/`, following the same modular, adapter-based pattern already in place for storage and theming.

## Architecture

Telepathy is **frontend-first**: the core app — profile, settings, ideas, notes, and local history — works entirely client-side with no backend, and runs as a normal website, an installable PWA, or a packaged desktop/mobile shell around the same code.

Meeting a stranger, however, honestly requires a small amount of infrastructure: two peers need a way to find each other before they can connect directly. Telepathy separates this clearly into two concerns:

- **Signaling** — a minimal, replaceable adapter whose only job is rendezvous (helping two peers discover each other and exchange WebRTC negotiation data). It never carries the actual conversation.
- **Communication** — once two peers are matched, text, audio, video, and file transfer flow **directly between them** over WebRTC, not through a central server.

Every provider (signaling, WebRTC, storage, moderation, AI, identity) is designed behind a swappable interface so a future backend — authentication, cloud sync, global matching, an SFU for group calls — can be added without rewriting the frontend.

## Privacy & safety

- No real name, phone number, or exact location required to use Telepathy
- Camera and microphone are **never** enabled automatically
- Profile data and conversation history are stored **locally on your device** by default
- No fake online-user counts, fake verification badges, or manipulative urgency prompts
- Every conversation has Block / Report / Mute / Leave available at all times
- An Incognito mode (planned) leaves no local trace beyond the active session

## SEO & AI discoverability

This repo ships with the groundwork to be findable by both traditional search engines and AI answer engines:

- **`index.html`** — descriptive `<title>`, meta description, keyword-rich content, canonical URL, Open Graph and Twitter Card tags, and `WebApplication` JSON-LD structured data
- **`public/robots.txt`** — allows general crawlers plus known AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and others) so Telepathy can be cited in AI-generated answers
- **`public/sitemap.xml`** — lists all current routes for search-engine indexing
- **`public/llms.txt`** — a concise, structured summary of the product following the [llms.txt convention](https://llmstxt.org/), so AI assistants summarize and cite Telepathy accurately
- **`public/og-image.svg`** — a branded social-share preview image

To get full value from these once `telepathy.dhurta.com` is live: submit `sitemap.xml` to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters), and set your GitHub repo's **About → Description and Topics** (e.g. `webrtc`, `p2p`, `react`, `chat-app`, `video-chat`, `pwa`) — those fields drive GitHub's own search and topic pages independently of this README.

## Roadmap

Telepathy is built in 12 phases. Status:

- [x] **Phase 1 — Foundation:** project setup, routing, design system, responsive shell, theming, icons, typography
- [x] **Phase 2 — Profile:** onboarding flow, Conversation Passport, IndexedDB profile persistence, privacy controls
- [ ] **Phase 3 — Discovery:** matching UI, interests, topics, language exchange, random-mode architecture
- [ ] **Phase 4 — Chat:** chat UI, local messages, connection state, conversation tools
- [ ] **Phase 5 — WebRTC:** peer connection abstraction, data channels, audio, video, reconnection
- [ ] **Phase 6 — Rooms:** private rooms, room codes, invitation links, QR
- [ ] **Phase 7 — Knowledge Exchange:** ideas, notes, whiteboard, lightweight code sharing
- [ ] **Phase 8 — File Transfer:** chunking, progress, retry, integrity verification
- [ ] **Phase 9 — Safety:** block, report, mute, privacy center
- [ ] **Phase 10 — Diagnostics:** troubleshooting, capability detection, advanced diagnostics
- [ ] **Phase 11 — PWA:** service worker, offline shell, installation, update handling
- [ ] **Phase 12 — Optimization:** performance, accessibility, responsive testing, browser compatibility, production build

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you'd like to change.

```bash
git checkout -b feature/your-feature
# make your changes
npm run build   # must pass type-check + build before opening a PR
```

## License

No license has been chosen for this project yet — until one is added, all rights are reserved by default and others may not reuse this code. If you intend to open-source Telepathy, add a `LICENSE` file (e.g. [MIT](https://choosealicense.com/licenses/mit/) is a common permissive choice) and update `package.json`'s `license` field and the badge at the top of this README to match.

---

<div align="center">

Built with a privacy-first, frontend-first philosophy. Not affiliated with Omegle, Chatroulette, or any other platform.

</div>
