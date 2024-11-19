import { Toaster } from "@/components/ui/toaster";
import { SupabaseProvider } from "./supabase-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../../auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user) {
    session.user = {
      address: "",
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  return (
    <>
      <SessionProvider session={session}>
        <SupabaseProvider>{children}</SupabaseProvider>
      </SessionProvider>
      <Toaster />
    </>
  );
}
