import { useRef, useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/components/ui/Toast";
import {
  INTEREST_OPTIONS,
  INTENT_OPTIONS,
  CONVERSATION_STYLE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/constants/profileOptions";
import { fileToResizedDataUrl } from "@/utils/image";
import { toggleItem, type ProfileDraft } from "./types";
import { ConversationPassport } from "@/features/profile/ConversationPassport";

interface StepProps {
  draft: ProfileDraft;
  update: (patch: Partial<ProfileDraft>) => void;
}

export function NameStep({ draft, update }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">What should people call you?</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Your profile helps Telepathy find better conversations. You control what other people
          can see — a real name isn't required.
        </p>
      </div>
      <input
        autoFocus
        value={draft.displayName}
        onChange={(e) => update({ displayName: e.target.value })}
        placeholder="Display name or nickname"
        maxLength={40}
        className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent"
      />
    </div>
  );
}

export function AvatarStep({ draft, update }: StepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { show } = useToast();

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      show("Please choose an image file", "danger");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      update({ avatarDataUrl: dataUrl });
    } catch {
      show("Couldn't read that image", "danger");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Choose an avatar</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Optional. Stored on this device only, and resized before it's saved — nothing is
          uploaded automatically.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Avatar name={draft.displayName || "?"} src={draft.avatarDataUrl} size="xl" />
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <Button size="sm" variant="outline" iconLeft={<Upload />} loading={busy} onClick={() => inputRef.current?.click()}>
            Upload photo
          </Button>
          {draft.avatarDataUrl && (
            <Button size="sm" variant="ghost" iconLeft={<X />} onClick={() => update({ avatarDataUrl: undefined })}>
              Use initials instead
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LanguagesStep({ draft, update }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Languages</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Helps Telepathy match you for language practice and pick a shared conversation
          language.
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-text-primary">I speak</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <Chip
              key={lang}
              selected={draft.languagesSpoken.includes(lang)}
              onClick={() => update({ languagesSpoken: toggleItem(draft.languagesSpoken, lang) })}
            >
              {lang}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-text-primary">I'm learning</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <Chip
              key={lang}
              selected={draft.languagesLearning.includes(lang)}
              onClick={() => update({ languagesLearning: toggleItem(draft.languagesLearning, lang) })}
            >
              {lang}
            </Chip>
          ))}
        </div>
      </div>

      {draft.languagesSpoken.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-text-primary">Preferred conversation language</p>
          <div className="flex flex-wrap gap-2">
            {draft.languagesSpoken.map((lang) => (
              <Chip
                key={lang}
                selected={draft.preferredLanguage === lang}
                onClick={() => update({ preferredLanguage: lang })}
              >
                {lang}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function InterestsStep({ draft, update }: StepProps) {
  const [custom, setCustom] = useState("");

  const addCustom = () => {
    const value = custom.trim();
    if (value && !draft.interests.includes(value)) {
      update({ interests: [...draft.interests, value] });
    }
    setCustom("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">What are you into?</h2>
        <p className="mt-1 text-sm text-text-secondary">Pick as many as you like.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((interest) => (
          <Chip
            key={interest}
            selected={draft.interests.includes(interest)}
            onClick={() => update({ interests: toggleItem(draft.interests, interest) })}
          >
            {interest}
          </Chip>
        ))}
        {draft.interests
          .filter((i) => !INTEREST_OPTIONS.includes(i))
          .map((interest) => (
            <Chip
              key={interest}
              selected
              onRemove={() => update({ interests: draft.interests.filter((x) => x !== interest) })}
            >
              {interest}
            </Chip>
          ))}
      </div>
      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          placeholder="Add a custom interest"
          maxLength={30}
          className="flex-1 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent"
        />
        <Button size="md" variant="outline" iconLeft={<Plus />} onClick={addCustom}>
          Add
        </Button>
      </div>
    </div>
  );
}

export function IntentStep({ draft, update }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">What are you here for?</h2>
        <p className="mt-1 text-sm text-text-secondary">Select all that apply.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {INTENT_OPTIONS.map((intent) => (
          <Chip
            key={intent}
            selected={draft.intents.includes(intent)}
            onClick={() => update({ intents: toggleItem(draft.intents, intent) })}
          >
            {intent}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export function StyleStep({ draft, update }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Conversation style</h2>
        <p className="mt-1 text-sm text-text-secondary">How do you like to talk?</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {CONVERSATION_STYLE_OPTIONS.map((style) => (
          <Chip
            key={style}
            selected={draft.conversationStyle.includes(style)}
            onClick={() => update({ conversationStyle: toggleItem(draft.conversationStyle, style) })}
          >
            {style}
          </Chip>
        ))}
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-text-primary">About you (optional)</p>
        <textarea
          value={draft.about ?? ""}
          onChange={(e) => update({ about: e.target.value })}
          maxLength={280}
          rows={3}
          placeholder="Anything else you'd like people to know before you start talking"
          className="w-full resize-none rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}

const visibilityFields: { key: keyof ProfileDraft["visibility"]; label: string; hint: string }[] = [
  { key: "avatar", label: "Avatar", hint: "Show your photo or initials to others" },
  { key: "interests", label: "Interests", hint: "Show what you're into" },
  { key: "languages", label: "Languages", hint: "Show what you speak and are learning" },
  { key: "about", label: "About", hint: "Show your optional about text" },
];

export function PrivacyStep({ draft, update }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Privacy</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Choose what's visible on your Conversation Passport. Your name and what you're here for
          are always shown — everything else is up to you.
        </p>
      </div>
      <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border">
        {visibilityFields.map((field) => (
          <div key={field.key} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-text-primary">{field.label}</p>
              <p className="text-[13px] text-text-tertiary">{field.hint}</p>
            </div>
            <Switch
              label={field.label}
              checked={draft.visibility[field.key]}
              onChange={(checked) => update({ visibility: { ...draft.visibility, [field.key]: checked } })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PreviewStep({ draft }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">This is what others can see</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Your Conversation Passport — a compact summary used to find conversations worth having.
        </p>
      </div>
      <ConversationPassport data={draft} />
    </div>
  );
}
