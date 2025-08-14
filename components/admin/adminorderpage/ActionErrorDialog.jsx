"use client";

import { OrderManagerContext } from "@/contexts/OrderManagerProvider";
import { useContext } from "react";

export default function ActionErrorDialog() {

    const {
        errorDialogOpen,
        setErrorDialogOpen,
        errorDialogMsg,
    } = useContext(OrderManagerContext);

    return (
        <DeleteConfirmationDialog
            open={errorDialogOpen}
            onOpenChange={setErrorDialogOpen}
            title="Error"
            description={errorDialogMsg}
            actionName="Close"
            onConfirm={() => setErrorDialogOpen(false)}
            actionDisabled={false}
        />
    );
}