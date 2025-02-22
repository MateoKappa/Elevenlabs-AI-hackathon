'use server'

import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export async function loginWithGithub() {
  const supabase = createClient();

  const { data, error } = await (await supabase).auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "/api/auth/callback",
    },
  });

  if (data.url) {
    redirect(data.url); 
  }

  return { data, error };
}