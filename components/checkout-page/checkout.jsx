"use client"

import {
  MapPin,
  CreditCard,
  Truck,
  AlertCircle,
  Loader2,
  Search,
  CheckCircle,
  XCircle,
  User,
  DollarSign,
  Bitcoin,
  Check,
  X,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import useCheckout from "@/hooks/useCheckout"
import { useEffect } from "react"
import ProgressModal from "@/components/ProgressModal"

export default function CheckoutPage({session}) {
  const router = useRouter()
  const {
    // State
    customerName,
    setCustomerName,
    displayMobileNumber,
    handleMobileNumberChange,
    mobileNumber,
    addressInput,
    handleAddressInputChange,
    confirmedAddress,
    setStreetAddress,
    streetAddress,
    setLandmark,
    landmark,
    setPaymentMethod,
    paymentMethod,
    setDeliveryInstructions,
    deliveryInstructions,
    isProcessing,
    locationError,
    isLoadingLocation,
    addressSuggestions,
    showSuggestions,
    isSearching,
    showConfirmationDialog,
    setShowConfirmationDialog,
    addressInputRef,
    suggestionsRef,
    // PROMOS:
    promoCode,
    setPromoCode,
    promoApplied,
    setPromoApplied,
    promoError,
    setPromoError,
    promoDialogOpen,
    setPromoDialogOpen,
    isApplyingPromo,
    setIsApplyingPromo,
    removePromoCode,
    applyPromoCode,
    // Derived values
    codSurcharge,
    total,
    selectedItems,
    subtotal,
    deliveryFee,
    discountPercentage,
    // Functions
    validateName,
    validateEmail,
    validateMobileNumber,
    handleSuggestionSelect,
    getCurrentLocation,
    handleOrderNow,
    handleConfirmOrder,
    handleRemoveAddress,
    // Error modal:
    errModalOpen,
    setErrModalOpen,
  } = useCheckout()

  useEffect(() => {
    console.log("Current Values are:", {
      discountPercentage,
      promoCode,
      promoApplied,
      promoError,
      promoDialogOpen,
      isApplyingPromo,
    })
  }, [discountPercentage, promoCode, promoApplied, promoError, promoDialogOpen, isApplyingPromo])

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md border border-border/50 bg-card/60 supports-[backdrop-filter]:bg-card/50 supports-[backdrop-filter]:backdrop-blur-sm rounded-xl shadow-sm">
          <CardContent className="text-center py-10">
            <div className="text-muted-foreground mb-5">
              <Truck className="w-14 h-14 mx-auto" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some items to proceed with checkout</p>
            <Button onClick={() => router.push("/products")} className="h-10">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        /* Softer, minimal scrollbar */
        ::-webkit-scrollbar { width: 2px; height: 2px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background-color: hsl(var(--muted-foreground) / 0.25);
          border-radius: 999px;
        }
        ::-webkit-scrollbar-thumb:hover { background-color: hsl(var(--muted-foreground) / 0.4); }
        * { scrollbar-width: thin; scrollbar-color: hsl(var(--muted-foreground) / 0.25) transparent; }

        /* Dialog scroll compensation */
        .dialog-content { padding-right: 8px !important; margin-right: -8px !important; }
        .dialog-content > div { padding-right: 8px !important; }

        .address-suggestions::-webkit-scrollbar {
          width: 1px;
          height: 1px;
        }
        .address-suggestions::-webkit-scrollbar-track {
          background: transparent;
        }
        .address-suggestions::-webkit-scrollbar-thumb {
          background-color: hsl(var(--muted-foreground) / 0.35);
          border-radius: 999px;
        }
        .address-suggestions::-webkit-scrollbar-thumb:hover {
          background-color: hsl(var(--muted-foreground) / 0.5);
        }
        .address-suggestions {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--muted-foreground) / 0.35) transparent;
        }
      `}</style>

      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-border/50 bg-background/70 supports-[backdrop-filter]:bg-background/60 supports-[backdrop-filter]:backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Checkout</h1>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-4 pb-10">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Main */}
            <div className="lg:col-span-7 space-y-6">
              {/* Contact Information */}
              <Card className="border border-border/50 bg-card/60 supports-[backdrop-filter]:bg-card/50 supports-[backdrop-filter]:backdrop-blur-sm rounded-xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name" className="text-sm">
                      Full Name
                    </Label>
                    <Input
                      id="customer-name"
                      placeholder="Enter your full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className={!validateName(customerName) && customerName.length > 0 ? "border-destructive" : ""}
                    />
                    {!validateName(customerName) && customerName.length > 0 && (
                      <p className="text-destructive text-xs">Name must be at least 3 characters.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile-number" className="text-sm">
                      Pakistani Mobile Number
                    </Label>
                    <Input
                      id="mobile-number"
                      type="tel"
                      placeholder="e.g., +923XX-XXXXXXX"
                      value={displayMobileNumber}
                      onChange={handleMobileNumberChange}
                      required
                      className={
                        !validateMobileNumber(mobileNumber) && mobileNumber.length > 3 ? "border-destructive" : ""
                      }
                    />
                    {!validateMobileNumber(mobileNumber) && mobileNumber.length > 3 && (
                      <p className="text-destructive text-xs">
                        Please enter a valid Pakistani mobile number (e.g., +923XX-XXXXXXX, max 15 digits).
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="relative z-30 border border-border/50 bg-card/60 supports-[backdrop-filter]:bg-card/50 supports-[backdrop-filter]:backdrop-blur-sm rounded-xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Delivery Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {locationError && (
                    <Alert variant="destructive" className="rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{locationError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Current Location */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={isLoadingLocation}
                      className="flex-1 bg-transparent hover:bg-muted/60 rounded-lg"
                    >
                      {isLoadingLocation ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Getting Location...
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 mr-2" />
                          Use Current Location
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Address Search */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="address" className="text-sm">
                      Search Delivery Address
                    </Label>
                    <div className="relative">
                      <Input
                        ref={addressInputRef}
                        id="address"
                        placeholder="Start typing your address (e.g., Karachi, Lahore)..."
                        value={addressInput}
                        onChange={(e) => handleAddressInputChange(e.target.value)}
                        className={
                          locationError && !confirmedAddress
                            ? "pr-10 border-destructive focus-visible:ring-destructive"
                            : "pr-10"
                        }
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isSearching ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        ) : (
                          <Search className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {showSuggestions && addressSuggestions.length > 0 && (
                      <div
                        ref={suggestionsRef}
                        className="address-suggestions absolute top-full left-0 right-0 z-50 bg-popover border border-border rounded-lg shadow-md max-h-64 overflow-y-auto mt-1"
                      >
                        {addressSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-muted/60 focus:bg-muted/60 outline-none border-b border-border/40 last:border-b-0"
                            onClick={() => handleSuggestionSelect(suggestion)}
                          >
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{suggestion.display_name.split(",")[0]}</p>
                                <p className="text-xs text-muted-foreground truncate">{suggestion.display_name}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">
                      Select an address from the suggestions. Only locations in Pakistan are supported.
                    </p>
                  </div>

                  {/* Confirmed Address - green soft panel */}
                  {confirmedAddress && (
                    <div className="p-4 rounded-xl border border-emerald-300/60 dark:border-emerald-700/60 bg-emerald-50/60 dark:bg-emerald-900/30 supports-[backdrop-filter]:bg-emerald-50/50 supports-[backdrop-filter]:dark:bg-emerald-900/25 supports-[backdrop-filter]:backdrop-blur-sm shadow-sm">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                              Confirmed Delivery Address
                            </p>
                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                              {confirmedAddress.display_name}
                            </p>
                            <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-1">
                              Coordinates: {confirmedAddress.lat.toFixed(6)}, {confirmedAddress.lon.toFixed(6)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleRemoveAddress}
                          className="text-emerald-800/70 dark:text-emerald-200/80 hover:text-emerald-900 dark:hover:text-emerald-100 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 rounded-full"
                          aria-label="Remove address"
                        >
                          <XCircle className="w-5 h-5" />
                        </Button>
                      </div>

                      <Separator className="my-3 bg-emerald-200/60 dark:bg-emerald-700/60" />

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="street-address" className="text-sm">
                            Street / Building / Flat No. (Optional)
                          </Label>
                          <Input
                            id="street-address"
                            placeholder="e.g., Flat 12, Building A, Main Street"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            className="rounded-lg"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="landmark" className="text-sm">
                            Nearby Landmark (Optional)
                          </Label>
                          <Input
                            id="landmark"
                            placeholder="e.g., Near XYZ Hospital, Opposite Park"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className="rounded-lg"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="instructions" className="text-sm">
                            Delivery Instructions (Optional)
                          </Label>
                          <Input
                            id="instructions"
                            placeholder="e.g., Leave at door, Ring bell twice..."
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border border-border/50 bg-card/60 supports-[backdrop-filter]:bg-card/50 supports-[backdrop-filter]:backdrop-blur-sm rounded-xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                    <div
                      className={`flex items-center gap-3 p-4 border rounded-lg transition-colors cursor-pointer bg-background/40 hover:bg-muted/60 dark:border-border/50 border-border ${
                        paymentMethod === "cod"
                          ? "ring-1 ring-emerald-300/50 dark:ring-emerald-500/40 border-emerald-300/70 dark:border-emerald-500/50"
                          : ""
                      }`}
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex flex-1 items-center cursor-pointer">
                        <div className="flex-grow flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-muted-foreground">Pay when your order arrives</div>
                          </div>
                        </div>
                        <div className="font-medium whitespace-nowrap ml-auto text-yellow-700 dark:text-emerald-300">
                         +1$
                        </div>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-4 border rounded-lg transition-colors cursor-pointer bg-background/40 hover:bg-muted/60 dark:border-border/50 border-border ${
                        paymentMethod === "bank"
                          ? "ring-1 ring-violet-300/60 dark:ring-violet-500/50 border-violet-300/70 dark:border-violet-500/50"
                          : ""
                      }`}
                    >
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex flex-1 items-center cursor-pointer">
                        <div className="flex-grow flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Bank Transfer</div>
                            <div className="text-sm text-muted-foreground">Transfer to our bank account</div>
                          </div>
                        </div>
                        <div className="font-medium whitespace-nowrap ml-auto">Secure</div>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-4 border rounded-lg transition-colors cursor-pointer bg-background/40 hover:bg-muted/60 dark:border-border/50 border-border ${
                        paymentMethod === "crypto"
                          ? "ring-1 ring-amber-300/60 dark:ring-amber-500/50 border-amber-300/70 dark:border-amber-500/50"
                          : ""
                      }`}
                    >
                      <RadioGroupItem value="crypto" id="crypto" />
                      <Label htmlFor="crypto" className="flex flex-1 items-center cursor-pointer">
                        <div className="flex-grow flex items-center gap-2">
                          <Bitcoin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          <div>
                            <div className="font-medium">Crypto Payment</div>
                            <div className="text-sm text-muted-foreground">
                              Pay with Bitcoin or other cryptocurrencies
                            </div>
                          </div>
                        </div>
                        <div className="font-medium whitespace-nowrap ml-auto">Fast</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Items - Mobile */}
              <Card className="lg:hidden border border-border/50 bg-card/60 supports-[backdrop-filter]:bg-card/50 supports-[backdrop-filter]:backdrop-blur-sm rounded-xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Order Items ({selectedItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedItems.map((item) => (
                    <div key={item._id} className="flex gap-3 items-center">
                      <div className="w-16 h-16 shrink-0">
                        <Image
                          src={
                            item?.image ||
                            item?.images?.[0] ||
                            "/placeholder.svg?height=64&width=64&query=product%20image" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={item.name || item.title || "Product image"}
                          width={64}
                          height={64}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.title || item.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5">
              <Card className="lg:sticky lg:top-24 border border-border/50 bg-card/60 supports-[backdrop-filter]:bg-card/50 supports-[backdrop-filter]:backdrop-blur-sm rounded-xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items - Desktop */}
                  <div className="hidden lg:block space-y-3 max-h-60 overflow-y-auto pr-2">
                    {selectedItems.map((item) => (
                      <div key={item._id} className="flex gap-3 items-center">
                        <div className="w-12 h-12 shrink-0">
                          <Image
                            src={
                              item?.image ||
                              item?.images?.[0] ||
                              "/placeholder.svg?height=48&width=48&query=product%20image" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt={item.name || item.title || "Product image"}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.title || item.name}</h4>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-border/60" />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-sm text-emerald-700 dark:text-emerald-300">
                        <span className="flex items-center gap-2">
                          Discount ({discountPercentage}%)
                          <Badge
                            variant="secondary"
                            className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                          >
                            PROMO
                          </Badge>
                        </span>
                        <span className="font-medium">-{(subtotal * (discountPercentage / 100)).toFixed(2)}</span>
                      </div>
                    )}

                    {codSurcharge > 0 && (
                      <div className="flex justify-between text-sm text-amber-700 dark:text-amber-300">
                        <span className="text-muted-foreground">COD Surcharge</span>
                        <span className="font-medium">+${codSurcharge.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Promo CTA */}
                    <div className="mt-5">
                      {promoApplied ? (
                        <div className="bg-emerald-50/60 dark:bg-emerald-900/30 border border-emerald-300/60 dark:border-emerald-700/60 rounded-lg p-3 supports-[backdrop-filter]:bg-emerald-50/50 supports-[backdrop-filter]:dark:bg-emerald-900/25 supports-[backdrop-filter]:backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                <Check className="h-3 w-3" />
                              </div>
                              <span className="font-medium text-emerald-800 dark:text-emerald-200">Promo applied</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={removePromoCode}
                              className="hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40"
                              aria-label="Remove promo code"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full h-11 font-medium border-2 border-dashed border-border dark:border-border/60 hover:bg-muted/60 bg-transparent"
                            >
                              + Apply Promo Code
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Apply Promo Code</DialogTitle>
                              <DialogDescription className="sr-only">Enter and apply your promo code</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Enter your promo code</label>
                                <Input
                                  value={promoCode}
                                  onChange={(e) => {
                                    setPromoCode(e.target.value)
                                    setPromoError("")
                                  }}
                                  placeholder="e.g. YELLOWCHICK"
                                  className="w-full"
                                />
                                {promoError && <p className="text-destructive text-sm mt-2">{promoError}</p>}
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setPromoDialogOpen(false)} className="flex-1">
                                  Cancel
                                </Button>
                                <Button onClick={applyPromoCode} disabled={isApplyingPromo} className="flex-1">
                                  {isApplyingPromo ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Applying...
                                    </>
                                  ) : (
                                    "Apply Code"
                                  )}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    <Separator className="bg-border/60" />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Bottom Bar */}
          <div className="lg:hidden mt-6">
            <div className="max-w-5xl mx-auto border border-border/50 bg-card/70 supports-[backdrop-filter]:bg-card/60 supports-[backdrop-filter]:backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-lg">Total: ${total.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">{selectedItems.length} items</span>
              </div>
              <Button
                onClick={handleOrderNow}
                disabled={
                  isProcessing ||
                  !confirmedAddress ||
                  !validateName(customerName) ||
                  !validateMobileNumber(mobileNumber)
                }
                className="w-full h-12 text-base font-semibold"
              >
                {isProcessing ? "Processing..." : "Order Now"}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Confirm Button */}
        <div className="hidden lg:block max-w-5xl mx-auto px-4 pb-10">
          <Button
            onClick={handleOrderNow}
            disabled={
              isProcessing ||
              !confirmedAddress ||
              !validateName(customerName) ||
              !validateMobileNumber(mobileNumber)
            }
            className="w-full h-14 text-lg font-semibold"
          >
            {isProcessing ? "Processing..." : "Confirm Order"}
          </Button>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
          <DialogContent className="dialog-content sm:max-w-[425px] bg-card/80 supports-[backdrop-filter]:bg-card/70 supports-[backdrop-filter]:backdrop-blur-sm text-foreground rounded-xl shadow-sm max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Confirm Your Order</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Please review your order details before confirming.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-2 text-sm">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-muted-foreground">Name:</span>
                <span className="col-span-2 font-medium">{customerName}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-muted-foreground">Mobile:</span>
                <span className="col-span-2 font-medium">{mobileNumber}</span>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-muted-foreground">Delivery To:</span>
                <span className="col-span-2 font-medium">{confirmedAddress?.display_name}</span>
              </div>

              {streetAddress && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground">Street/Building:</span>
                  <span className="col-span-2 font-medium">{streetAddress}</span>
                </div>
              )}

              {landmark && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground">Landmark:</span>
                  <span className="col-span-2 font-medium">{landmark}</span>
                </div>
              )}

              {deliveryInstructions && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground">Instructions:</span>
                  <span className="col-span-2 font-medium">{deliveryInstructions}</span>
                </div>
              )}

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-muted-foreground">Payment</span>
                <span className="col-span-2 font-medium">
                  {paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : paymentMethod === "bank"
                      ? "Bank Transfer"
                      : "Crypto Payment"}
                </span>
              </div>

              {codSurcharge > 0 && (
                <div className="grid grid-cols-3 items-center gap-4 text-amber-700 dark:text-amber-300">
                  <span className="text-muted-foreground">COD Surcharge:</span>
                  <span className="col-span-2 font-medium">+${codSurcharge.toFixed(2)}</span>
                </div>
              )}

              <Separator className="my-2" />

              <div className="grid grid-cols-3 items-center gap-4 font-semibold">
                <span className="text-muted-foreground">Total:</span>
                <span className="col-span-2">${total.toFixed(2)}</span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={()=>handleConfirmOrder(session.user.email)} disabled={isProcessing}>
                {isProcessing ? "Confirming..." : "Confirm Order"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Error modal */}
        <ProgressModal
          isOpen={errModalOpen}
          status="failed"
          onClose={() => setErrModalOpen(false)}
          failedDescrption="An error occured while placing your order! Please try again."
        />
      </div>
    </>
  )
}

