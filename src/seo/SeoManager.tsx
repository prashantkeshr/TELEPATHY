import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { findRoute, SITE_URL, ROUTES } from "./routes";

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Keeps document metadata correct across client-side navigation, so shared
 * links, browser history, tab titles, and JS-rendering crawlers all see
 * route-specific values instead of the homepage's. The prerendered HTML
 * (scripts/postbuild-seo.mjs) covers crawlers that don't run JS. */
export function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const known = !!findRoute(pathname);
    // Dynamic/unknown paths (e.g. /chats/:id, 404s) are private or nonexistent: generic title, noindex.
    const route = findRoute(pathname) ?? { ...ROUTES[0], title: "Telepathy", path: pathname };
    const url = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;

    document.title = route.title;
    setMeta('meta[name="description"]', "name", "description", route.description);
    setMeta('meta[name="title"]', "name", "title", route.title);
    setMeta('meta[name="robots"]', "name", "robots", route.noindex || !known ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setCanonical(url);
    setMeta('meta[property="og:title"]', "property", "og:title", route.title);
    setMeta('meta[property="og:description"]', "property", "og:description", route.description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", route.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", route.description);
    setMeta('meta[name="twitter:url"]', "name", "twitter:url", url);
  }, [pathname]);

  return <Outlet />;
}
