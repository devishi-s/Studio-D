"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateProfileName } from "@/lib/actions/profile";
import { AUTH_FIELD_CLASS } from "@/lib/auth";
import { Button } from "@/components/ui/button";

type ProfileEditFormProps = {
  initialFullName: string;
};

export function ProfileEditForm({ initialFullName }: ProfileEditFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await updateProfileName(fullName);
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success("Profile updated");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-brand-brown"
        >
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "fullName-error" : undefined}
          className={AUTH_FIELD_CLASS}
          disabled={isPending}
        />
        {error && (
          <p
            id="fullName-error"
            role="alert"
            className="mt-1.5 text-xs text-destructive"
          >
            {error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="rounded-full px-6"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" data-icon="inline-start" />
            Saving…
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
}
