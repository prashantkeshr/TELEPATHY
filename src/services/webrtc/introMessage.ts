const MARKER = "__telepathy_intro__";

export interface IntroMessage {
  marker: typeof MARKER;
  displayName: string;
  interests: string[];
  avatarDataUrl?: string;
}

export function buildIntroMessage(displayName: string, interests: string[], avatarDataUrl?: string): string {
  const payload: IntroMessage = { marker: MARKER, displayName: displayName || "Someone new", interests, avatarDataUrl };
  return JSON.stringify(payload);
}

/** Returns the parsed intro if `text` is one, otherwise null — lets the
 * receiver tell a handshake message apart from a normal chat message
 * without guessing based on content. */
export function parseIntroMessage(text: string): IntroMessage | null {
  try {
    const data = JSON.parse(text);
    if (data && data.marker === MARKER && typeof data.displayName === "string") {
      return data as IntroMessage;
    }
  } catch {
    // not JSON, or not ours — it's a normal chat message
  }
  return null;
}
