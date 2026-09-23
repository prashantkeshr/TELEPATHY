import { nextConnectionState, type ConnectionEvent, type ConnectionState } from "@/services/connection/connectionState";
import { encodeSignal, decodeSignal } from "./signal";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

const CONTROL_MARKER = "__telepathy_control__";

type ControlMessage =
  | { marker: typeof CONTROL_MARKER; kind: "sdp"; sdpType: "offer" | "answer"; description: RTCSessionDescriptionInit }
  | { marker: typeof CONTROL_MARKER; kind: "call-end" };

function isControlMessage(text: string): ControlMessage | null {
  try {
    const data = JSON.parse(text);
    if (data && data.marker === CONTROL_MARKER) return data as ControlMessage;
  } catch {
    // not JSON, or not ours — a normal application message
  }
  return null;
}

type MessageHandler = (text: string) => void;
type StateHandler = (state: ConnectionState) => void;
type StreamHandler = (stream: MediaStream) => void;
type VoidHandler = () => void;

/**
 * A provider-shaped wrapper around one RTCPeerConnection + one data channel
 * (spec §71/§72 — WebRTCService, swappable, no UI dependency on it). Uses
 * non-trickle ICE for the *initial* connection: it waits for ICE gathering
 * to finish, then serializes the complete local description into one
 * copy-pastable code — the whole signaling exchange for Mode A, no backend.
 *
 * Once that data channel is open, it doubles as the signaling path for
 * *renegotiation* (adding/removing audio/video tracks) — no second manual
 * code exchange is needed to start a call mid-conversation.
 *
 * Owns exactly one connection's lifecycle. In Mode A there's no persistent
 * signaling channel outside this one, so "reconnecting" here means
 * accurately detecting and reporting loss, not silently re-establishing —
 * recovering a fully dropped connection needs a fresh code exchange.
 */
export class WebRTCService {
  private pc: RTCPeerConnection;
  private channel: RTCDataChannel | null = null;
  private _state: ConnectionState = "idle";
  private localStream: MediaStream | null = null;
  private messageHandlers = new Set<MessageHandler>();
  private stateHandlers = new Set<StateHandler>();
  private openHandlers = new Set<VoidHandler>();
  private remoteStreamHandlers = new Set<StreamHandler>();
  private callEndHandlers = new Set<VoidHandler>();
  /** Messages that arrive before anything is listening yet — e.g. in the
   * gap between a room-creation flow completing and the chat view mounting
   * and subscribing — are queued here rather than dropped. */
  private pendingMessages: string[] = [];
  private negotiating = false;

  constructor() {
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    this.pc.onconnectionstatechange = () => this.handlePcState();
    this.pc.ontrack = (e) => {
      if (e.streams[0]) this.remoteStreamHandlers.forEach((h) => h(e.streams[0]));
    };
    this.pc.onnegotiationneeded = () => {
      this.renegotiate().catch(() => {
        // The peer may not be ready yet (e.g. initial connection still
        // mid-handshake) — the next onnegotiationneeded, if any, retries.
      });
    };
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

  onRemoteStream(handler: StreamHandler) {
    this.remoteStreamHandlers.add(handler);
    return () => this.remoteStreamHandlers.delete(handler);
  }

  onCallEnd(handler: VoidHandler) {
    this.callEndHandlers.add(handler);
    return () => this.callEndHandlers.delete(handler);
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
      const control = isControlMessage(e.data);
      if (control) {
        this.handleControlMessage(control);
        return;
      }
      if (this.messageHandlers.size === 0) this.pendingMessages.push(e.data);
      else this.messageHandlers.forEach((h) => h(e.data));
    };
    channel.onopen = () => this.openHandlers.forEach((h) => h());
  }

  private sendControl(message: ControlMessage) {
    if (this.channel?.readyState === "open") this.channel.send(JSON.stringify(message));
  }

  private async handleControlMessage(message: ControlMessage) {
    if (message.kind === "call-end") {
      // Clean up our own media too (if any) but do NOT send another
      // call-end back — that would ping-pong the message forever.
      this.cleanupLocalMedia();
      this.callEndHandlers.forEach((h) => h());
      return;
    }
    if (message.kind === "sdp") {
      if (message.sdpType === "offer") {
        await this.pc.setRemoteDescription(message.description);
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        await this.waitForIceGatheringComplete();
        this.sendControl({ marker: CONTROL_MARKER, kind: "sdp", sdpType: "answer", description: this.pc.localDescription! });
      } else {
        await this.pc.setRemoteDescription(message.description);
      }
    }
  }

  /** Fires on pc.onnegotiationneeded (e.g. after addTrack/removeTrack) once
   * the data channel is already open — renegotiates by sending a fresh
   * offer over that same channel instead of a second manual code exchange. */
  private async renegotiate() {
    if (this.negotiating || this.channel?.readyState !== "open") return;
    this.negotiating = true;
    try {
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      await this.waitForIceGatheringComplete();
      this.sendControl({ marker: CONTROL_MARKER, kind: "sdp", sdpType: "offer", description: this.pc.localDescription! });
    } finally {
      this.negotiating = false;
    }
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

  /** Adds every track in `stream` to the connection — the caller is
   * responsible for obtaining the stream (getUserMedia) behind an explicit
   * user action; this class never touches camera/mic permissions itself. */
  addMedia(stream: MediaStream) {
    this.localStream = stream;
    stream.getTracks().forEach((track) => this.pc.addTrack(track, stream));
  }

  setTrackEnabled(kind: "audio" | "video", enabled: boolean) {
    this.localStream?.getTracks().filter((t) => t.kind === kind).forEach((t) => (t.enabled = enabled));
  }

  private cleanupLocalMedia() {
    if (!this.localStream) return;
    this.localStream.getTracks().forEach((track) => track.stop());
    this.pc.getSenders().forEach((sender) => {
      if (sender.track) this.pc.removeTrack(sender);
    });
    this.localStream = null;
  }

  /** User-initiated hangup (or decline): stops and removes our own media —
   * this alone renegotiates so the peer's view of us updates — and tells
   * them explicitly the call ended, whether or not we'd added our own
   * media yet (declining an incoming call still needs to notify them). */
  endCall() {
    this.cleanupLocalMedia();
    this.sendControl({ marker: CONTROL_MARKER, kind: "call-end" });
  }

  close() {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.channel?.close();
    this.pc.close();
    this.setState("close");
  }
}
