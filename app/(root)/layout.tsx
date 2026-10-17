// app/(root)/layout.tsx
import { ReactNode, Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

// Create a separate async component for the auth check
async function ProtectedContent({ children }: { children: ReactNode }) {
  const clerkAuth = await auth();
  
  // If no active session/user, redirect to sign-in
  if (!clerkAuth.userId) redirect('/sign-in');

  return <>{children}</>;
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <ProtectedContent>{children}</ProtectedContent>
      </Suspense>
    </main>
  );
}