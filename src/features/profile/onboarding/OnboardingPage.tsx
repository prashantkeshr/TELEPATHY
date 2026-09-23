import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { db } from "@/services/storage/db";
import { LogoMark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { useToast } from "@/components/ui/Toast";
import type { ProfileDraft } from "./types";
import {
  NameStep,
  AvatarStep,
  LanguagesStep,
  InterestsStep,
  IntentStep,
  StyleStep,
  PrivacyStep,
  PreviewStep,
} from "./OnboardingSteps";

const emptyDraft: ProfileDraft = {
  displayName: "",
  avatarDataUrl: undefined,
  languagesSpoken: [],
  languagesLearning: [],
  preferredLanguage: "",
  interests: [],
  intents: [],
  conversationStyle: [],
  about: "",
  visibility: { avatar: true, interests: true, languages: true, about: true },
};

const steps = [
  { title: "Name", Component: NameStep },
  { title: "Avatar", Component: AvatarStep },
  { title: "Languages", Component: LanguagesStep },
  { title: "Interests", Component: InterestsStep },
  { title: "Intent", Component: IntentStep },
  { title: "Style", Component: StyleStep },
  { title: "Privacy", Component: PrivacyStep },
  { title: "Preview", Component: PreviewStep },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { show } = useToast();
  const existing = useLiveQuery(() => db.profile.get("local"), []);
  const [hydrated, setHydrated] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const isEditing = !!existing;

  useEffect(() => {
    if (existing && !hydrated) {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = existing;
      setDraft({ ...emptyDraft, ...rest });
      setHydrated(true);
    }
  }, [existing, hydrated]);

  const update = (patch: Partial<ProfileDraft>) => setDraft((prev) => ({ ...prev, ...patch }));

  const canAdvance = useMemo(() => {
    if (stepIndex === 0) return draft.displayName.trim().length > 0;
    return true;
  }, [stepIndex, draft.displayName]);

  const isLastStep = stepIndex === steps.length - 1;
  const { Component } = steps[stepIndex];

  const finish = async () => {
    const now = Date.now();
    await db.profile.put({
      ...draft,
      displayName: draft.displayName.trim(),
      id: "local",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
    show(isEditing ? "Profile updated" : "Profile created", "success");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <div className="aurora-backdrop fixed" />
      <header className="relative flex items-center justify-between border-b border-border px-5 py-4 sm:px-8">
        <LogoMark />
        {isEditing && (
          <IconButton label="Cancel" variant="ghost" onClick={() => navigate(-1)}>
            <X />
          </IconButton>
        )}
      </header>

      <div className="relative h-1 w-full bg-surface-2">
        <div
          className="h-full bg-[image:var(--gradient-accent)] transition-all duration-300"
          style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      <main className="relative mx-auto flex w-full max-w-lg flex-1 flex-col px-5 py-8 sm:px-0">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-tertiary">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <div className="animate-fade-in-up flex-1" key={stepIndex}>
          <Component draft={draft} update={update} />
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            iconLeft={<ArrowLeft />}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
          >
            Back
          </Button>
          {isLastStep ? (
            <Button iconLeft={<Check />} onClick={finish}>
              {isEditing ? "Save changes" : "Create profile"}
            </Button>
          ) : (
            <Button iconRight={<ArrowRight />} onClick={() => setStepIndex((i) => i + 1)} disabled={!canAdvance}>
              Continue
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
