import { ArrowRightIcon, CircleCheckIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link";

function Alert({ message, linkName, linkHref }) {
  return (
    // To make the notification fixed, add classes like `fixed bottom-4 right-4` to the container element.
    <div
      className="bg-background z-50 max-w-[400px] rounded-md border px-4 py-3 shadow-lg">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <CircleCheckIcon className="mt-0.5 shrink-0 text-emerald-500" size={16} aria-hidden="true" />
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{message}</p>
            <Link href={linkHref} className="group text-sm font-medium whitespace-nowrap">
              {linkName}
              <ArrowRightIcon
                className="ms-1 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
                size={16}
                aria-hidden="true" />
            </Link>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          aria-label="Close banner">
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export default function AlertNotification({ message, linkName="", linkHref='#' }) {
  return (
    <div className="notification-container fixed bottom-4 left-4">
      <Alert
        message={message}
        linkName={linkName}
        linkHref={linkHref}
      />



      <style jsx>{`
            .notification-container {
              animation: slideUp 0.1s ease-out forwards;
              transform: translateY(100%);
              opacity: 0;
            }

            @keyframes slideUp {
              0% {
                transform: translateY(100%);
                opacity: 0;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}
      </style>
    </div>


  )

}
