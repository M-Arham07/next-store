"use client";
import useNotification from "@/hooks/useNotification";
import { useEffect, useState } from "react";
import { z } from "zod";
import RejectOrder from "@/backend-utilities/order-related/RejectOrder";
import UpdateOrderStatus from "@/backend-utilities/order-related/UpdateOrderStatus";










export default function useOrderManager() {

    // SET CURRENT ORDER:
    const [currentOrder, setCurrentOrder] = useState({});

    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelReasonError, setCancelReasonError] = useState("");
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorDialogMsg, setErrorDialogMsg] = useState("");
    const [statusLoading, setStatusLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
    const [shippingDialogOpen, setShippingDialogOpen] = useState(false);

    const { showNotification, notify } = useNotification(3000);




    const statusFlow = ["processing", "confirmed", "shipped", "out for delivery", "delivered"];
    // Find the next status
    const currentStatusIndex = statusFlow.indexOf(currentOrder?.status);
    let nextStatus =
        currentStatusIndex >= 0 && currentStatusIndex < statusFlow.length - 1
            ? statusFlow[currentStatusIndex + 1]
            : null;









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


    const handleUpdateStatus = async () => {


        if (nextStatus) {
            setStatusLoading(true);
            const isUpdated = await UpdateOrderStatus(currentOrder.orderId, nextStatus);
            setStatusLoading(false);
            if (isUpdated) {
                setCurrentOrder((prev) => ({ ...prev, status: nextStatus }));
                notify();
            } else {
                setErrorDialogMsg("Failed to update order status. Please try again.");
                setErrorDialogOpen(true);
            }
        }
        setStatusDialogOpen(false);
    }





    const handleRejectOrder = async (canceller) => {
        if (!cancelReasonError && cancelReason.length >= 10) {
            setRejectLoading(true);

            //set Cancelled by to admin:

            const isRejected = await RejectOrder(currentOrder.orderId, cancelReason, canceller);
            setRejectLoading(false);
            if (isRejected) {
                setCurrentOrder((prev) => ({ ...prev, status: "cancelled" }))
                notify();
                setDeleteDialogOpen(false);
                setCancelReason("");
            } else {
                setErrorDialogMsg("Failed to reject order. Please try again.");
                setErrorDialogOpen(true);
            }
        }
    }

    return {

        // STATES:
        statusDialogOpen,
        setStatusDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        cancelReason,
        setCancelReason,
        handleCancelReasonChange,
        errorDialogOpen,
        setErrorDialogOpen,
        errorDialogMsg,
        setErrorDialogMsg,
        statusLoading,
        setStatusLoading,
        rejectLoading,
        setRejectLoading,
        shippingDialogOpen, setShippingDialogOpen,
        reasonDialogOpen, setReasonDialogOpen,
        notify, showNotification,

        // STATE TO SET CURRENT ORDER:
        currentOrder,
        setCurrentOrder,


        //VALUES:
        nextStatus,
        cancelReasonError,
        handleRejectOrder,
        handleUpdateStatus

    }








}