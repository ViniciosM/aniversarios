"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { signIn } from "next-auth/react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onOAuthProvider(provider: string) {
    setIsLoading(true);
    await signIn(provider);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button
        onClick={() => onOAuthProvider("google")}
        disabled={isLoading}
        variant="outline"
        type="button"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
