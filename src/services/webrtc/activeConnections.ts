import type { WebRTCService } from "./WebRTCService";

/** Module-level registry so a live connection survives SPA navigation from
 * the room-creation flow into the conversation view. Deliberately not a
 * React context: this is transport state, not render state. */
const registry = new Map<string, WebRTCService>();

export function registerConnection(conversationId: string, service: WebRTCService) {
  registry.set(conversationId, service);
}

export function getConnection(conversationId: string): WebRTCService | undefined {
  return registry.get(conversationId);
}

export function removeConnection(conversationId: string) {
  const service = registry.get(conversationId);
  service?.close();
  registry.delete(conversationId);
}
