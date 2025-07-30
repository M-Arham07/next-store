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
} from "@/components/ui/dialog"
import useCheckout from "@/hooks/useCheckout" // Import the new hook

export default function CheckoutPage() {
  const router = useRouter()
  const {
    // State
    customerName,
    setCustomerName,
    displayMobileNumber,
    handleMobileNumberChange,
    mobileNumber,
    emailAddress,
    setEmailAddress,
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

    // Derived values
    codSurcharge,
    total,
    selectedItems,
    subtotal,
    deliveryFee,
    discount,
    promoApplied,
    discountPercent,

    // Functions
    validateName,
    validateEmail,
    validateMobileNumber,
    handleSuggestionSelect,
    getCurrentLocation,
    handleOrderNow,
    handleConfirmOrder,
    handleRemoveAddress,
  } = useCheckout()

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card text-foreground rounded-xl shadow-lg">
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              <Truck className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Add some items to proceed with checkout</p>
            <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl md:text-2xl font-bold text-center">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-6">
            {" "}
            {/* Main content takes 7/12 columns */}
            {/* Contact Information */}
            <Card className="bg-card text-foreground rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <User className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name" className="text-sm font-medium">
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
                  <Label htmlFor="mobile-number" className="text-sm font-medium">
                    Pakistani Mobile Number
                  </Label>
                  <Input
                    id="mobile-number"
                    type="tel"
                    placeholder="e.g., +923XX-XXXXXXX"
                    value={displayMobileNumber} // Use displayMobileNumber for input
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
                <div className="space-y-2">
                  <Label htmlFor="email-address" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email-address"
                    type="email"
                    placeholder="Enter your email address"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                    className={!validateEmail(emailAddress) && emailAddress.length > 0 ? "border-destructive" : ""}
                  />
                  {!validateEmail(emailAddress) && emailAddress.length > 0 && (
                    <p className="text-destructive text-xs">Please enter a valid email address.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Delivery Address */}
            <Card className="bg-card text-foreground rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="w-5 h-5 text-primary" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location Error Alert */}
                {locationError && (
                  <Alert
                    variant="destructive"
                    className="bg-red-50/20 border-red-300 text-red-700 dark:bg-red-950/20 dark:border-red-700 dark:text-red-300 rounded-lg shadow-sm"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{locationError}</AlertDescription>
                  </Alert>
                )}

                {/* Current Location Button */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isLoadingLocation}
                    className="flex-1 bg-transparent hover:bg-accent hover:text-accent-foreground border-border rounded-lg shadow-sm"
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

                {/* Address Input with LocationIQ Search */}
                <div className="space-y-2 relative">
                  <Label htmlFor="address" className="text-sm font-medium">
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
                          ? "border-destructive focus-visible:ring-destructive pr-10 rounded-lg shadow-sm"
                          : "pr-10 rounded-lg shadow-sm"
                      }
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Search className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Address Suggestions Dropdown */}
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute top-full left-0 right-0 z-20 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1"
                    >
                      {addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground border-b border-border last:border-b-0 focus:bg-accent focus:outline-none"
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {suggestion.display_name.split(",")[0]}
                              </p>
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

                {/* Confirmed Address Display and Optional Fields */}
                {confirmedAddress && (
                  <div className="p-4 bg-green-50/20 border border-green-300 rounded-lg dark:bg-green-950/20 dark:border-green-700 shadow-sm">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">
                            Confirmed Delivery Address:
                          </p>
                          <p className="text-base font-semibold text-green-700 dark:text-green-200">
                            {confirmedAddress.display_name}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Coordinates: {confirmedAddress.lat.toFixed(6)}, {confirmedAddress.lon.toFixed(6)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveAddress}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove address"
                      >
                        <XCircle className="w-5 h-5" />
                      </Button>
                    </div>
                    <Separator className="my-3 bg-green-200 dark:bg-green-800" />
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="street-address" className="text-sm font-medium">
                          Street / Building / Flat No. (Optional)
                        </Label>
                        <Input
                          id="street-address"
                          placeholder="e.g., Flat 12, Building A, Main Street"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          className="rounded-lg shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="landmark" className="text-sm font-medium">
                          Nearby Landmark (Optional)
                        </Label>
                        <Input
                          id="landmark"
                          placeholder="e.g., Near XYZ Hospital, Opposite Park"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          className="rounded-lg shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructions" className="text-sm font-medium">
                          Delivery Instructions (Optional)
                        </Label>
                        <Input
                          id="instructions"
                          placeholder="e.g., Leave at door, Ring bell twice..."
                          value={deliveryInstructions}
                          onChange={(e) => setDeliveryInstructions(e.target.value)}
                          className="rounded-lg shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Payment Method */}
            <Card className="bg-card text-foreground rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer shadow-sm">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex flex-1 items-center cursor-pointer">
                      <div className="flex-grow flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-muted-foreground">Pay when your order arrives</div>
                        </div>
                      </div>
                      <div className="text-green-600 font-medium whitespace-nowrap ml-auto flex-shrink-0">Free</div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer shadow-sm">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex flex-1 items-center cursor-pointer">
                      <div className="flex-grow flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Bank Transfer</div>
                          <div className="text-sm text-muted-foreground">Transfer to our bank account</div>
                        </div>
                      </div>
                      <div className="text-blue-600 font-medium whitespace-nowrap ml-auto flex-shrink-0">Secure</div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer shadow-sm">
                    <RadioGroupItem value="crypto" id="crypto" />
                    <Label htmlFor="crypto" className="flex flex-1 items-center cursor-pointer">
                      <div className="flex-grow flex items-center gap-2">
                        <Bitcoin className="w-5 h-5 text-orange-600" />
                        <div>
                          <div className="font-medium">Crypto Payment</div>
                          <div className="text-sm text-muted-foreground">
                            Pay with Bitcoin or other cryptocurrencies
                          </div>
                        </div>
                      </div>
                      <div className="text-orange-600 font-medium whitespace-nowrap ml-auto flex-shrink-0">Fast</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            {/* Order Items - Mobile Only */}
            <Card className="lg:hidden bg-card text-foreground rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Order Items ({selectedItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-16 h-16 flex-shrink-0">
                      <Image
                        src={item?.image || item?.images?.[0] || "/placeholder.svg"}
                        alt={item.name || item.title || "Product image"}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.title || item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          {/* Order Summary - Desktop Sidebar */}
          <div className="lg:col-span-5">
            {" "}
            {/* Order summary takes 5/12 columns */}
            <Card className="lg:sticky lg:top-24 bg-card text-foreground rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items - Desktop Only */}
                <div className="hidden lg:block space-y-3 max-h-60 overflow-y-auto pr-2">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-12 h-12 flex-shrink-0">
                        <Image
                          src={item?.image || item?.images?.[0] || "/placeholder.svg"}
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

                <Separator className="bg-border" />

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
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        Discount ({discountPercent}%)
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          PROMO
                        </Badge>
                      </span>
                      <span className="font-medium">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  {codSurcharge > 0 && (
                    <div className="flex justify-between text-sm text-orange-600">
                      <span className="text-muted-foreground">COD Surcharge</span>
                      <span className="font-medium">+${codSurcharge.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator className="bg-border" />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Order Button - positioned after the grid */}
        <div className="lg:hidden mt-6">
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-lg p-4">
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
                !validateMobileNumber(mobileNumber) ||
                !validateEmail(emailAddress)
              }
              className="w-full h-14 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-muted disabled:text-muted-foreground rounded-lg shadow-md"
            >
              {isProcessing ? "Processing..." : "Order Now! 🚀"}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Order Button */}
      <div className="hidden lg:block max-w-4xl mx-auto px-4 pb-8">
        <Button
          onClick={handleOrderNow}
          disabled={
            isProcessing ||
            !confirmedAddress ||
            !validateName(customerName) ||
            !validateMobileNumber(mobileNumber) ||
            !validateEmail(emailAddress)
          }
          className="w-full h-16 text-2xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-muted disabled:text-muted-foreground rounded-lg shadow-md"
        >
          {isProcessing ? "Processing..." : "Confirm Order"}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card text-foreground rounded-xl shadow-lg max-h-[80vh] overflow-scroll">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm Your Order</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please review your order details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-muted-foreground">Name:</span>
              <span className="col-span-2 font-medium">{customerName}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-muted-foreground">Mobile:</span>
              <span className="col-span-2 font-medium">{mobileNumber}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-muted-foreground">Email:</span>
              <span className="col-span-2 font-medium">{emailAddress}</span>
            </div>
            <Separator className="my-2 bg-border" />
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
              <span className="text-muted-foreground">Payment:</span>
              <span className="col-span-2 font-medium">
                {paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : paymentMethod === "bank"
                    ? "Bank Transfer"
                    : "Crypto Payment"}
              </span>
            </div>
            {codSurcharge > 0 && (
              <div className="grid grid-cols-3 items-center gap-4 text-orange-600">
                <span className="text-muted-foreground">COD Surcharge:</span>
                <span className="col-span-2 font-medium">+${codSurcharge.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-2 bg-border" />
            <div className="grid grid-cols-3 items-center gap-4 font-semibold text-base">
              <span className="text-muted-foreground">Total:</span>
              <span className="col-span-2 text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmOrder} disabled={isProcessing}>
              {isProcessing ? "Confirming..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
