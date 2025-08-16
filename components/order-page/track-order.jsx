"use client";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Calendar, Truck, CheckCircle, Inbox, Phone, CreditCard, MapPin, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CancelReasonDialog from "@/components/admin/adminorderpage/CancelReasonDialog";
import RejectOrderDialog from "@/components/RejectOrderDialog";
import AlertNotification from "@/components/AlertNotification";
import { OrderManagerContext } from "@/contexts/OrderManagerProvider";

export default function TrackOrder({ currentOrder }) {
    const [showCancelReason, setShowCancelReason] = useState(false);

    const { showNotification, setDeleteDialogOpen, setCurrentOrder } = useContext(OrderManagerContext);

    useEffect(() => {
        console.log("current order", currentOrder)
        setCurrentOrder(currentOrder)
    }, [currentOrder])




    // Supported steps
    const statusSteps = [
        "processing",
        "confirmed",
        "shipped",
        "out for delivery",
        "delivered",
        "cancelled"
    ];

    const statusLabels = {
        processing: "Processing",
        confirmed: "Order Confirmed",
        shipped: "Shipped",
        "out for delivery": "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled"
    };

    // Find current step index based on status (case-insensitive)
    const currentStep = statusSteps.findIndex(
        s => s.toLowerCase() === (currentOrder.status || "").toLowerCase()
    );

    // Steps for progress bar
    const steps = [
        { key: "processing", label: "Processing", icon: CheckCircle, desc: "Your order is being prepared." },
        { key: "confirmed", label: "Order Confirmed", icon: CheckCircle, desc: "We received your order and it is being processed by our team." },
        { key: "shipped", label: "Shipped", icon: Truck, desc: "Your package has left the warehouse and is on its way." },
        { key: "out for delivery", label: "Out for Delivery", icon: Inbox, desc: "The courier has your package and will deliver it today." },
        { key: "delivered", label: "Delivered", icon: Calendar, desc: "The package was delivered to the provided address." },
    ];

    const statusMap = {
        processing: { dotBg: "bg-blue-500", dotText: "text-white", ring: "ring-blue-400/30", label: "text-blue-600", pillBg: "bg-blue-50 text-blue-700" },
        confirmed: { dotBg: "bg-emerald-500", dotText: "text-white", ring: "ring-emerald-400/30", label: "text-emerald-600", pillBg: "bg-emerald-50 text-emerald-700" },
        shipped: { dotBg: "bg-emerald-500", dotText: "text-white", ring: "ring-emerald-400/30", label: "text-emerald-600", pillBg: "bg-emerald-50 text-emerald-700" },
        "out for delivery": { dotBg: "bg-emerald-500", dotText: "text-white", ring: "ring-emerald-400/30", label: "text-emerald-600", pillBg: "bg-emerald-50 text-emerald-700" },
        delivered: { dotBg: "bg-emerald-500", dotText: "text-white", ring: "ring-emerald-400/30", label: "text-emerald-600", pillBg: "bg-emerald-50 text-emerald-700" },
        cancelled: { dotBg: "bg-red-500", dotText: "text-white", ring: "ring-red-400/30", label: "text-red-600", pillBg: "bg-red-50 text-red-700" },
    };

    // Payment method mapping
    const paymentMethodMeta = {
        bank: {
            label: "Bank transfer",
            icon: <CreditCard size={18} className="text-blue-600 dark:text-blue-400" />,
            iconBg: "bg-blue-50 dark:bg-blue-950",
            iconFg: "text-blue-600 dark:text-blue-400",
        },
        crypto: {
            label: "Crypto",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-600 dark:text-amber-400">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="currentColor" />
                </svg>
            ),
            iconBg: "bg-amber-50 dark:bg-amber-950",
            iconFg: "text-amber-600 dark:text-amber-400",
        },
        cod: {
            label: "Cash on Delivery",
            icon: <Truck size={18} className="text-emerald-600 dark:text-emerald-400" />,
            iconBg: "bg-emerald-50 dark:bg-emerald-950",
            iconFg: "text-emerald-600 dark:text-emerald-400",
        },
    };

    const method = paymentMethodMeta[currentOrder.paymentDetails?.method] || paymentMethodMeta.bank;

    // CUSTOMER SUPPORT DETAILS:
    const telLink = `tel:${process.env.NEXT_PUBLIC_SUPPORT_NUMBER}`;
    const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP}`;


    // ESTIMATED DATE:
    const createdDate = new Date(currentOrder.createdAt);
    const estimatedDate = new Date(createdDate);
    estimatedDate.setDate(createdDate.getDate() + 5);
    const cancelledDate = currentOrder.cancelledAt ? new Date(currentOrder.cancelledAt) : null;

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateWithTime = (date) => {
        return date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const estimatedDateStr = formatDate(estimatedDate);
    const createdDateStr = formatDateWithTime(createdDate);
    const cancelledDateStr = cancelledDate ? formatDateWithTime(cancelledDate) : null;

    // Pricing
    const subtotal = currentOrder.pricing?.subtotal || 0;
    const deliveryFee = currentOrder.pricing?.deliveryFee || 0;
    const discountAmount = currentOrder.pricing?.discount?.discountedAmount || 0;
    const codSurcharge = currentOrder.pricing?.codSurcharge || 0;
    const tax = 0; // Not provided in object
    const total = currentOrder.pricing?.total || (subtotal - discountAmount + deliveryFee + codSurcharge + tax);

    return (
        <main className="min-h-screen p-4 md:p-8 bg-background text-foreground">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Banners */}
                {currentOrder.status === "cancelled" ? (
                    <div className="md:col-span-3 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                    <XCircle className="text-red-600" size={24} />
                                </div>
                                <span className="text-lg md:text-xl font-medium text-red-600">
                                    Your order was cancelled
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setShowCancelReason(true)}
                                className="text-red-600 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                            >
                                See Why
                            </Button>
                        </div>
                    </div>
                ) : currentOrder.status === "delivered" && (
                    <div className="md:col-span-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                                <CheckCircle className="text-emerald-600" size={24} />
                            </div>
                            <span className="text-lg md:text-xl font-medium text-emerald-600">
                                Your order was delivered
                            </span>
                        </div>
                    </div>
                )}

                {/* LEFT MAIN */}
                <div className="md:col-span-2 space-y-6 order-1 md:order-1">
                    {/* Header */}
                    <div className="relative overflow-hidden rounded-2xl border border-border">
                        <div className="p-6 flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <h1 className="text-lg md:text-2xl font-semibold">Order ID: {currentOrder.orderId}</h1>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    Order date: {createdDateStr}
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className={cn(
                                        "text-xs md:text-sm font-medium mt-1",
                                        currentOrder.status === "cancelled"
                                            ? "text-red-600 dark:text-red-500"
                                            : "text-emerald-600 dark:text-emerald-400"
                                    )}>
                                        Status: {statusLabels[currentOrder.status] || currentOrder.status}
                                    </p>
                                    {currentOrder.status?.toLowerCase() === "delivered" && (
                                        <span className="flex items-center justify-center ml-2 h-8 w-8 rounded-full border-2 border-green-500 bg-green-500 self-center">
                                            <CheckCircle size={20} className="text-white" />
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs md:text-sm font-medium mt-1">
                                    {currentOrder.status === "cancelled"
                                        ? <span className="text-red-600 dark:text-red-500">Cancelled at: {cancelledDateStr}</span>
                                        : <span className="text-emerald-600 dark:text-emerald-400">
                                            {currentOrder.status === "delivered" ?
                                                `Delivered at ${formatDateWithTime(new Date(currentOrder.deliveredAt))}`
                                                : `Estimated Delivery: ${estimatedDateStr}`}
                                        </span>
                                    }
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Progress */}
                    {currentOrder?.status !== "cancelled" && (<div className="relative overflow-hidden rounded-2xl border border-border">
                        <div className="p-6">
                            <h2 className="text-base font-semibold mb-4">Order Progress</h2>
                            <ul className="flex flex-col space-y-5">
                                {steps.map((step, i) => {
                                    const Icon = step.icon;
                                    const meta = statusMap[step.key] || statusMap.confirmed;
                                    const completed = i < currentStep;
                                    const current = i === currentStep;
                                    const isDelivered = step.key === "delivered" && current;

                                    const dotClass = completed
                                        ? `${meta.dotBg} ${meta.dotText}`
                                        : current
                                            ? `${meta.dotBg} ${meta.dotText} ring-4 ring-offset-2 ${meta.ring}${isDelivered ? "" : " animate-pulse"}`
                                            : `border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900`;

                                    const pill = completed || isDelivered
                                        ? <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">Completed</span>
                                        : current
                                            ? <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">In progress</span>
                                            : <span className="px-2 py-0.5 text-xs rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">Pending</span>;

                                    return (
                                        <li key={step.key} className="flex items-start gap-4">
                                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", dotClass)}>
                                                <Icon size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className={cn("font-medium truncate",
                                                        completed ? "text-foreground" :
                                                            current ? meta.label :
                                                                "text-slate-400 dark:text-slate-500"
                                                    )}>{step.label}</div>
                                                    <div className="shrink-0">{pill}</div>
                                                </div>
                                                <p className={cn("mt-1 text-xs",
                                                    completed || current ? "text-muted-foreground" :
                                                        "text-slate-400 dark:text-slate-500"
                                                )}>{step.desc}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>)}

                    {/* Items */}
                    <div className="relative overflow-hidden rounded-2xl border border-border">
                        <div className="p-6">
                            <h2 className="text-base font-semibold mb-6">Items</h2>
                            <div className="space-y-6">
                                {currentOrder.orderedItems.map((it) => (
                                    <div key={it._id} className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <Image src={it.images?.[0] || "/images/placeholder-device.jpg"} alt={it.title} width={64} height={64} className="object-cover h-full w-full" />
                                        </div>
                                        <div className="flex-1 flex justify-between">
                                            <div>
                                                <div className="font-medium">{it.title}</div>
                                                <div className="text-xs text-muted-foreground">{it.category}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">${it.price.toFixed(2)}</div>
                                                <div className="text-xs text-muted-foreground">Qty: {it.quantity || 1}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <aside className="space-y-4 flex flex-col order-2 md:order-2">

                    {/* Payment & Delivery */}
                    <div className="order-1 md:order-1">
                        <div className="relative overflow-hidden rounded-2xl border border-border min-h-[160px] p-6">
                            <h4 className="text-sm font-semibold mb-3">Payment & Delivery</h4>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-4">
                                    <div className={cn("w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0", method.iconBg)}>
                                        {method.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-muted-foreground">Payment Method</div>
                                        <div className="font-medium">• {method.label}</div>
                                        {currentOrder.paymentDetails?.codSurcharge ? (
                                            <div className="text-xs text-muted-foreground">COD Surcharge: ${currentOrder.paymentDetails.codSurcharge}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-300">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-muted-foreground">Delivery Address</div>
                                        <div className="font-medium">{currentOrder.customerDetails?.name}</div>
                                        <div className="text-xs text-muted-foreground">{currentOrder.deliveryDetails?.address}</div>
                                        {currentOrder.deliveryDetails?.landmark && (
                                            <div className="text-xs text-muted-foreground">Landmark: {currentOrder.deliveryDetails.landmark}</div>
                                        )}
                                        {currentOrder.deliveryDetails?.instructions && (
                                            <div className="text-xs text-muted-foreground">Instructions: {currentOrder.deliveryDetails.instructions}</div>
                                        )}
                                        {currentOrder.deliveryDetails?.googleMapsUrl && (
                                            <a href={currentOrder.deliveryDetails.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline mt-1 block">View on Google Maps</a>
                                        )}
                                        <div className="text-xs mt-1">{currentOrder.customerDetails?.phone}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-2 md:order-2">
                        <div className="relative overflow-hidden rounded-2xl border border-border p-6">
                            <h3 className="text-base font-semibold mb-4">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                {discountAmount > 0 && <div className="flex justify-between"><span className="text-green-600 dark:text-green-500">Discount</span><span className="text-green-600  dark:text-green-500">-${discountAmount.toFixed(2)}</span></div>}
                                <div className="flex justify-between"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
                                {codSurcharge > 0 && <div className="flex justify-between"><span className="text-yellow-600 dark:text-yellow-400">COD Surcharge</span><span className="text-yellow-600 dark:text-yellow-400">+${codSurcharge.toFixed(2)}</span></div>}
                                {/* Tax not provided */}
                                <hr className="my-2" />
                                <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="order-3 md:order-3">
                        <div className="relative overflow-hidden rounded-2xl border border-border p-6">
                            <h3 className="text-base md:text-lg font-semibold mb-3">Need Help?</h3>
                            <div className="flex items-center gap-3">
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-full bg-green-600 text-white flex items-center gap-1.5">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    WhatsApp
                                </a>
                                <a href={telLink} className="px-3 py-2 rounded-full bg-sky-600 text-white flex items-center gap-1.5">
                                    <Phone size={16} />
                                    Call
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Order */}
                    {["processing","confirmed"].includes(currentOrder.status) && 

                    (<div className="order-4 md:order-4">
                        <div className="relative overflow-hidden rounded-2xl border border-border p-6">
                            <h3 className="text-base md:text-lg font-semibold mb-3">Changed your mind?</h3>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                Cancel Order
                            </Button>
                        </div>
                    </div>)}

                </aside>
            </div>

            {/* Cancel Reason Dialog */}
            <CancelReasonDialog
                open={showCancelReason}
                onOpenChange={setShowCancelReason}
                cancelDetails={{
                    cancelledAt: currentOrder.cancelledAt,
                    cancelledBy: currentOrder.cancelledBy === "user" ? "You" : "Admin",
                    reason: currentOrder.cancelReason
                }}
            />


            <RejectOrderDialog canceller="user" />


            {showNotification && <AlertNotification
                message="Your order was cancelled successfully"
                linkName="Shop More"
                linkHref="/products"
            />
            }

        </main>
    );
}
