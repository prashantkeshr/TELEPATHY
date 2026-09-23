export interface SignalPayload {
  type: "offer" | "answer";
  description: RTCSessionDescriptionInit;
}

/** Encodes a full (post-ICE-gathering) session description into a single
 * copy-pastable code. No trickle ICE, no signaling server — this is the
 * entire "wire format" for Mode A manual peer connection (spec §6/§7). */
export function encodeSignal(payload: SignalPayload): string {
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeSignal(code: string): SignalPayload {
  try {
    const json = decodeURIComponent(escape(atob(code.trim())));
    const payload = JSON.parse(json) as Partial<SignalPayload>;
    if (!payload || (payload.type !== "offer" && payload.type !== "answer") || !payload.description) {
      throw new Error("bad shape");
    }
    return payload as SignalPayload;
  } catch {
    throw new Error("That code doesn't look valid — double-check you copied the whole thing.");
  }
}
