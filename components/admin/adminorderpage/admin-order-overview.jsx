"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MoreVertical,
  Edit,
  XCircle,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { z } from "zod";
import UpdateOrderStatus from "@/backend-utilities/order-related/UpdateOrderStatus";
import RejectOrder from "@/backend-utilities/order-related/RejectOrder";
import useNotification from "@/hooks/useNotification";
import AlertNotification from "@/components/AlertNotification";

// Accept the current order as a prop
export default function AdminOrderOverview({ currentOrder }) {

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelReasonError, setCancelReasonError] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMsg, setErrorDialogMsg] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  // Notification hook
  const { showNotification, notify } = useNotification(3000);

  // Supported statuses in order
  const statusFlow = ["processing", "confirmed", "shipped", "out for delivery", "delivered"];
  // Find the next status
  const currentStatusIndex = statusFlow.indexOf(currentOrder?.status);
  const nextStatus =
    currentStatusIndex >= 0 && currentStatusIndex < statusFlow.length - 1
      ? statusFlow[currentStatusIndex + 1]
      : null;

  // Hydration-safe order date/time
  const [orderDateTime, setOrderDateTime] = useState("");
  const [deliveredDateTime, setDeliveredDateTime] = useState("");
  useEffect(() => {
    if (currentOrder?.createdAt) {
      setOrderDateTime(
        new Date(currentOrder.createdAt).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }
    if (currentOrder?.deliveredAt) {
      setDeliveredDateTime(
        new Date(currentOrder.deliveredAt).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }
  }, [currentOrder?.createdAt, currentOrder?.deliveredAt]);

  // Status pill colors
  const statusColor = {
    processing:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    confirmed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    shipped:
      "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
    "out-for-delivery":
      "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    delivered:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    cancelled:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };

  // Pricing
  const subtotal = currentOrder?.pricing?.subtotal ?? 0;
  const deliveryFee = currentOrder?.pricing?.deliveryFee ?? 0;
  const codSurcharge = currentOrder?.pricing?.codSurcharge ?? 0;
  const discountAmount = currentOrder?.pricing?.discount?.discountedAmount ?? 0;
  const promoCode = currentOrder?.pricing?.discount?.promoCode;
  const total = currentOrder?.pricing?.total ?? 0;

  // Zod schema for cancel reason
  const cancelReasonSchema = z.string().min(10, "Reason must be at least 10 characters");

  function handleCancelReasonChange(e) {
    const value = e.target.value;
    setCancelReason(value);
    try {
      cancelReasonSchema.parse(value);
      setCancelReasonError("");
    } catch (err) {
      setCancelReasonError(err.errors?.[0]?.message || "Cancel Reason must be atleast 10 characters");
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10 bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 flex justify-center items-center">
          <div className="w-full flex flex-col items-center">
            {/* Card for Order Id, Date, and Status */}
            <Card className="backdrop-blur-lg bg-white/60 dark:bg-black/50 border border-slate-200/20 dark:border-slate-700/30 shadow-md rounded-xl p-6 flex flex-col sm:flex-row items-center justify-center gap-6 mb-3 w-full max-w-xl">
              <div className="flex flex-col gap-3 items-center sm:items-start">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-center sm:items-start">
                  <span className="uppercase font-semibold text-base sm:text-lg text-black dark:text-white tracking-wide font-sans">
                    Order Id:
                  </span>
                  <span className="font-semibold text-base sm:text-lg text-black dark:text-white font-mono tracking-tight">
                    {currentOrder?.orderId}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-center sm:items-start">
                  <span className="uppercase font-semibold text-base sm:text-lg text-black whitespace-nowrap dark:text-white tracking-wide font-sans">
                    Order Date:
                  </span>
                  {/* Date/time on next line for small screens */}
                  <span className="font-semibold text-base md:whitespace-nowrap sm:text-lg text-black dark:text-white font-mono tracking-tight sm:ml-2">
                    <span className="block sm:inline">{orderDateTime.toLocaleUpperCase()}</span>
                  </span>
                </div>
              </div>
              <Badge
                className={`py-2 px-3 rounded-lg text-xs mt-2 sm:mt-0 ${statusColor[currentOrder?.status] || statusColor.processing}`}
              >
                {currentOrder?.status
                  ?.replace(/-/g, " ")
                  ?.replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
            </Card>
            {/* Update Status and Cancel buttons or Delivered Pill */}
            {currentOrder?.status === "delivered" ? (
              <div className="w-full flex justify-center items-center mt-4">
                <div
                  className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-lg bg-green-400/30 dark:bg-green-700/30 border border-green-300/40 dark:border-green-800/40"
                  style={{
                    boxShadow: "0 8px 32px 0 rgba(34,197,94,0.25)",
                    border: "1.5px solid rgba(34,197,94,0.18)",
                  }}
                >
                  <div className="flex items-center gap-2 justify-center w-full">
                    <CheckCircle className="w-8 h-8 text-green-600 drop-shadow-lg" />
                    <span className="text-lg sm:text-xl font-semibold text-green-900 dark:text-green-200 tracking-wide text-center">
                      This order was delivered at:
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-mono text-green-900 dark:text-green-200 mt-1 sm:mt-0 text-center w-full">
                    {deliveredDateTime
                      ? deliveredDateTime.toLocaleUpperCase()
                      : orderDateTime.toLocaleUpperCase()}
                  </span>
                </div>
              </div>
            ) : currentOrder?.status === "cancelled" ? (
              <div className="w-full flex justify-center items-center mt-4">
                <div
                  className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-lg bg-red-400/30 dark:bg-red-700/30 border border-red-300/40 dark:border-red-800/40"
                  style={{
                    boxShadow: "0 8px 32px 0 rgba(239,68,68,0.25)",
                    border: "1.5px solid rgba(239,68,68,0.18)",
                  }}
                >
                  <div className="flex items-center gap-2 justify-center w-full">
                    <XCircle className="w-8 h-8 text-red-600 drop-shadow-lg" />
                    <span className="text-lg sm:text-xl font-semibold text-red-900 dark:text-red-200 tracking-wide text-center">
                      This order was cancelled at:
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-mono text-red-900 dark:text-red-200 mt-1 sm:mt-0 text-center w-full">
                    {(currentOrder.cancelledAt
                      ? new Date(currentOrder.cancelledAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                      : orderDateTime
                    ).toLocaleUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-2 items-center justify-center w-full max-w-xs sm:max-w-md">
                <Button
                  onClick={() => setStatusDialogOpen(true)}
                  className="w-1/2 min-w-[120px] max-w-[180px]"
                  disabled={!nextStatus}
                >
                  Update Status
                </Button>
                <Button
                  variant="destructive"
                  className="w-1/2 min-w-[120px] max-w-[180px]"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Reject Order
                </Button>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-6">
          {/* Left column */}
          <motion.aside
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Card className="backdrop-blur-md bg-white/60 dark:bg-black/50 border border-slate-200/20 dark:border-slate-700/30 shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="px-5 py-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-2xl">Order Details</h3>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-5 py-2 space-y-4">
                {/* Customer */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-11 h-11 ring-1 ring-slate-900/5 dark:ring-white/5">
                    {/* No avatar image in provided object, fallback to initials */}
                    <AvatarFallback>
                      {currentOrder?.customerDetails?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold text-bold">
                      {currentOrder?.customerDetails?.name}
                    </div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {currentOrder?.customerDetails?.email}
                    </div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {currentOrder?.customerDetails?.phone}
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="rounded-xl p-3 bg-blue-50/70 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/40 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                      Shipping
                    </div>
                    <div className="text-sm font-bold text-blue-700 dark:text-blue-300">
                      ${deliveryFee}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {currentOrder?.deliveryDetails?.address}
                    </span>
                    {currentOrder?.deliveryDetails?.googleMapsUrl && (
                      <a
                        href={currentOrder.deliveryDetails.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-xs font-medium text-blue-700 dark:text-blue-200 transition"
                      >
                        <MapPin className="w-4 h-4" />
                        View Location
                      </a>
                    )}
                  </div>
                  {currentOrder?.deliveryDetails?.instructions && (
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Instructions:</span> {currentOrder.deliveryDetails.instructions}
                    </div>
                  )}
                  {currentOrder?.deliveryDetails?.landmark && (
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Landmark:</span> {currentOrder.deliveryDetails.landmark}
                    </div>
                  )}
                </div>

                {/* Call and Email buttons */}
                <div className="flex gap-3 mt-2 justify-center">
                  <a
                    href={`tel:${currentOrder?.customerDetails?.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      type="button"
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call Customer
                    </Button>
                  </a>
                  <a
                    href={`mailto:${currentOrder?.customerDetails?.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email Customer
                    </Button>
                  </a>
                </div>

                <Separator />

                {/* Payment */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Payment</div>
                  <div className="text-sm font-medium">
                    {currentOrder?.paymentDetails?.method === "cod"
                      ? "Cash on Delivery"
                      : currentOrder?.paymentDetails?.method}
                  </div>
                </div>
                {currentOrder?.paymentDetails?.codSurcharge ? (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500 dark:text-slate-400">COD Surcharge</div>
                    <div className="text-sm font-medium">${currentOrder.paymentDetails.codSurcharge}</div>
                  </div>
                ) : null}

                {/* Totals */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Subtotal</div>
                  <div className="text-sm font-medium">${subtotal.toFixed(2)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Discount</div>
                  <div className="text-sm font-medium text-green-600">
                    -${discountAmount.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Promo Code</div>
                  <div className="text-sm font-medium">{promoCode || "—"}</div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100/40 dark:border-slate-700/30">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Total</div>
                  <div className="text-xl font-bold">${total}</div>
                </div>
              </CardContent>
            </Card>
          </motion.aside>

          {/* Right column */}
          <main>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card className="rounded-2xl overflow-hidden shadow-lg backdrop-blur-md bg-white/50 dark:bg-black/40 border border-slate-200/10">
                <CardHeader className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">Ordered Items</h2>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                      {currentOrder?.orderedItems?.length || 0} products
                    </p>
                  </div>
                  <Button variant="ghost" className="px-3 py-2">
                    <Edit className="w-4 h-4" />
                  </Button>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Items List */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">Product</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentOrder?.orderedItems?.map((it) => (
                          <TableRow key={it._id}>
                            <TableCell>
                              <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                                <Image
                                  src={it.images?.[0] || ""}
                                  alt={it.title}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{it.title}</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>${it.price.toFixed(2)}</TableCell>
                            <TableCell className="font-semibold">
                              ${it.price.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Payment & Actions */}
                  <div className="p-4 sm:p-6 border-t border-slate-100/10 dark:border-slate-700/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div />
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Tooltip content="Cancel currentOrder">
                        <Button variant="ghost" className="px-3 py-2">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Update Confirmation Dialog */}
              <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {nextStatus ? (
                        <div className="flex flex-col items-start gap-2">
                          <span className="text-base text-black dark:text-white">
                            Are you sure you want to update the status to:
                          </span>
                          <span
                            className="font-bold text-2xl text-black dark:text-white px-2 py-1 rounded"

                          >
                            {nextStatus.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())} ?
                          </span>
                        </div>
                      ) : (
                        <span className="text-black dark:text-white">No further status available</span>
                      )}
                    </DialogTitle>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setStatusDialogOpen(false)}
                      disabled={statusLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        if (nextStatus) {
                          setStatusLoading(true);
                          const isUpdated = await UpdateOrderStatus(currentOrder.orderId, nextStatus);
                          setStatusLoading(false);
                          if (isUpdated) {
                            notify();
                          } else {
                            setErrorDialogMsg("Failed to update order status. Please try again.");
                            setErrorDialogOpen(true);
                          }
                        }
                        setStatusDialogOpen(false);
                      }}
                      disabled={!nextStatus || statusLoading}
                    >
                      {statusLoading ? "Updating..." : "Yes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Delete Confirmation Dialog */}
              <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Reject Order"
                description={
                  <>
                    <span>
                      Are you sure you want to reject this order? This action cannot be undone.
                    </span>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-black dark:text-white mb-1">
                        Cancel Reason <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        className="w-full border rounded-md p-2 text-black dark:text-white bg-white dark:bg-black"
                        rows={3}
                        value={cancelReason}
                        onChange={handleCancelReasonChange}
                        placeholder="Please enter the reason for cancellation (min 10 characters)"
                      />
                      {cancelReasonError && (
                        <div className="text-red-600 text-xs mt-1">{cancelReasonError}</div>
                      )}
                    </div>
                  </>
                }
                actionName={rejectLoading ? "Rejecting..." : "Reject"}
                onConfirm={async () => {
                  if (!cancelReasonError && cancelReason.length >= 10) {
                    setRejectLoading(true);
                    const isRejected = await RejectOrder(currentOrder.orderId, cancelReason);
                    setRejectLoading(false);
                    if (isRejected) {
                      notify();
                      setDeleteDialogOpen(false);
                      setCancelReason("");
                    } else {
                      setErrorDialogMsg("Failed to reject order. Please try again.");
                      setErrorDialogOpen(true);
                    }
                  }
                }}
                actionDisabled={!!cancelReasonError || cancelReason.length < 10 || rejectLoading}
              />
              <DeleteConfirmationDialog
                open={errorDialogOpen}
                onOpenChange={setErrorDialogOpen}
                title="Error"
                description={errorDialogMsg}
                actionName="Close"
                onConfirm={() => setErrorDialogOpen(false)}
                actionDisabled={false}
              />
            </motion.div>
          </main>
        </div>
        {showNotification && (
          <AlertNotification
            message={`Order ${currentOrder.status === "cancelled" ? "cancelled" : `updated to ${currentOrder.status}`} successfully!`}
            linkName=""
            linkHref="#"
          />
        )}
      </div>
    </div>
  );
}
