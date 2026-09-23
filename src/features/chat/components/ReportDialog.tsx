import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

const CATEGORIES = [
  "Harassment",
  "Spam",
  "Scam",
  "Threat",
  "Sexual content",
  "Impersonation",
  "Hateful or abusive behavior",
  "Unwanted content",
  "Other",
];

export function ReportDialog({
  open,
  onClose,
  onSubmit,
  nickname,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (category: string, details: string) => void;
  nickname: string;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [details, setDetails] = useState("");

  const submit = () => {
    if (!category) return;
    onSubmit(category, details.trim());
    setCategory(null);
    setDetails("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Report ${nickname}`}
      description="Your report stays anonymous to the person you're reporting. This is stored locally on this device."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip key={c} selected={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Anything else that would help (optional)"
          rows={3}
          maxLength={500}
          className="w-full resize-none rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent"
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" disabled={!category} onClick={submit}>
            Submit report
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
