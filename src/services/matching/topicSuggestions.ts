import type { ProfileRecord } from "@/services/storage/db";

/** Locally generated from the user's own profile — interests, intents, and
 * languages — per spec §14/§23. No AI, no network call, no fabricated data. */
export function suggestTopics(profile: Pick<ProfileRecord, "interests" | "intents" | "languagesLearning">): string[] {
  const topics: string[] = [];
  const { interests, intents, languagesLearning } = profile;

  const wantsToTeach = intents.includes("Teach something");
  const wantsToLearn = intents.includes("Learn something");
  const wantsKnowledgeExchange = intents.includes("Knowledge exchange");
  const wantsBrainstorm = intents.includes("Brainstorm") || intents.includes("Work on ideas");

  for (const interest of interests) {
    if (wantsToTeach) topics.push(`Teach someone about ${interest}`);
    else if (wantsToLearn) topics.push(`Learn something new about ${interest}`);
    else if (wantsKnowledgeExchange) topics.push(`Exchange knowledge about ${interest}`);
    else if (wantsBrainstorm) topics.push(`Brainstorm an idea around ${interest}`);
    else topics.push(`Talk about ${interest}`);
  }

  for (const lang of languagesLearning) {
    topics.push(`Practice ${lang} with a fluent speaker`);
  }

  if (intents.includes("Completely random") || topics.length === 0) {
    topics.push("See where a completely random conversation goes");
  }

  return topics.slice(0, 6);
}
