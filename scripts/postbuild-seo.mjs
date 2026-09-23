// Post-build SEO step: prerenders per-route static HTML from dist/index.html
// and generates sitemap.xml, all from src/seo/routes.ts (the single source of
// truth). Runs after `vite build`. Fails loudly if the template no longer
// contains a tag we expect to rewrite, so SEO can't silently rot.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { ROUTES, FAQ, SITE_URL, SITE_NAME } from "../src/seo/routes.ts";

const DIST = join(import.meta.dirname, "..", "dist");
const template = readFileSync(join(DIST, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const urlFor = (path) => (path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`);

function swap(html, re, replacement, label) {
  if (!re.test(html)) throw new Error(`postbuild-seo: template missing expected tag: ${label}`);
  return html.replace(re, replacement);
}

const H1 = { "/": "Meet someone new. Find something in common." };
const indexable = ROUTES.filter((r) => !r.noindex);

function jsonLd(route) {
  const url = urlFor(route.path);
  const graph = [];
  if (route.path === "/") {
    graph.push(
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: route.description,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon-512.png`,
        sameAs: ["https://github.com/prashantkeshr/TELEPATHY"],
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: route.description,
        applicationCategory: "SocialNetworkingApplication",
        operatingSystem: "Any (Web, installable PWA)",
        browserRequirements: "Requires a modern browser with WebRTC support",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        image: `${SITE_URL}/og-image.png`,
        featureList: [
          "Interest, language, and intent-based discovery",
          "Peer-to-peer text chat over WebRTC",
          "Voice and video calls",
          "Private one-to-one rooms with no account",
          "Local-first storage in your browser",
          "Installable Progressive Web App",
        ],
      },
    );
  } else {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: route.title.split(/ [|—] /)[0], item: url },
      ],
    });
  }
  if (route.path === "/about") {
    graph.push({
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
}

function noscriptBody(route) {
  const h1 = H1[route.path] ?? route.title.split(/ [|—] /)[0];
  const links = indexable.map((r) => `<li><a href="${r.path}">${esc(r.title.split(/ [|—] /)[0])}</a></li>`).join("");
  const faq =
    route.path === "/about"
      ? `<h2>Frequently asked questions</h2>${FAQ.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}`
      : "";
  return `<noscript><main style="font-family:system-ui,sans-serif;max-width:40rem;margin:2rem auto;padding:0 1rem;line-height:1.6"><h1>${esc(h1)}</h1><p>${esc(route.description)}</p><p>Telepathy needs JavaScript and WebRTC to connect you with other people directly in your browser. It has no accounts and no message servers.</p>${faq}<nav aria-label="Telepathy pages"><ul>${links}</ul></nav></main></noscript>`;
}

function render(route, { canonical = true, title = route.title, robots } = {}) {
  let html = template;
  const url = urlFor(route.path);
  const robotsValue = robots ?? (route.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");

  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`, "title");
  html = swap(html, /<meta name="title"[^>]*>/, `<meta name="title" content="${esc(title)}" />`, "meta title");
  html = swap(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(route.description)}" />`, "meta description");
  html = swap(html, /<meta name="robots"[^>]*>/, `<meta name="robots" content="${robotsValue}" />`, "meta robots");
  html = swap(html, /<link rel="canonical"[^>]*>/, canonical ? `<link rel="canonical" href="${url}" />\n    <link rel="alternate" hreflang="en" href="${url}" />\n    <link rel="alternate" hreflang="x-default" href="${url}" />` : "", "canonical");
  html = swap(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`, "og:title");
  html = swap(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(route.description)}" />`, "og:description");
  html = swap(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`, "og:url");
  html = swap(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(title)}" />`, "twitter:title");
  html = swap(html, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(route.description)}" />`, "twitter:description");
  html = swap(html, /<meta name="twitter:url"[^>]*>/, `<meta name="twitter:url" content="${url}" />`, "twitter:url");
  html = swap(html, /<!--SEO_JSONLD-->/, route.noindex ? "" : jsonLd(route), "JSON-LD marker");
  html = swap(html, /<div id="root"><\/div>/, `<div id="root"></div>\n    ${noscriptBody(route)}`, "root div");
  return html;
}

// Top-level routes are written as <name>.html, not <name>/index.html: GitHub
// Pages serves about.html at /about with no redirect, whereas a directory
// index would 301 /about -> /about/ and disagree with our canonical/sitemap
// URLs. Nested private routes (/rooms/host, ...) aren't prerendered — they're
// noindex and fall through to 404.html, which boots the SPA.
for (const route of ROUTES) {
  if (route.path === "/") {
    writeFileSync(join(DIST, "index.html"), render(route));
  } else if (route.path.split("/").filter(Boolean).length === 1) {
    writeFileSync(join(DIST, `${route.path.slice(1)}.html`), render(route));
  }
}

// 404.html: served by GitHub Pages (with a real 404 status) for any unknown
// URL. The SPA still boots from it so client-side routes like /chats/:id
// work on refresh, but it must never be indexed or claim a canonical.
writeFileSync(
  join(DIST, "404.html"),
  render({ path: "/404", title: "Page not found | Telepathy", description: "This page doesn't exist.", noindex: true }, { canonical: false }),
);

// sitemap.xml — indexable routes only. lastmod is the last commit date, not
// "today", so it only changes when the site actually does.
let lastmod = new Date().toISOString().slice(0, 10);
try {
  lastmod = execSync("git log -1 --format=%cs", { cwd: join(DIST, "..") }).toString().trim() || lastmod;
} catch {
  // not a git checkout — fall back to build date
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map(
    (r) => `  <url>
    <loc>${urlFor(r.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq ?? "monthly"}</changefreq>
    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap);

if (!existsSync(join(DIST, "sitemap.xml"))) throw new Error("sitemap.xml was not written");
console.log(`postbuild-seo: prerendered top-level routes + 404.html, sitemap.xml with ${indexable.length} URLs (lastmod ${lastmod})`);
