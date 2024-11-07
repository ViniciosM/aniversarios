"use client";

import * as React from "react";
import { BookOpen, Bot, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Início",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Adicionar Novo",
      url: "#",
      icon: Bot,
    },
    {
      title: "Recomendar Presentes",
      url: "#",
      icon: BookOpen,
    },
  ],
};

interface AppSidebarProps {
  children?: React.ReactNode;
}

export function AppSidebar({ children }: AppSidebarProps) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h2 className="font-semibold mb-4 mx-2 mt-6">Aniversários</h2>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
