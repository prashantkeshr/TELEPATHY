import { nextConnectionState, type ConnectionEvent, type ConnectionState } from "@/services/connection/connectionState";
import { encodeSignal, decodeSignal } from "./signal";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

type MessageHandler = (text: string) => void;
type StateHandler = (state: ConnectionState) => void;
type VoidHandler = () => void;

/**
 * A provider-shaped wrapper around one RTCPeerConnection + one data channel
 * (spec §71/§72 — WebRTCService, swappable, no UI dependency on it). Uses
 * non-trickle ICE: it waits for ICE gathering to finish, then serializes the
 * complete local description into one copy-pastable code — the whole
 * signaling exchange for Mode A, no backend involved.
 *
 * Owns exactly one connection's lifecycle. In Mode A there's no persistent
 * signaling channel to renegotiate over, so "reconnecting" here means
 * accurately detecting and reporting loss, not silently re-establishing —
 * recovering a dropped connection needs a fresh code exchange.
 */
export class WebRTCService {
  private pc: RTCPeerConnection;
  private channel: RTCDataChannel | null = null;
  private _state: ConnectionState = "idle";
  private messageHandlers = new Set<MessageHandler>();
  private stateHandlers = new Set<StateHandler>();
  private openHandlers = new Set<VoidHandler>();
  /** Messages that arrive before anything is listening yet — e.g. in the
   * gap between a room-creation flow completing and the chat view mounting
   * and subscribing — are queued here rather than dropped. */
  private pendingMessages: string[] = [];

  constructor() {
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    this.pc.onconnectionstatechange = () => this.handlePcState();
  }

  get state() {
    return this._state;
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    if (this.pendingMessages.length) {
      const queued = this.pendingMessages;
      this.pendingMessages = [];
      queued.forEach((text) => handler(text));
    }
    return () => this.messageHandlers.delete(handler);
  }

  onStateChange(handler: StateHandler) {
    this.stateHandlers.add(handler);
    return () => this.stateHandlers.delete(handler);
  }

  onOpen(handler: VoidHandler) {
    this.openHandlers.add(handler);
    return () => this.openHandlers.delete(handler);
  }

  private setState(event: ConnectionEvent) {
    const next = nextConnectionState(this._state, event);
    if (next !== this._state) {
      this._state = next;
      this.stateHandlers.forEach((h) => h(next));
    }
  }

  private handlePcState() {
    const cs = this.pc.connectionState;
    if (cs === "connected") this.setState("connection_established");
    else if (cs === "disconnected") this.setState("connection_lost");
    else if (cs === "failed") this.setState(this._state === "reconnecting" ? "reconnect_failed" : "connection_lost");
    else if (cs === "closed") this.setState("close");
  }

  private wireChannel(channel: RTCDataChannel) {
    this.channel = channel;
    channel.onmessage = (e) => {
      if (this.messageHandlers.size === 0) this.pendingMessages.push(e.data);
      else this.messageHandlers.forEach((h) => h(e.data));
    };
    channel.onopen = () => this.openHandlers.forEach((h) => h());
  }

  private waitForIceGatheringComplete(): Promise<void> {
    if (this.pc.iceGatheringState === "complete") return Promise.resolve();
    return new Promise((resolve) => {
      const check = () => {
        if (this.pc.iceGatheringState === "complete") {
          this.pc.removeEventListener("icegatheringstatechange", check);
          resolve();
        }
      };
      this.pc.addEventListener("icegatheringstatechange", check);
      setTimeout(resolve, 8000); // don't block forever if a network can't reach STUN
    });
  }

  /** Host side: create the data channel + offer, return a code to share. */
  async createOffer(): Promise<string> {
    this.setState("peer_found");
    this.wireChannel(this.pc.createDataChannel("telepathy"));
    this.setState("begin_connecting");
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    this.setState("begin_negotiating");
    await this.waitForIceGatheringComplete();
    return encodeSignal({ type: "offer", description: this.pc.localDescription! });
  }

  /** Joiner side: accept a host's offer code, return an answer code to send back. */
  async createAnswer(offerCode: string): Promise<string> {
    const payload = decodeSignal(offerCode);
    if (payload.type !== "offer") throw new Error("That's an answer code — you need the host's offer code instead.");
    this.setState("peer_found");
    this.pc.ondatachannel = (e) => this.wireChannel(e.channel);
    this.setState("begin_connecting");
    await this.pc.setRemoteDescription(payload.description);
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    this.setState("begin_negotiating");
    await this.waitForIceGatheringComplete();
    return encodeSignal({ type: "answer", description: this.pc.localDescription! });
  }

  /** Host side: complete the handshake with the joiner's answer code. */
  async acceptAnswer(answerCode: string): Promise<void> {
    const payload = decodeSignal(answerCode);
    if (payload.type !== "answer") throw new Error("That's an offer code — you need the other person's answer code instead.");
    await this.pc.setRemoteDescription(payload.description);
  }

  send(text: string) {
    if (this.channel?.readyState === "open") this.channel.send(text);
  }

  close() {
    this.channel?.close();
    this.pc.close();
    this.setState("close");
  }
}
