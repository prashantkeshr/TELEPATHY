/**
 * The single source of truth for connection state (spec §27). No transport
 * code (WebRTC, signaling — Phase 5) exists yet, but the state machine is
 * defined now so the chat UI and the future transport layer agree on it from
 * day one, and so UI state can never legitimately drift from connection
 * state: the UI only ever renders what's in here, never a parallel guess.
 */
export type ConnectionState =
  | "idle"
  | "searching"
  | "matched"
  | "connecting"
  | "negotiating"
  | "connected"
  | "degraded"
  | "reconnecting"
  | "failed"
  | "fallback"
  | "closed";

export type ConnectionEvent =
  | "start_search"
  | "peer_found"
  | "begin_connecting"
  | "begin_negotiating"
  | "connection_established"
  | "quality_degraded"
  | "quality_recovered"
  | "connection_lost"
  | "reconnect_succeeded"
  | "reconnect_failed"
  | "fall_back"
  | "close"
  | "reset";

const transitions: Record<ConnectionState, Partial<Record<ConnectionEvent, ConnectionState>>> = {
  // Mode B (random matching) goes idle -> searching -> matched. Mode A
  // (manual/room code exchange) has no search phase — the peer is already
  // known the moment a code is entered — so idle also accepts peer_found
  // directly.
  idle: { start_search: "searching", peer_found: "matched" },
  searching: { peer_found: "matched", close: "idle" },
  matched: { begin_connecting: "connecting", close: "idle" },
  connecting: { begin_negotiating: "negotiating", connection_lost: "failed", close: "idle" },
  negotiating: { connection_established: "connected", connection_lost: "failed", close: "idle" },
  connected: {
    quality_degraded: "degraded",
    connection_lost: "reconnecting",
    close: "closed",
  },
  degraded: {
    quality_recovered: "connected",
    connection_lost: "reconnecting",
    close: "closed",
  },
  reconnecting: {
    reconnect_succeeded: "connected",
    reconnect_failed: "failed",
    close: "closed",
  },
  failed: { fall_back: "fallback", reset: "idle", close: "closed" },
  fallback: { close: "closed", reset: "idle" },
  closed: { reset: "idle" },
};

/** Pure transition function — given a state and event, returns the next
 * state, or the same state unchanged if that event isn't valid right now. */
export function nextConnectionState(current: ConnectionState, event: ConnectionEvent): ConnectionState {
  return transitions[current][event] ?? current;
}

export const connectionStateLabels: Record<ConnectionState, string> = {
  idle: "Idle",
  searching: "Searching",
  matched: "Matched",
  connecting: "Connecting",
  negotiating: "Negotiating",
  connected: "Connected",
  degraded: "Unstable",
  reconnecting: "Reconnecting",
  failed: "Failed",
  fallback: "Fallback",
  closed: "Closed",
};
