"use client";

import { Icons } from "@/components/icons";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { AuthLoading, Authenticated, ConvexReactClient, Unauthenticated } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexClientProvider = ({ children }: ConvexClientProviderProps) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        elements: {
          footer: "hidden",
        },
      }}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <AuthLoading>
          <div className="flex justify-center items-center gap-2 h-screen">
            <Icons.loader className="animate-spin min-w-5 min-h-5 size-5" />
            Loading, please wait ...
          </div>
        </AuthLoading>
        <Authenticated>{children}</Authenticated>
        <Unauthenticated>{children}</Unauthenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
