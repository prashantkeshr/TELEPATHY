import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, DoorOpen, AlertTriangle } from "lucide-react";
import { db } from "@/services/storage/db";
import { WebRTCService } from "@/services/webrtc/WebRTCService";
import { registerConnection, removeConnection, getConnection } from "@/services/webrtc/activeConnections";
import { buildIntroMessage } from "@/services/webrtc/introMessage";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { PhaseNotice } from "@/components/ui/PhaseNotice";
import { CodeBox } from "@/features/rooms/components/CodeBox";

export function HostRoomPage() {
  const navigate = useNavigate();
  const profile = useLiveQuery(() => db.profile.get("local"), []);
  const conversationIdRef = useRef(crypto.randomUUID());
  // The connect effect below intentionally runs once (it opens a real
  // RTCPeerConnection); useLiveQuery resolves asynchronously after that
  // first render, so a plain closure over `profile` inside onOpen would
  // always see the initial `undefined`. A ref kept in sync via its own
  // effect lets onOpen read whatever the latest profile actually is.
  const profileRef = useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const [offerCode, setOfferCode] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let opened = false;
    const service = new WebRTCService();
    const id = conversationIdRef.current;
    registerConnection(id, service);

    service.onOpen(async () => {
      if (cancelled) return;
      opened = true;
      await db.conversations.add({ id, peerNickname: "Connecting…", sharedInterests: [], startedAt: Date.now() });
      const currentProfile = profileRef.current;
      if (currentProfile) {
        service.send(
          buildIntroMessage(
            currentProfile.displayName,
            currentProfile.interests,
            currentProfile.visibility.avatar ? currentProfile.avatarDataUrl : undefined,
          ),
        );
      }
      navigate(`/chats/${id}`, { replace: true });
    });

    service
      .createOffer()
      .then((code) => !cancelled && setOfferCode(code))
      .catch((e: Error) => !cancelled && setError(e.message));

    return () => {
      cancelled = true;
      // Only tear down if the channel never opened — once it has, this
      // component is unmounting *because* we navigated to the chat view,
      // which now owns this connection's lifecycle.
      if (!opened) removeConnection(id);
    };
    // profile is read via closure at connect-time; re-running this would open a second RTCPeerConnection
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const connect = async () => {
    const service = getConnection(conversationIdRef.current);
    if (!service || !answerInput.trim()) return;
    setConnecting(true);
    setError(null);
    try {
      await service.acceptAnswer(answerInput.trim());
    } catch (e) {
      setError((e as Error).message);
      setConnecting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Private Room"
        actions={
          <Button variant="ghost" size="sm" iconLeft={<ArrowLeft />} onClick={() => navigate("/rooms?type=private")}>
            Back
          </Button>
        }
      />
      <div className="mx-auto max-w-xl px-5 py-8 sm:px-8">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-accent-muted text-accent">
              <DoorOpen className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Invite someone directly</h2>
              <p className="text-[13px] text-text-secondary">
                This connects you peer-to-peer — no account, no server relay for your messages.
              </p>
            </div>
          </div>

          {!offerCode ? (
            <div className="flex items-center gap-2 py-6 text-sm text-text-secondary">
              <Spinner /> Preparing your room…
            </div>
          ) : (
            <div className="space-y-5">
              <CodeBox label="1. Share this code with them" code={offerCode} />

              <div>
                <p className="mb-1.5 text-sm font-medium text-text-primary">2. Paste the code they send back</p>
                <textarea
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  rows={4}
                  placeholder="Paste their response code here…"
                  className="w-full resize-none rounded-[var(--radius-md)] border border-border-strong bg-surface px-3 py-2 font-mono text-xs text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent"
                />
              </div>

              {error && (
                <p className="flex items-center gap-1.5 text-xs text-danger">
                  <AlertTriangle className="size-3.5 shrink-0" /> {error}
                </p>
              )}

              <Button className="w-full" loading={connecting} disabled={!answerInput.trim()} onClick={connect}>
                Connect
              </Button>
            </div>
          )}
        </Card>

        <div className="mt-4">
          <PhaseNotice>
            This code exchange has to happen once, through any channel you already trust (chat app,
            email, in person) — Telepathy doesn't relay it for you. If the connection drops, you'll
            need to create a new room and exchange codes again.
          </PhaseNotice>
        </div>
      </div>
    </div>
  );
}
