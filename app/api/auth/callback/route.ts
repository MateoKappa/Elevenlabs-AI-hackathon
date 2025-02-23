import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/supabase/server";

const getURL = () => {
  const isDevelopment = process.env.VERCEL_ENV !== "production";

  let url =
    process?.env?.VERCEL_URL ??
    process?.env?.VERCEL_BRANCH_URL ??
    "http://localhost:3000/";

  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.log({ error });
    if (!error) {
      return NextResponse.redirect(`${getURL()}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
