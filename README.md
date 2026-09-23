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

**Live today (Phases 1–4 complete, Phase 5 mostly complete):**
- Responsive application shell — desktop sidebar, mobile bottom navigation, adaptive from 320px to 4K
- Full dark / light / system theming, respecting `prefers-reduced-motion` and `prefers-color-scheme`
- Aurora gradient backdrops, an animated connection-themed hero graphic, and staggered entrance/hover motion — all disabled automatically under `prefers-reduced-motion`
- Command palette (<kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd>) for fast navigation
- An 8-step profile onboarding wizard (name, avatar, languages, interests, intent, conversation style, privacy, preview) with a **Conversation Passport** identity card that respects per-field visibility toggles
- Real discovery filters (interests, language, conversation intent) that carry through to the connection screen, backed by a provider-independent `MatchingEngine` compatibility scorer
- Locally-generated conversation-topic suggestions and starter questions — no AI, no network call, computed from your own profile
- A complete chat interface — message bubbles, reply, emoji reactions, code blocks, safe link rendering, in-conversation search, save/export/delete, block, and report — backed by a real local message store and a formal connection-state machine
- **Real, working peer-to-peer connections** — no signaling server exists (this is a static site), so Telepathy implements serverless "Mode A" WebRTC: create a private room, exchange a one-time code with someone through any channel you already trust, and talk over a genuine `RTCPeerConnection` data channel — verified with real two-way message delivery, not simulated
- **Audio/video calling** on top of that same connection — starting a call renegotiates through the already-open data channel (no second code exchange), with mic/camera mute, graceful fallback (camera denied → retry audio-only → clear error), and an explicit accept/decline prompt for incoming calls rather than auto-playing anyone's stream. Camera/mic are never requested until you click Call. *Caveat: verified end-to-end for the permission-denied/fallback path on real hardware; full two-device video/audio streaming hasn't been tested on real devices yet — try it yourself before relying on it for something important.*
- Local-first storage on IndexedDB (Dexie) — profile, saved people, conversations, messages, and ideas persist on-device
- Real, working Settings: theme control, live storage-usage inspector, one-click local data reset, profile editing
- A professional design-system component library (buttons, dialogs, toasts, chips, avatars, empty states, and more) built on outline icons, not emoji
- Installable PWA groundwork — manifest, icons, and offline-safe shell

**Designed and scaffolded, shipping in upcoming phases** (see [Roadmap](#roadmap)):
- Audio/video calling, TURN fallback for restrictive networks, and automatic reconnection (finishing Phase 5) · Automatic random matching (needs a signaling *server*, which Mode A intentionally doesn't require) · QR-code and shareable-link invites for rooms · Topic/group rooms (need a server-assisted SFU) · Idea whiteboard & code sharing · Chunked P2P file transfer · Full privacy center · Connection diagnostics · Full offline PWA · i18n (English, Hindi, and more)

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

- [Node.js](https://nodejs.org/) 22.18+ (the SEO post-build step imports TypeScript directly)
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

**How peer-to-peer connections work today:** this repo has no signaling server, so Telepathy implements the fully-serverless "Mode A" from the spec above: one person creates a private room, which generates a one-time connection code (a complete WebRTC offer, base64-encoded); they send it to the other person through any channel they already trust; the other person pastes it in, which generates a response code; once that's pasted back, a real `RTCPeerConnection` data channel opens directly between the two browsers — no message ever passes through a Telepathy server. This is genuinely how WebRTC's manual/copy-paste signaling pattern works, not a simulation. Automatic random matching (Discover → Random) still needs a signaling *server* for rendezvous, since strangers have no other channel to exchange codes through — that's `src/services/webrtc/` waiting for a `SignalingProvider` implementation.

## Privacy & safety

- No real name, phone number, or exact location required to use Telepathy
- Camera and microphone are **never** enabled automatically
- Profile data and conversation history are stored **locally on your device** by default
- No fake online-user counts, fake verification badges, or manipulative urgency prompts
- Every conversation has Block / Report / Mute / Leave available at all times
- An Incognito mode (planned) leaves no local trace beyond the active session

## SEO & AI discoverability

A React SPA ships an empty page to anything that doesn't run JavaScript, and every URL shares one `<title>` — the two biggest SEO problems for this kind of site. Telepathy addresses both at the source:

- **One route table, `src/seo/routes.ts`**, holds every route's title, description, and indexability. It's the single source of truth for everything below, so they can't drift apart.
- **Runtime (`SeoManager`)** updates the title, description, canonical, robots, Open Graph and Twitter tags on every client-side navigation.
- **Build-time prerender (`scripts/postbuild-seo.mjs`, runs as part of `npm run build`)** writes real static HTML for each public URL (`about.html` etc., served at `/about` by GitHub Pages with no redirect), with route-specific tags, JSON-LD, and crawler-readable `<noscript>` content — so non-JS crawlers, including most AI fetchers, see real content. It fails the build loudly if the template stops containing a tag it expects to rewrite.
- **Structured data (JSON-LD):** `WebSite` + `Organization` + `WebApplication` on the homepage, `BreadcrumbList` on inner pages, and `FAQPage` on `/about` (matching the visible FAQ).
- **`sitemap.xml`** is generated from the route table (indexable routes only; `lastmod` is the last commit date, not "today").
- **Private screens** (`/chats`, `/friends`, `/ideas`, `/settings`, `/onboarding`, room flows) are `noindex`. They use a meta tag rather than a `Disallow`, since a Disallow would stop crawlers from ever seeing the noindex. Informational pages stay reachable without a profile (`/`, `/about`, `/discover`, `/rooms`), because crawlers never have one.
- **`404.html`** is generated `noindex` with no canonical; GitHub Pages serves it with a real 404 status, and it boots the SPA so deep links still work on refresh.
- **`robots.txt`** welcomes search and AI assistant crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, and others) — edit it if you'd rather opt out of any of them.
- **`llms.txt` / `llms-full.txt`** give AI systems an accurate summary, including an explicit list of what does *not* work yet, so assistants don't overstate the product.
- `og-image.png` (1200×630 — most social platforms don't render SVG previews), `manifest.webmanifest` (with shortcuts), `/.well-known/security.txt`, and `humans.txt`.

**After it's live**, these are the steps only you can do: submit `https://telepathy.dhurta.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters) (verify the domain via a DNS TXT record at your registrar), use *URL Inspection → Request indexing* on the homepage and `/about`, and set the GitHub repo's About description and Topics (`webrtc`, `p2p`, `react`, `chat-app`, `video-chat`, `pwa`).

## Roadmap

Telepathy is built in 12 phases. Status:

- [x] **Phase 1 — Foundation:** project setup, routing, design system, responsive shell, theming, icons, typography
- [x] **Phase 2 — Profile:** onboarding flow, Conversation Passport, IndexedDB profile persistence, privacy controls
- [x] **Phase 3 — Discovery:** matching UI, interests, topics, language exchange, random-mode architecture
- [x] **Phase 4 — Chat:** chat UI, local messages, connection state, conversation tools
- [~] **Phase 5 — WebRTC:** peer connection abstraction ✅, data channels ✅ (real P2P text chat, manual signaling), audio/video ✅ code complete — call renegotiation, mic/camera mute, fallback on permission denial all verified working, but full device-to-device media *streaming* hasn't been tested on real hardware yet (only the failure/fallback path was verifiable in the dev sandbox — verify this before relying on it), reconnection (partial — loss is detected accurately; Mode A has no persistent signaling channel to auto-renegotiate over)
- [~] **Phase 6 — Rooms:** private rooms ✅, room codes ✅ (pulled forward as Phase 5's signaling mechanism), invitation links ⏳, QR ⏳, topic/group rooms ⏳ (need a server-assisted SFU)
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
