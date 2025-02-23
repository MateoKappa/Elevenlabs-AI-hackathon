"use client";

import { Button } from "@/components/ui/button";
import { loginWithGithub } from "@/server-actions/auth";

export default function Page() {
  return (
    <div className="max-w-sm mx-auto w-full h-screen flex flex-col items-center justify-center gap-4">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Authenticate</h1>
        <p className="text-balance text-muted-foreground">
          Use your Github account to authenticate in to the dashboard.
        </p>
      </div>

      <Button
        onClick={loginWithGithub}
        variant="outline"
        className="w-full"
      >
        Login with Github
      </Button>
    </div>
  );
}
