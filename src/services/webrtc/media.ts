export type MediaFailureReason = "denied" | "not-found" | "in-use" | "unknown";

export interface MediaRequestResult {
  stream?: MediaStream;
  error?: MediaFailureReason;
}

/** Only ever called from an explicit user action (a button click) — never
 * from a mount effect. Camera/microphone access is never requested
 * automatically (spec §84/§85). */
export async function requestMedia(kind: "video" | "audio"): Promise<MediaRequestResult> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: kind === "video",
    });
    return { stream };
  } catch (e) {
    const err = e as DOMException;
    let reason: MediaFailureReason = "unknown";
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") reason = "denied";
    else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") reason = "not-found";
    else if (err.name === "NotReadableError" || err.name === "TrackStartError") reason = "in-use";
    return { error: reason };
  }
}

export const mediaFailureMessages: Record<MediaFailureReason, string> = {
  denied: "Camera/microphone permission was denied. Allow access in your browser's site settings to use calls.",
  "not-found": "No camera or microphone was found on this device.",
  "in-use": "Your camera or microphone is already in use by another app.",
  unknown: "Couldn't access your camera or microphone.",
};
