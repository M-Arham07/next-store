"use client";

import { OrderManagerContext } from "@/contexts/OrderManagerProvider";
import { useContext } from "react";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";



export default function RejectOrderDialog() {

    const {
        deleteDialogOpen,
        setDeleteDialogOpen,
        cancelReason,
        cancelReasonError,
        handleCancelReasonChange,
        rejectLoading,
        handleRejectOrder
    } = useContext(OrderManagerContext);


    return (
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
            onConfirm={handleRejectOrder}
            actionDisabled={!!cancelReasonError || cancelReason.length < 10 || rejectLoading}
        />

    )

}