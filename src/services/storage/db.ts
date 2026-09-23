import Dexie, { type EntityTable } from "dexie";

/**
 * Local-first persistence for Telepathy.
 * Tables are added incrementally as each feature phase lands; this schema
 * defines the shape the rest of the app is built against from Phase 1 on,
 * so later phases only add records, not migrations of the shell.
 */

export interface ProfileVisibility {
  avatar: boolean;
  interests: boolean;
  languages: boolean;
  about: boolean;
}

export interface ProfileRecord {
  id: "local";
  displayName: string;
  avatarDataUrl?: string;
  languagesSpoken: string[];
  languagesLearning: string[];
  preferredLanguage: string;
  interests: string[];
  intents: string[];
  conversationStyle: string[];
  about?: string;
  visibility: ProfileVisibility;
  createdAt: number;
  updatedAt: number;
}

export interface SavedPersonRecord {
  id: string;
  nickname: string;
  avatarDataUrl?: string;
  note?: string;
  interests: string[];
  savedAt: number;
}

export interface ConversationRecord {
  id: string;
  peerNickname: string;
  peerAvatarDataUrl?: string;
  sharedInterests: string[];
  startedAt: number;
  endedAt?: number;
  savedAt?: number;
}

export interface MessageRecord {
  id: string;
  conversationId: string;
  sender: "me" | "peer";
  text: string;
  isCode?: boolean;
  replyToId?: string;
  reactions: string[];
  createdAt: number;
}

export interface ReportRecord {
  id: string;
  conversationId?: string;
  peerNickname: string;
  category: string;
  details?: string;
  createdAt: number;
}

export interface IdeaRecord {
  id: string;
  type: "idea" | "question" | "project" | "problem" | "solution" | "research" | "resource" | "discussion";
  title: string;
  description: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface BlockedUserRecord {
  id: string;
  nickname: string;
  reason?: string;
  blockedAt: number;
}

export interface SettingRecord {
  key: string;
  value: unknown;
}

class TelepathyDatabase extends Dexie {
  profile!: EntityTable<ProfileRecord, "id">;
  savedPeople!: EntityTable<SavedPersonRecord, "id">;
  conversations!: EntityTable<ConversationRecord, "id">;
  messages!: EntityTable<MessageRecord, "id">;
  reports!: EntityTable<ReportRecord, "id">;
  ideas!: EntityTable<IdeaRecord, "id">;
  blockedUsers!: EntityTable<BlockedUserRecord, "id">;
  settings!: EntityTable<SettingRecord, "key">;

  constructor() {
    super("telepathy");
    this.version(1).stores({
      profile: "id",
      savedPeople: "id, savedAt",
      conversations: "id, startedAt, savedAt",
      ideas: "id, type, updatedAt",
      blockedUsers: "id, blockedAt",
      settings: "key",
    });
    this.version(2).stores({
      messages: "id, conversationId, createdAt",
      reports: "id, conversationId, createdAt",
    });
  }
}

export const db = new TelepathyDatabase();
