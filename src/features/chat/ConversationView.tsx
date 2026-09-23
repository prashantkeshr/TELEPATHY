import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { Search, X } from "lucide-react";
import { db } from "@/services/storage/db";
import { useToast } from "@/components/ui/Toast";
import { ChatHeader } from "@/features/chat/components/ChatHeader";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { Composer } from "@/features/chat/components/Composer";
import { ReportDialog } from "@/features/chat/components/ReportDialog";
import { CallPanel, IncomingCallBanner } from "@/features/chat/components/CallPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { getConnection, removeConnection } from "@/services/webrtc/activeConnections";
import { parseIntroMessage } from "@/services/webrtc/introMessage";
import { requestMedia, mediaFailureMessages } from "@/services/webrtc/media";
import type { ConnectionState } from "@/services/connection/connectionState";

function draftKey(conversationId: string) {
  return `telepathy:draft:${conversationId}`;
}

export function ConversationView() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();

  const conversation = useLiveQuery(async () => (await db.conversations.get(id)) ?? null, [id]);
  const messages = useLiveQuery(() => db.messages.where("conversationId").equals(id).sortBy("createdAt"), [id], []);
  const profile = useLiveQuery(() => db.profile.get("local"), []);

  const [value, setValue] = useState(() => localStorage.getItem(draftKey(id)) ?? "");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [isCode, setIsCode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [liveState, setLiveState] = useState<ConnectionState | null>(null);

  const [callActive, setCallActive] = useState(false);
  const [callKind, setCallKind] = useState<"video" | "audio" | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [incomingCallKind, setIncomingCallKind] = useState<"video" | "audio" | null>(null);

  // Refs mirroring the above call state: the connection effect below only
  // runs once per `id`, so a handler closure reading plain state would see
  // whatever was true at mount forever, not the latest value.
  const callActiveRef = useRef(callActive);
  const localStreamRef = useRef(localStream);
  useEffect(() => {
    callActiveRef.current = callActive;
  }, [callActive]);
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  useEffect(() => {
    localStorage.setItem(draftKey(id), value);
  }, [id, value]);

  useEffect(() => {
    const service = getConnection(id);
    if (!service) {
      setLiveState(null);
      return;
    }
    setLiveState(service.state);
    const unsubState = service.onStateChange(setLiveState);
    const unsubMessage = service.onMessage((text) => {
      const intro = parseIntroMessage(text);
      if (intro) {
        const ownInterests = profile?.interests ?? [];
        db.conversations.update(id, {
          peerNickname: intro.displayName,
          peerAvatarDataUrl: intro.avatarDataUrl,
          sharedInterests: intro.interests.filter((i) => ownInterests.includes(i)),
        });
        return;
      }
      db.messages.add({
        id: crypto.randomUUID(),
        conversationId: id,
        sender: "peer",
        text,
        reactions: [],
        createdAt: Date.now(),
      });
    });
    const unsubStream = service.onRemoteStream((stream) => {
      setRemoteStream(stream);
      if (!callActiveRef.current) {
        setIncomingCallKind(stream.getVideoTracks().length > 0 ? "video" : "audio");
      }
    });
    const unsubCallEnd = service.onCallEnd(() => {
      setCallActive(false);
      setCallKind(null);
      setLocalStream(null);
      setRemoteStream(null);
      setIncomingCallKind(null);
    });
    return () => {
      unsubState();
      unsubMessage();
      unsubStream();
      unsubCallEnd();
      // Leaving the conversation mid-call: stop our own camera/mic rather
      // than leaving them hot with no visible call UI, and let the peer
      // know the call ended.
      if (localStreamRef.current) service.endCall();
    };
    // profile is only needed at the moment an intro message actually arrives, not as a re-subscribe trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const replyToMessage = messages?.find((m) => m.id === replyToId);
  const messageById = useMemo(() => new Map((messages ?? []).map((m) => [m.id, m])), [messages]);
  const visibleMessages = query
    ? (messages ?? []).filter((m) => m.text.toLowerCase().includes(query.toLowerCase()))
    : messages ?? [];

  if (conversation === undefined) return null;
  if (conversation === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5">
        <EmptyState title="Conversation not found" description="This conversation may have been deleted." />
      </div>
    );
  }

  const applyLocalStream = (kind: "video" | "audio", stream: MediaStream) => {
    getConnection(id)?.addMedia(stream);
    setLocalStream(stream);
    setCallKind(kind);
    setCallActive(true);
    setMicEnabled(true);
    setCameraEnabled(kind === "video");
    setIncomingCallKind(null);
  };

  const startCall = async (kind: "video" | "audio") => {
    if (!getConnection(id)) return;
    const result = await requestMedia(kind);
    if (result.stream) {
      applyLocalStream(kind, result.stream);
      return;
    }
    if (kind === "video") {
      const audioResult = await requestMedia("audio");
      if (audioResult.stream) {
        show("Camera unavailable — continuing with audio only", "warning");
        applyLocalStream("audio", audioResult.stream);
        return;
      }
      show(mediaFailureMessages[audioResult.error ?? "unknown"], "danger");
      return;
    }
    show(mediaFailureMessages[result.error ?? "unknown"], "danger");
  };

  const acceptIncoming = async (kind: "video" | "audio") => {
    const result = await requestMedia(kind);
    if (result.stream) {
      applyLocalStream(kind, result.stream);
    } else {
      show(mediaFailureMessages[result.error ?? "unknown"], "danger");
      declineIncoming();
    }
  };

  const declineIncoming = () => {
    getConnection(id)?.endCall();
    setIncomingCallKind(null);
    setRemoteStream(null);
  };

  const hangUp = () => {
    getConnection(id)?.endCall();
    setCallActive(false);
    setCallKind(null);
    setLocalStream(null);
    setRemoteStream(null);
    setIncomingCallKind(null);
  };

  const toggleMic = () => {
    getConnection(id)?.setTrackEnabled("audio", !micEnabled);
    setMicEnabled((v) => !v);
  };

  const toggleCamera = () => {
    getConnection(id)?.setTrackEnabled("video", !cameraEnabled);
    setCameraEnabled((v) => !v);
  };

  const send = async () => {
    const text = value.trim();
    if (!text) return;
    await db.messages.add({
      id: crypto.randomUUID(),
      conversationId: id,
      sender: "me",
      text,
      isCode,
      replyToId: replyToId ?? undefined,
      reactions: [],
      createdAt: Date.now(),
    });
    getConnection(id)?.send(text);
    setValue("");
    setReplyToId(null);
    setIsCode(false);
    localStorage.removeItem(draftKey(id));
  };

  const react = async (messageId: string, emoji: string) => {
    const msg = messageById.get(messageId);
    if (!msg) return;
    const has = msg.reactions.includes(emoji);
    await db.messages.update(messageId, {
      reactions: has ? msg.reactions.filter((r) => r !== emoji) : [...msg.reactions, emoji],
    });
  };

  const deleteMessage = async (messageId: string) => {
    await db.messages.delete(messageId);
  };

  const toggleSave = async () => {
    await db.conversations.update(id, { savedAt: conversation.savedAt ? undefined : Date.now() });
    show(conversation.savedAt ? "Removed from saved" : "Conversation saved", "success");
  };

  const exportConversation = () => {
    const lines = (messages ?? []).map(
      (m) => `[${new Date(m.createdAt).toLocaleString()}] ${m.sender === "me" ? "You" : conversation.peerNickname}: ${m.text}`,
    );
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `telepathy-conversation-${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    show("Conversation exported", "success");
  };

  const deleteConversation = async () => {
    removeConnection(id);
    await db.messages.where("conversationId").equals(id).delete();
    await db.conversations.delete(id);
    localStorage.removeItem(draftKey(id));
    show("Conversation deleted", "success");
    navigate("/chats");
  };

  const block = async () => {
    removeConnection(id);
    await db.blockedUsers.add({
      id: crypto.randomUUID(),
      nickname: conversation.peerNickname,
      reason: "Blocked from conversation",
      blockedAt: Date.now(),
    });
    show(`${conversation.peerNickname} blocked`, "success");
    navigate("/chats");
  };

  const submitReport = async (category: string, details: string) => {
    await db.reports.add({
      id: crypto.randomUUID(),
      conversationId: id,
      peerNickname: conversation.peerNickname,
      category,
      details: details || undefined,
      createdAt: Date.now(),
    });
    setReportOpen(false);
    show("Report submitted", "success");
  };

  return (
    <div className="flex h-full min-h-[calc(100dvh-56px)] flex-col lg:min-h-dvh">
      <ChatHeader
        nickname={conversation.peerNickname}
        avatarDataUrl={conversation.peerAvatarDataUrl}
        sharedInterests={conversation.sharedInterests}
        connectionState={liveState ?? "closed"}
        saved={!!conversation.savedAt}
        onToggleSave={toggleSave}
        onExport={exportConversation}
        onDelete={deleteConversation}
        onBlock={block}
        onReport={() => setReportOpen(true)}
        onSearchToggle={() => setSearchOpen((v) => !v)}
        onStartVideoCall={liveState === "connected" ? () => startCall("video") : undefined}
        onStartAudioCall={liveState === "connected" ? () => startCall("audio") : undefined}
        inCall={callActive}
        backTo="/chats"
      />

      {incomingCallKind && !callActive && (
        <IncomingCallBanner
          peerNickname={conversation.peerNickname}
          kind={incomingCallKind}
          onAcceptVideo={() => acceptIncoming("video")}
          onAcceptAudioOnly={() => acceptIncoming("audio")}
          onDecline={declineIncoming}
        />
      )}

      {searchOpen && (
        <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-2">
          <Search className="size-4 text-text-tertiary" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this conversation…"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
          />
          <IconButton
            label="Close search"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchOpen(false);
              setQuery("");
            }}
          >
            <X />
          </IconButton>
        </div>
      )}

      {callActive && callKind ? (
        <CallPanel
          kind={callKind}
          peerNickname={conversation.peerNickname}
          localStream={localStream}
          remoteStream={remoteStream}
          micEnabled={micEnabled}
          cameraEnabled={cameraEnabled}
          onToggleMic={toggleMic}
          onToggleCamera={toggleCamera}
          onEndCall={hangUp}
        />
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {visibleMessages.length === 0 ? (
            <EmptyState title={query ? "No matches" : "No messages yet"} />
          ) : (
            visibleMessages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                replyToMessage={m.replyToId ? messageById.get(m.replyToId) : undefined}
                onReply={setReplyToId}
                onDelete={deleteMessage}
                onReact={react}
              />
            ))
          )}
        </div>
      )}

      <Composer
        value={value}
        onChange={setValue}
        onSend={send}
        replyTo={replyToMessage}
        onCancelReply={() => setReplyToId(null)}
        isCode={isCode}
        onToggleCode={() => setIsCode((v) => !v)}
      />

      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={submitReport}
        nickname={conversation.peerNickname}
      />
    </div>
  );
}
