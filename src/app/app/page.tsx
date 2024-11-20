import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { BirthdayProvider } from "./contexts/birthday-page-context";
import { BirthdayContent } from "./components/birthday-content";
import UserButton from "@/components/user-button";

export default function BirthDayListPage() {
  return (
    <BirthdayProvider>
      <AppSidebar>
        <div className="flex h-screen flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-xl font-semibold">Aniversários</h1>
            </div>
            <UserButton></UserButton>
          </header>
          <div className="flex bg-background flex-grow ">
            <div className="flex-1 p-4 md:p-6 ">
              <BirthdayContent></BirthdayContent>
            </div>
          </div>
        </div>
      </AppSidebar>
    </BirthdayProvider>
  );
}
