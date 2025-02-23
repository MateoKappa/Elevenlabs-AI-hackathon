import { createClient } from "@/supabase/client";
import { redirect } from "next/navigation";

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

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
