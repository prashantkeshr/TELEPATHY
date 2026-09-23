import { useState } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, Download, Trash2, ShieldAlert, ShieldX, Search, Video, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { Badge } from "@/components/ui/Badge";
import type { ConnectionState } from "@/services/connection/connectionState";
import { connectionStateLabels } from "@/services/connection/connectionState";

const connectionTone: Record<ConnectionState, "success" | "warning" | "danger" | "neutral" | "accent"> = {
  idle: "neutral",
  searching: "warning",
  matched: "accent",
  connecting: "warning",
  negotiating: "warning",
  connected: "success",
  degraded: "warning",
  reconnecting: "warning",
  failed: "danger",
  fallback: "warning",
  closed: "neutral",
};

export function ChatHeader({
  nickname,
  avatarDataUrl,
  sharedInterests,
  connectionState,
  saved,
  onToggleSave,
  onExport,
  onDelete,
  onBlock,
  onReport,
  onSearchToggle,
  onStartVideoCall,
  onStartAudioCall,
  inCall,
  backTo,
}: {
  nickname: string;
  avatarDataUrl?: string;
  sharedInterests: string[];
  connectionState: ConnectionState;
  saved?: boolean;
  onToggleSave?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
  onBlock?: () => void;
  onReport?: () => void;
  onSearchToggle?: () => void;
  onStartVideoCall?: () => void;
  onStartAudioCall?: () => void;
  inCall?: boolean;
  backTo: string;
}) {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex items-center gap-3 border-b border-border bg-bg-elevated px-4 py-3">
      <IconButton label="Back" variant="ghost" onClick={() => navigate(backTo)}>
        <ArrowLeft />
      </IconButton>
      <Avatar name={nickname} src={avatarDataUrl} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">{nickname}</p>
        <div className="flex items-center gap-1.5">
          <Badge tone={connectionTone[connectionState]}>{connectionStateLabels[connectionState]}</Badge>
          {sharedInterests.slice(0, 2).map((i) => (
            <Badge key={i} tone="neutral">{i}</Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        {onStartAudioCall && !inCall && (
          <IconButton label="Start voice call" variant="ghost" onClick={onStartAudioCall}>
            <Phone />
          </IconButton>
        )}
        {onStartVideoCall && !inCall && (
          <IconButton label="Start video call" variant="ghost" onClick={onStartVideoCall}>
            <Video />
          </IconButton>
        )}
        {onSearchToggle && (
          <IconButton label="Search in conversation" variant="ghost" onClick={onSearchToggle}>
            <Search />
          </IconButton>
        )}
        {onToggleSave && (
          <IconButton label={saved ? "Saved" : "Save conversation"} variant="ghost" active={saved} onClick={onToggleSave}>
            {saved ? <BookmarkCheck /> : <Bookmark />}
          </IconButton>
        )}
        {onExport && (
          <IconButton label="Export conversation" variant="ghost" onClick={onExport}>
            <Download />
          </IconButton>
        )}
        {onReport && (
          <IconButton label="Report" variant="ghost" onClick={onReport}>
            <ShieldAlert />
          </IconButton>
        )}
        {onBlock && (
          <IconButton label="Block" variant="danger" onClick={onBlock}>
            <ShieldX />
          </IconButton>
        )}
        {onDelete && (
          <IconButton
            label="Delete conversation"
            variant="danger"
            onClick={() => {
              if (confirmDelete) {
                onDelete();
                setConfirmDelete(false);
              } else {
                setConfirmDelete(true);
                setTimeout(() => setConfirmDelete(false), 2500);
              }
            }}
          >
            <Trash2 />
          </IconButton>
        )}
      </div>
    </div>
  );
}
