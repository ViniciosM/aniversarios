"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icons } from "@/components/ui/icons";
import { toast } from "@/hooks/use-toast";
import { Birthday } from "@/app/domain/entities";
import { BirthdayService } from "../service/birthday-service";
import { AppServerError } from "@/app/domain/erros";

type FormBirthdayData = {
  id?: number;
  name: string;
  relationship: string;
  observation?: string;
  date: Date;
};

const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  relationship: yup.string().required("Relacionamento é obrigatório"),
  observation: yup.string().optional(),
  date: yup.date().required("Data é obrigatória"),
});

export default function Component({
  children,
  initialData,
  onBirthdayDataCreated,
  onBirthdayDataUpdated,
}: {
  children?: React.ReactNode;
  initialData?: FormBirthdayData;
  onBirthdayDataCreated?: (data: Birthday) => void;
  onBirthdayDataUpdated?: (data: Birthday) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormBirthdayData>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      id: undefined,
      name: "",
      relationship: "",
      observation: "",
      date: undefined,
    },
  });

  const onSubmit = async (data: FormBirthdayData) => {
    setIsLoading(true);

    if (initialData) {
      await changeBirthday(data);
    } else {
      await createBirthday(data);
    }

    setIsLoading(false);
  };

  const changeBirthday = async (data: FormBirthdayData) => {
    const result = await BirthdayService.update(data);
    if (result instanceof AppServerError) {
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: "Não foi possível atualizar o aniversário.",
        duration: 3000,
      });
    } else {
      setOpen(false);
      onBirthdayDataUpdated?.(result);
    }
  };

  const createBirthday = async (data: FormBirthdayData) => {
    const result = await BirthdayService.create(data);
    if (result instanceof AppServerError) {
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: "Não foi possível criar o aniversário.",
        duration: 3000,
      });
      return;
    } else {
      setOpen(false);
      onBirthdayDataCreated?.(result);
    }
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      reset(initialData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Atualizar Aniversário" : "Novo Aniversário"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  disabled={isLoading}
                  className={cn(
                    "h-10",
                    errors.name && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              )}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      disabled={isLoading}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                        errors.date &&
                          "border-red-500 focus-visible:ring-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        field.value.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(newDate) => {
                        field.onChange(newDate);
                        setIsCalendarOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <span className="text-red-500 text-sm">
                {errors.date.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="relationship">O que essa pessoa é sua?</Label>
            <Controller
              name="relationship"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="relationship"
                  disabled={isLoading}
                  className={cn(
                    "h-10",
                    errors.relationship &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              )}
            />
            {errors.relationship && (
              <span className="text-red-500 text-sm">
                {errors.relationship.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="observation">Observação (Opcional)</Label>
            <Controller
              name="observation"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="observation"
                  disabled={isLoading}
                  placeholder="Escreva características e gostos dessa pessoa"
                  className="min-h-[100px]"
                />
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || (initialData && !isDirty)}
            className="w-full"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {initialData ? "Atualizar" : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
