import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  onDelete: () => Promise<void>;
  itemName: string;
  trigger?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteConfirmationDialog({
  onDelete,
  itemName,
  trigger,
  isOpen,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete();
    } catch (error) {
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg w-[90%] sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você tem certeza em deletar esse(a) {itemName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso irá deletar permanentemente
            o(a) {itemName} do seus dados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deletando..." : "Deletar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
