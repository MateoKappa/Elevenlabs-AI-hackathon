import { createClient } from "@/supabase/client";
import { redirect } from "next/navigation";

export async function loginWithGithub(origin: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  return { data, error };
}

export async function getUser() {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();
  return user;
}

export async function logout() {
  const supabase = createClient();

  await supabase.auth.signOut();
}
