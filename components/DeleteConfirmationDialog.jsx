"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Accepts actionDisabled prop to disable action button
export default function DeleteConfirmationDialog({open,onOpenChange,title,description,actionName,onConfirm,actionDisabled = false}) {

    return <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                {typeof description === "string" ? (
                  <AlertDialogDescription>{description}</AlertDialogDescription>
                ) : (
                  <>{description}</>
                )}
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={onConfirm}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={actionDisabled}
                >
                    {actionName}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

}