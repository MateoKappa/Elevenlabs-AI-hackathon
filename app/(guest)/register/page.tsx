import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Component() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm mx-auto">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-center text-foreground">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-center text-muted-foreground">
              Or{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                sign in to your account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form action="#" method="POST" className="space-y-6">
              <div>
                <Label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-foreground"
                >
                  Full Name
                </Label>
                <div className="mt-1">
                  <Input
                    id="fullname"
                    name="fullname"
                    type="text"
                    autoComplete="name"
                    required
                    className="block w-full"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email address
                </Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <div className="mt-1">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-foreground"
                >
                  Confirm Password
                </Label>
                <div className="mt-1">
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="terms"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <div>
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
