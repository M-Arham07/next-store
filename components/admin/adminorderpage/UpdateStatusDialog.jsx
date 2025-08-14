"use client";

import { OrderManagerContext } from "@/contexts/OrderManagerProvider";
import { useContext } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function UpdateStatusDialog() {


    const { 
        statusDialogOpen,
        setStatusDialogOpen,
        nextStatus,
        statusLoading,
        handleUpdateStatus
    } = useContext(OrderManagerContext);


    return (

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
                        onClick={handleUpdateStatus}
                        disabled={!nextStatus || statusLoading}
                    >
                        {statusLoading ? "Updating..." : "Yes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}