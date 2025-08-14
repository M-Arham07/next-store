"use client";
import useNotification from "@/hooks/useNotification";
import { useEffect, useState } from "react";
import { z } from "zod";
import RejectOrder from "@/backend-utilities/order-related/RejectOrder";
import UpdateOrderStatus from "@/backend-utilities/order-related/UpdateOrderStatus";
import UpdateStatusDialog from "@/components/admin/adminorderpage/UpdateStatusDialog";









export default function useOrderManager() {


    const [currentOrder, setCurrentOrder] = useState({});
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelReasonError, setCancelReasonError] = useState("");
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorDialogMsg, setErrorDialogMsg] = useState("");
    const [statusLoading, setStatusLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);

    const { showNotification, notify } = useNotification(3000);




    const statusFlow = ["processing", "confirmed", "shipped", "out for delivery", "delivered"];
    // Find the next status
    const currentStatusIndex = statusFlow.indexOf(currentOrder?.status);
    const nextStatus =
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
                notify();
            } else {
                setErrorDialogMsg("Failed to update order status. Please try again.");
                setErrorDialogOpen(true);
            }
        }
        setStatusDialogOpen(false);
    }





    const handleRejectOrder = async () => {
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
        notify,

        // STATE TO SET CURRENT ORDER:
        setCurrentOrder,
        
        
        //VALUES:
        nextStatus,
        cancelReasonError,
        handleRejectOrder,
        handleUpdateStatus

    }








}