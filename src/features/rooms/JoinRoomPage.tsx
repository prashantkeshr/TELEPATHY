import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, LogIn, AlertTriangle } from "lucide-react";
import { db } from "@/services/storage/db";
import { WebRTCService } from "@/services/webrtc/WebRTCService";
import { registerConnection, removeConnection } from "@/services/webrtc/activeConnections";
import { buildIntroMessage } from "@/services/webrtc/introMessage";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { PhaseNotice } from "@/components/ui/PhaseNotice";
import { CodeBox } from "@/features/rooms/components/CodeBox";

export function JoinRoomPage() {
  const navigate = useNavigate();
  const profile = useLiveQuery(() => db.profile.get("local"), []);
  const conversationIdRef = useRef(crypto.randomUUID());
  const serviceRef = useRef<WebRTCService | null>(null);
  // See the matching comment in HostRoomPage: onOpen's closure needs the
  // latest profile, not whatever useLiveQuery had resolved to at mount.
  const profileRef = useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const [offerInput, setOfferInput] = useState("");
  const [answerCode, setAnswerCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let opened = false;
    const service = new WebRTCService();
    serviceRef.current = service;
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

    return () => {
      cancelled = true;
      // Only tear down if the channel never opened — once it has, this
      // component is unmounting *because* we navigated to the chat view,
      // which now owns this connection's lifecycle.
      if (!opened) removeConnection(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const generateAnswer = async () => {
    const service = serviceRef.current;
    if (!service || !offerInput.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const code = await service.createAnswer(offerInput.trim());
      setAnswerCode(code);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Join a Room"
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
              <LogIn className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Join someone's room</h2>
              <p className="text-[13px] text-text-secondary">Paste the code they shared with you.</p>
            </div>
          </div>

          {!answerCode ? (
            <div className="space-y-4">
              <textarea
                value={offerInput}
                onChange={(e) => setOfferInput(e.target.value)}
                rows={5}
                placeholder="Paste their room code here…"
                className="w-full resize-none rounded-[var(--radius-md)] border border-border-strong bg-surface px-3 py-2 font-mono text-xs text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent"
              />
              {error && (
                <p className="flex items-center gap-1.5 text-xs text-danger">
                  <AlertTriangle className="size-3.5 shrink-0" /> {error}
                </p>
              )}
              <Button className="w-full" loading={generating} disabled={!offerInput.trim()} onClick={generateAnswer}>
                Generate response code
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <CodeBox label="Send this code back to them" code={answerCode} />
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Spinner /> Waiting for them to finish connecting on their end…
              </div>
            </div>
          )}
        </Card>

        <div className="mt-4">
          <PhaseNotice>
            Once they enter this code on their side, the connection completes automatically and
            you'll both land in the conversation.
          </PhaseNotice>
        </div>
      </div>
    </div>
  );
}
