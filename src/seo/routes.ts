/**
 * Single source of truth for per-route SEO metadata. Imported by the React
 * runtime (useSeo), and by scripts/postbuild-seo.mjs to prerender static HTML
 * and generate sitemap.xml — so they can never drift apart. Keep this file
 * dependency-free (plain TS, no path aliases) so Node can import it directly.
 */
export const SITE_URL = "https://telepathy.dhurta.com";
export const SITE_NAME = "Telepathy";

export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  /** Private/local-only screens: no value in search results, so noindex and keep out of the sitemap. */
  noindex?: boolean;
  priority?: number;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
}

export const ROUTES: RouteSeo[] = [
  {
    path: "/",
    title: "Telepathy — Meet New People, Peer-to-Peer & Private",
    description:
      "Meet new people by shared interests or language exchange. Chat by text, voice, or video, peer-to-peer. No account; camera and mic stay off until you choose.",
    priority: 1.0,
    changefreq: "weekly",
  },
  {
    path: "/about",
    title: "About Telepathy — How Private Peer-to-Peer Conversations Work",
    description:
      "How Telepathy works: serverless WebRTC, local-first storage, no accounts, private by default. FAQ on safety, data, calls, and language exchange.",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/discover",
    title: "Discover People by Interest, Language & Intent | Telepathy",
    description:
      "Choose how you want to meet someone new: by shared interests, language practice, knowledge exchange, friendship, or ideas. Filters stay on your device.",
    priority: 0.8,
    changefreq: "weekly",
  },
  {
    path: "/rooms",
    title: "Private Rooms — Invite Someone Directly, Peer-to-Peer | Telepathy",
    description:
      "Create a private room and connect one-to-one over WebRTC using a one-time code you share yourselves. No server relays your messages, no account required.",
    priority: 0.8,
    changefreq: "monthly",
  },
  { path: "/discover/random", title: "Random Conversation | Telepathy", description: "Start a random conversation with someone new.", noindex: true },
  { path: "/rooms/host", title: "Create a Private Room | Telepathy", description: "Create a private peer-to-peer room.", noindex: true },
  { path: "/rooms/join", title: "Join a Private Room | Telepathy", description: "Join a private peer-to-peer room with a code.", noindex: true },
  { path: "/chats", title: "Your Chats | Telepathy", description: "Your local conversations.", noindex: true },
  { path: "/friends", title: "Saved People | Telepathy", description: "People you've saved, stored on this device.", noindex: true },
  { path: "/ideas", title: "Ideas | Telepathy", description: "Your local idea workspace.", noindex: true },
  { path: "/settings", title: "Settings | Telepathy", description: "Telepathy settings, stored on this device.", noindex: true },
  { path: "/onboarding", title: "Create Your Telepathy Profile", description: "Set up your Telepathy profile. Stored on this device.", noindex: true },
];

export function findRoute(pathname: string): RouteSeo | undefined {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return ROUTES.find((r) => r.path === clean);
}

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Do I need an account to use Telepathy?",
    a: "No. There is no sign-up. Your profile is created on your device and stays there unless you choose otherwise. No email, phone number, or real name is required.",
  },
  {
    q: "Are my messages stored on a server?",
    a: "No. Conversations flow directly between the two browsers over WebRTC, and your history is stored locally in your browser (IndexedDB). Telepathy has no server that receives your messages.",
  },
  {
    q: "How do I connect with someone?",
    a: "Create a private room, which generates a one-time code. Share it with the other person through any channel you trust; they paste it in and send a response code back. Once you enter that, a direct peer-to-peer connection opens.",
  },
  {
    q: "Can I do video and voice calls?",
    a: "Yes. Once you're connected you can start a voice or video call. Your camera and microphone are never requested until you click the call button, and you can stay text-only.",
  },
  {
    q: "Does Telepathy match me with random strangers automatically?",
    a: "Not yet. Automatic matching between strangers needs a signaling server, which Telepathy deliberately does not run today. Private rooms work now; discovery filters are ready for when a signaling provider is added.",
  },
  {
    q: "Is it safe?",
    a: "You can block or report anyone from a conversation, and nothing is shared unless you choose. Telepathy is not intended for minors; only connect with people you are comfortable talking to, and never share sensitive personal information.",
  },
  {
    q: "What languages does it support?",
    a: "The interface is English today, with Hindi and more planned. You can list languages you speak and are learning on your profile to find language-exchange partners.",
  },
];
