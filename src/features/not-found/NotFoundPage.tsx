import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5">
      <EmptyState
        icon={<Compass />}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={
          <Button size="sm" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        }
      />
    </div>
  );
}
