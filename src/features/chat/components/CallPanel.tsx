import { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize, User } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Avatar } from "@/components/ui/Avatar";

function VideoEl({ stream, muted, mirror }: { stream: MediaStream | null; muted?: boolean; mirror?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted={muted}
      className="size-full object-cover"
      style={mirror ? { transform: "scaleX(-1)" } : undefined}
    />
  );
}

export function CallPanel({
  kind,
  peerNickname,
  localStream,
  remoteStream,
  micEnabled,
  cameraEnabled,
  onToggleMic,
  onToggleCamera,
  onEndCall,
}: {
  kind: "video" | "audio";
  peerNickname: string;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  micEnabled: boolean;
  cameraEnabled: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const goFullscreen = () => {
    containerRef.current?.requestFullscreen?.().catch(() => {});
  };

  return (
    <div ref={containerRef} className="relative flex-1 overflow-hidden bg-black">
      {kind === "video" ? (
        <>
          {remoteStream ? (
            <VideoEl stream={remoteStream} />
          ) : (
            <div className="flex size-full items-center justify-center bg-surface">
              <Avatar name={peerNickname} size="xl" />
            </div>
          )}
          {localStream && cameraEnabled && (
            <div className="absolute bottom-20 right-4 h-32 w-24 overflow-hidden rounded-[var(--radius-md)] border border-border-strong shadow-lg sm:bottom-24 sm:h-40 sm:w-28">
              <VideoEl stream={localStream} muted mirror />
            </div>
          )}
        </>
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-3 bg-surface">
          <Avatar name={peerNickname} size="xl" />
          <p className="text-sm text-text-secondary">Audio call with {peerNickname}</p>
          {remoteStream && <VideoEl stream={remoteStream} muted={false} />}
        </div>
      )}

      {!remoteStream && (
        <div className="absolute inset-x-0 top-4 flex justify-center">
          <span className="rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
            Waiting for {peerNickname}…
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
        <IconButton
          label={micEnabled ? "Mute microphone" : "Unmute microphone"}
          variant={micEnabled ? "default" : "danger"}
          size="lg"
          onClick={onToggleMic}
        >
          {micEnabled ? <Mic /> : <MicOff />}
        </IconButton>
        {kind === "video" && (
          <IconButton
            label={cameraEnabled ? "Turn off camera" : "Turn on camera"}
            variant={cameraEnabled ? "default" : "danger"}
            size="lg"
            onClick={onToggleCamera}
          >
            {cameraEnabled ? <Video /> : <VideoOff />}
          </IconButton>
        )}
        <IconButton label="End call" variant="danger" size="lg" onClick={onEndCall}>
          <PhoneOff />
        </IconButton>
        <IconButton label="Fullscreen" variant="default" size="lg" onClick={goFullscreen}>
          <Maximize />
        </IconButton>
      </div>
    </div>
  );
}

export function IncomingCallBanner({
  peerNickname,
  kind,
  onAcceptVideo,
  onAcceptAudioOnly,
  onDecline,
}: {
  peerNickname: string;
  kind: "video" | "audio";
  onAcceptVideo: () => void;
  onAcceptAudioOnly: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-accent/30 bg-accent-muted px-4 py-3">
      <User className="size-4 shrink-0 text-accent" />
      <p className="flex-1 text-sm text-text-primary">
        <span className="font-medium">{peerNickname}</span> is calling ({kind === "video" ? "video" : "audio"})
      </p>
      <div className="flex gap-1.5">
        {kind === "video" && (
          <button
            onClick={onAcceptVideo}
            className="rounded-[var(--radius-sm)] bg-accent px-2.5 py-1 text-xs font-medium text-text-on-accent"
          >
            Accept
          </button>
        )}
        <button
          onClick={onAcceptAudioOnly}
          className="rounded-[var(--radius-sm)] bg-surface-3 px-2.5 py-1 text-xs font-medium text-text-primary"
        >
          {kind === "video" ? "Audio only" : "Accept"}
        </button>
        <button
          onClick={onDecline}
          className="rounded-[var(--radius-sm)] bg-danger-muted px-2.5 py-1 text-xs font-medium text-danger"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
