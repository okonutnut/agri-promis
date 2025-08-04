"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

type CustomAlertDialogProps = {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose?: () => void;
};
export default function CustomAlertDialog({
  trigger,
  title,
  description,
  children,
  onClose,
}: CustomAlertDialogProps) {
  return (
    <AlertDialog onOpenChange={onClose}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <section className="flex justify-between items-start gap-2">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogCancel className="border-0 shadow-none hover:bg-transparent focus:ring-0">
              <X className="h-4 w-4" />
            </AlertDialogCancel>
          </section>
          <AlertDialogDescription>
            {description ||
              "Are you sure you want to delete this item? This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
}
