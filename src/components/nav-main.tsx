"use client";

import {} from "@/components/ui/collapsible";
import { BirthdayDetailsForm } from "../app/app/components/birthday-details-form";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Gift, Home, Plus } from "lucide-react";
import { useBirthdayContext } from "@/app/app/contexts/birthday-page-context";
import { useState } from "react";

export function NavMain() {
  const { addBirthday } = useBirthdayContext();

  const [isBirthdayFormOpen, setIsBirthdayFormOpen] = useState(false);
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={true}>
              <a href="#">
                <Home className="mr-2 h-4 w-4" />
                Início
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <BirthdayDetailsForm
              onBirthdayDataCreated={(data) => addBirthday(data)}
              isOpen={isBirthdayFormOpen}
              onOpenChange={setIsBirthdayFormOpen}
            >
              <SidebarMenuButton asChild>
                <a href="#">
                  {" "}
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Aniversário
                </a>
              </SidebarMenuButton>
            </BirthdayDetailsForm>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                {" "}
                <Gift className="mr-2 h-4 w-4" />
                Recomendar Presentes
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
