import type { ProfileRecord } from "@/services/storage/db";

export type ProfileDraft = Omit<ProfileRecord, "id" | "createdAt" | "updatedAt">;

export function toggleItem(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}
