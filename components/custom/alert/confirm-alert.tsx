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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { useState } from "react";

type ConfirmAlertDialogProps = {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  onSubmit?: () => void;
};
export default function ConfirmAlertDialog({
  trigger,
  title,
  description,
  confirmText,
  onSubmit = () => {},
}: ConfirmAlertDialogProps) {
  const [isConfirm, setIsConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="p-3">
        <AlertDialogHeader>
          <section className="flex justify-between items-start gap-2">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogCancel
              className="border-0 shadow-none hover:bg-transparent focus:ring-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </AlertDialogCancel>
          </section>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <Separator />
        <Input
          placeholder={`Type '${confirmText}' to continue`}
          className="my-2"
          onChange={(e) => {
            if (e.target.value === confirmText) {
              setIsConfirm(true);
            } else {
              setIsConfirm(false);
            }
          }}
        />
        <Button
          variant="destructive"
          onClick={() => {
            onSubmit();
            setIsOpen(false);
          }}
          disabled={!isConfirm}
        >
          Confirm
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
