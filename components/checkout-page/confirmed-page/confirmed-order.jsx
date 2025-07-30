"use client"
import { useState, useRef } from "react"
import { CheckCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function OrderConfirmedPage({ orderId }) {
 
  const [copySuccess, setCopySuccess] = useState("")
  const [copyDisabled, setCopyDisabled] = useState(false)
  const textAreaRef = useRef(null)

  const handleCopyClick = async () => {
    if (!orderId) return
    let success = false
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(orderId)
        success = true
      } catch {}
    }
    // Fallback: use a visible, off-screen textarea and select/focus it
    if (!success && textAreaRef.current) {
      textAreaRef.current.value = orderId
      textAreaRef.current.style.position = "fixed"
      textAreaRef.current.style.top = "0"
      textAreaRef.current.style.left = "0"
      textAreaRef.current.style.width = "1px"
      textAreaRef.current.style.height = "1px"
      textAreaRef.current.style.opacity = "0.01"
      textAreaRef.current.readOnly = false
      textAreaRef.current.focus()
      textAreaRef.current.select()
      try {
        success = document.execCommand("copy")
      } catch {}
      textAreaRef.current.readOnly = true
    }
    if (success) {
      setCopySuccess("Copied!")
      setCopyDisabled(true)
      setTimeout(() => {
        setCopySuccess("")
        setCopyDisabled(false)
      }, 2000)
    } else {
      setCopySuccess("Failed to copy!")
    }
  }

  return (
    <div className="min-h-[20rem] bg-background flex items-center justify-center">
      <textarea ref={textAreaRef} aria-hidden="true" readOnly className="sr-only" />
      <Card className="w-full max-w-md bg-card text-foreground rounded-xl shadow-lg text-center py-12 px-6">
        <CardContent className="space-y-6">
          <div className="flex justify-center items-center">
            <CheckCircle className="w-24 h-24 text-green-500 animate-tick-bounce" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Order Confirmed!</h1>
          {orderId && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground text-lg font-semibold">
                Your Order ID is: <span className="text-primary">{orderId}</span>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyClick}
                disabled={copyDisabled}
                className="flex items-center gap-1 bg-transparent rounded-md shadow-sm"
              >
                <Copy className="w-4 h-4" />
                {copySuccess || "Copy ID"}
              </Button>
            </div>
          )}
          <p className="text-muted-foreground text-lg">
            Your order has been successfully placed and will be delivered soon.
          </p>
          <Link href="/" passHref>
            <Button className="w-full mt-6 rounded-lg shadow-md">Continue Shopping</Button>
          </Link>
          {orderId && (
            <Link href={`/orders`} passHref>
              <Button variant="secondary" className="w-full mt-4 rounded-lg shadow-md">
                Track Order
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
      <style jsx>
        {`
        @keyframes tick-bounce {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          75% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-tick-bounce {
          animation: tick-bounce 5s ease-out forwards;
        }
      `}
      </style>
    </div>
  )
}
