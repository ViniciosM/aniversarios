"use client";
import { createContext, useContext, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Database } from "@/lib/database/database";
import { AppConfig } from "@/lib/app.config";

const DatabaseContext = createContext<Database | null>(null);

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();

  const database = useMemo(() => {
    const db = new AppConfig.database();
    db.connect({
      customAccessToken: session?.supabaseAccessToken ?? "",
    });
    return db;
  }, [session]);

  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): Database => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
