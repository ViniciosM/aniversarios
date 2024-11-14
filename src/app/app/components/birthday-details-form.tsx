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
import { toast } from "@/hooks/use-toast";
import { Birthday } from "@/app/domain/entities";
import {
  BirthdayService,
  UpdateBirthdayData,
} from "../service/birthday-service";
import { AppServerError } from "@/app/domain/erros";

import { ptBR } from "date-fns/locale";
import { CalendarCustom } from "@/components/ui/calendar-custom";
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

interface BirthdayFormDialogProps {
  children?: React.ReactNode;
  initialData?: FormBirthdayData;
  onBirthdayDataCreated?: (data: Birthday) => void;
  onBirthdayDataUpdated?: (data: Birthday) => void;
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BirthdayDetailsForm({
  children,
  initialData,
  onBirthdayDataCreated,
  onBirthdayDataUpdated,
  isOpen,
  onOpenChange,
}: BirthdayFormDialogProps) {
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

    if (initialData !== undefined && initialData.id) {
      await changeBirthday(data);
    } else {
      await createBirthday(data);
    }

    setIsLoading(false);
  };

  const changeBirthday = async (data: FormBirthdayData) => {
    const updateData = await createUpdatedBirthdayData(data);
    if (updateData === undefined) {
      onOpenChange?.(false);
      return;
    }
    const result = await BirthdayService.update(updateData);
    if (result instanceof AppServerError) {
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: "Não foi possível atualizar o aniversário.",
        duration: 3000,
      });
    } else {
      onOpenChange?.(false);
      onBirthdayDataUpdated?.(result);
    }
  };

  const createUpdatedBirthdayData = async (data: FormBirthdayData) => {
    if (data.id === undefined) return;
    const updateData: UpdateBirthdayData = { id: data.id! };

    if (data.name !== initialData?.name) {
      updateData.name = data.name;
    }

    if (data.date.toISOString() !== initialData?.date.toISOString()) {
      updateData.date = data.date.toISOString();
    }

    if (data.relationship !== initialData?.relationship) {
      updateData.relationship = data.relationship;
    }

    if (data.observation !== initialData?.observation) {
      updateData.observation = data.observation;
    }

    return updateData;
  };

  const createBirthday = async (data: FormBirthdayData) => {
    const result = await BirthdayService.create({
      name: data.name,
      relationship: data.relationship,
      observation: data.observation,
      date: data.date.toISOString(),
      user_id: "efe5ffea-3c3a-4168-8853-ccac1191125d",
    });
    if (result instanceof AppServerError) {
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: "Não foi possível criar o aniversário.",
        duration: 3000,
      });
      return;
    } else {
      onOpenChange?.(false);
      onBirthdayDataCreated?.(result);
      return;
    }
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
