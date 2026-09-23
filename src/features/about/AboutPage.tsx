import { Link } from "react-router-dom";
import { ShieldCheck, Network, Database, MessagesSquare } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { FAQ } from "@/seo/routes";

const pillars = [
  {
    icon: Network,
    title: "Direct, peer-to-peer",
    body: "Conversations travel straight between two browsers over WebRTC. Telepathy runs no server that receives your messages, calls, or files.",
  },
  {
    icon: Database,
    title: "Local-first",
    body: "Your profile, saved people, and conversation history live in your browser's own storage. You can export or delete them at any time.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "No account, real name, phone number, or exact location. Camera and microphone are never requested until you press a call button.",
  },
  {
    icon: MessagesSquare,
    title: "Built for real conversation",
    body: "Match on shared interests, language practice, or knowledge exchange, and get locally generated conversation starters — no manipulative prompts, no fake online counts.",
  },
];

export function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About Telepathy"
        description="A privacy-first platform for meeting new people and having conversations worth having."
      />
      <article className="mx-auto max-w-3xl space-y-10 px-5 py-8 sm:px-8">
        <section aria-labelledby="what">
          <h2 id="what" className="mb-2 text-lg font-semibold text-text-primary">
            What is Telepathy?
          </h2>
          <p className="text-[15px] leading-relaxed text-text-secondary">
            Telepathy is a stranger-chat and social-discovery platform built around one idea: the best
            way to meet someone new isn't a random video roulette — it's a conversation that starts
            from something you actually have in common. You can talk by text, voice, or video, practice
            a language, teach or learn something, or brainstorm an idea, all over direct peer-to-peer
            connections.
          </p>
        </section>

        <section aria-labelledby="principles">
          <h2 id="principles" className="mb-4 text-lg font-semibold text-text-primary">
            How it's different
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {pillars.map((p) => (
              <li key={p.title} className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
                <p.icon className="mb-2 size-5 text-accent" />
                <h3 className="text-sm font-semibold text-text-primary">{p.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how">
          <h2 id="how" className="mb-2 text-lg font-semibold text-text-primary">
            How a connection works
          </h2>
          <ol className="list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-text-secondary">
            <li>Create a profile on your device — pick a nickname, interests, and what you're here for.</li>
            <li>Create a private room to generate a one-time connection code.</li>
            <li>Share the code with the other person through any channel you trust.</li>
            <li>They send a response code back; enter it and a direct WebRTC connection opens.</li>
            <li>Chat, or start a voice or video call from the same conversation.</li>
          </ol>
          <p className="mt-3 text-[13px] text-text-tertiary">
            <Link to="/rooms" className="text-accent underline underline-offset-2">
              Try a private room
            </Link>{" "}
            or{" "}
            <Link to="/discover" className="text-accent underline underline-offset-2">
              explore discovery filters
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="faq">
          <h2 id="faq" className="mb-4 text-lg font-semibold text-text-primary">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border">
            {FAQ.map((item) => (
              <details key={item.q} className="group px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-medium text-text-primary marker:hidden">
                  {item.q}
                </summary>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
