import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../lib/auth";
import { DatabaseProvider } from "./database-provider";

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
      <SessionProvider refetchOnWindowFocus={false} session={session}>
        <DatabaseProvider>{children}</DatabaseProvider>
      </SessionProvider>
      <Toaster />
    </>
  );
}
