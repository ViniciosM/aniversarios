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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn, minimumDate, todayDate } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icons } from "@/components/ui/icons";
import { ptBR } from "date-fns/locale";
import { CalendarCustom } from "@/components/ui/calendar-custom";
import { useBirthdayContext } from "../contexts/birthday-page-context";
import { useSession } from "next-auth/react";
import {
  createUpdatedBirthdayData,
  parseToUpdateBirthdayData,
} from "../../../lib/database/dtos/update-birthday-dto";

type FormBirthdayData = {
  id?: number;
  name: string;
  relationship: string;
  observation?: string;
  date: Date;
  user_id: string;
};

const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  relationship: yup.string().required("Relacionamento é obrigatório"),
  observation: yup.string().optional(),
  date: yup.date().required("Data é obrigatória"),
  user_id: yup.string().required("Usuário é obrigatório"),
});

interface BirthdayFormDialogProps {
  children?: React.ReactNode;
  initialData?: FormBirthdayData;
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BirthdayDetailsForm({
  children,
  initialData,
  isOpen,
  onOpenChange,
}: BirthdayFormDialogProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { createBirthday, changeBirthday } = useBirthdayContext();

  const session = useSession();

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
      user_id: session.data!.user.id,
    },
  });

  const onSubmit = async (data: FormBirthdayData) => {
    setIsLoading(true);

    if (initialData !== undefined && initialData.id) {
      await updateBirthday(data);
    } else {
      await createBirthday({ ...data, daysToBirthday: 0 }, () => {
        onOpenChange?.(false);
      });
    }
    setIsLoading(false);
  };

  const updateBirthday = async (data: FormBirthdayData) => {
    const updateData = await createUpdatedBirthdayData(
      parseToUpdateBirthdayData({ ...data, id: data.id! }),
      initialData
        ? parseToUpdateBirthdayData({ ...initialData, id: initialData.id! })
        : undefined
    );
    if (updateData === undefined) {
      onOpenChange?.(false);
      return;
    }
    changeBirthday(updateData, () => {
      onOpenChange?.(false);
    });
  };

  const today = todayDate();

  const isDateDisabled = (date: Date) => {
    return date > today || date < minimumDate;
  };

  React.useEffect(() => {
    if (isOpen) {
      reset(initialData);
    }
  }, [isOpen, initialData, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-lg w-[90%] sm:max-w-[425px]">
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
                          timeZone: "UTC",
                        })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarCustom
                      mode="single"
                      captionLayout="dropdown-buttons"
                      locale={ptBR}
                      fromYear={1924}
                      toYear={today.getFullYear()}
                      disabled={isDateDisabled}
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
                  className="min-h-[100px] text-sm"
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
