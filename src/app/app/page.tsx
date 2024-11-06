'use client'

import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

import {  useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import BirthDayCard from "@/components/birthday-card"

interface Birthday {
  id: number,
  name: string
  date: Date
}

export default function BirthDayListPage() {
  const [filter, setFilter] = useState<"all" | "thisMonth">("all")

  const birthdays: Birthday[] = [
    { id: 1, name: "Carol", date: new Date("1999-11-05") },
    { id: 2, name: "Jorge", date: new Date() },
    { id: 3, name: "Maria", date: new Date() },
    { id: 4, name: "Joana", date: new Date() },
    { id: 5, name: "Vinicios", date: new Date() },
    { id: 6, name: "Flavio", date: new Date() }
  ];

  const filterBirthdays = (filter: "all" | "thisMonth") => {
    console.log("chamando");
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    if (filter === "thisMonth") {
      return birthdays.filter(birthday => {
        const birthdayMonth = birthday.date.getMonth();
        const birthdayYear = birthday.date.getFullYear();
        return birthdayMonth === currentMonth && birthdayYear === currentYear;
      });
    }
    return birthdays; 
  };

  const filteredBirthdays = filterBirthdays(filter);



  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">Lista de aniversários</h1>
            <Button variant="ghost" size="icon">
              <User className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex gap-4 mb-6">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filter === "thisMonth" ? "default" : "ghost"}
              onClick={() => setFilter("thisMonth")}
              size="sm"
            >
              Este mês
            </Button>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-4">
              {filteredBirthdays.map((birthday) => (
                <BirthDayCard key={birthday.id} name={birthday.name} brithDayDate={birthday.date} />
              ))}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}