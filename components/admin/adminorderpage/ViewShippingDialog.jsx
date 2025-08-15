"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ViewShippingDialog({ open, onOpenChange, shippingDetails }) {
  if (!shippingDetails) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Shipping Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Delivery Address:</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
              {shippingDetails.address}
            </p>
          </div>
          
          {shippingDetails.landmark && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Landmark:</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                {shippingDetails.landmark}
              </p>
            </div>
          )}

          {shippingDetails.instructions && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Special Instructions:</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                {shippingDetails.instructions}
              </p>
            </div>
          )}

          <div className="pt-4">
            {shippingDetails.googleMapsUrl && (
             <a href={shippingDetails.googleMapsUrl} target="_blank">
             <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4"

              >
                <MapPin className="w-4 h-4 mr-2" />
                View on Google Maps
              </Button>
              </a>
            )}
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between pt-2">
              <div className="text-lg font-bold">Shipping charges:</div>
              <div className="text-lg font-bold">
                ${shippingDetails.deliveryFee}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
  