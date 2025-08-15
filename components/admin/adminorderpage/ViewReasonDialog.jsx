"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock } from "lucide-react";

export default function CancelReasonDialog({ open, onOpenChange, cancelDetails }) {
  if (!cancelDetails) return null;

  const cancelDate = new Date(cancelDetails.cancelledAt);
  const formattedDate = cancelDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = cancelDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancellation Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Calendar className="w-4 h-4" />
            Cancellation Date:
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Clock className="w-4 h-4" />
            Cancellation Time:
            <span>{formattedTime}</span>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Reason:</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
              {cancelDetails.reason || "No reason provided"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
