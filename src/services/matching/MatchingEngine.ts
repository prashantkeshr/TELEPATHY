/**
 * Provider-independent matching logic (spec §65). Deliberately has no
 * knowledge of WebRTC, signaling, or any specific transport — it only scores
 * compatibility between two sets of criteria. A future signaling/matching
 * provider calls into this; the UI never computes compatibility itself.
 *
 * There is no live peer pool yet (that needs the Phase 5 signaling adapter),
 * so today this only powers self-contained, honest local features: showing a
 * user what criteria their own search will use, and generating conversation
 * topic suggestions from a single profile. It never fabricates a match.
 */

export interface MatchCriteria {
  interests: string[];
  languages: string[];
  intents: string[];
  conversationStyle: string[];
}

export interface CompatibilityResult {
  score: number;
  sharedInterests: string[];
  sharedLanguages: string[];
  sharedIntents: string[];
  sharedStyle: string[];
}

function intersect(a: string[], b: string[]): string[] {
  const setB = new Set(b.map((x) => x.toLowerCase()));
  return a.filter((x) => setB.has(x.toLowerCase()));
}

/** Pure compatibility scoring between two criteria sets. No side effects, no I/O. */
export function computeCompatibility(a: MatchCriteria, b: MatchCriteria): CompatibilityResult {
  const sharedInterests = intersect(a.interests, b.interests);
  const sharedLanguages = intersect(a.languages, b.languages);
  const sharedIntents = intersect(a.intents, b.intents);
  const sharedStyle = intersect(a.conversationStyle, b.conversationStyle);

  const score =
    sharedInterests.length * 3 + sharedLanguages.length * 2 + sharedIntents.length * 2 + sharedStyle.length * 1;

  return { score, sharedInterests, sharedLanguages, sharedIntents, sharedStyle };
}

export interface DiscoveryFilters {
  mode: string;
  interests: string[];
  language: string | null;
  intents: string[];
  conversationStyle: string[];
}

export function filtersToCriteria(filters: DiscoveryFilters): MatchCriteria {
  return {
    interests: filters.interests,
    languages: filters.language ? [filters.language] : [],
    intents: filters.intents,
    conversationStyle: filters.conversationStyle,
  };
}
