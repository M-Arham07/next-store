"use client"

import { useState } from "react"
import { ChevronLeft, Minus, Plus, Check, X, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image";
import Link from "next/link";
import useCart from "@/hooks/useCart";
import { products } from "../products/page"

export default function Component() {

    const { cartItems,
        isEmpty,
        allSelected,
        selectedItems,
        addItem,
        removeItem,
        updateQuantity,
        toggleItemSelection,
        toggleSelectAll,
    } = useCart();


    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [appliedPromoCode, setAppliedPromoCode] = useState("");
    const [promoDialogOpen, setPromoDialogOpen] = useState(false);
    const [promoError, setPromoError] = useState("");
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);








    {/* Checkout  */ }
    console.log("SELECTED ITEMS ARE:", selectedItems)
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 4.9
    const discountPercent = promoApplied ? 20 : 0;
    const discount = subtotal * (discountPercent / 100);
    const total = subtotal + deliveryFee - discount


    const applyPromoCode = () => {
        setIsApplyingPromo(true)
        setPromoError("")

        // Simulate API call with timeout
        setTimeout(() => {
            if (promoCode.toLowerCase() === "yellowchick") {
                setPromoApplied(true)
                setAppliedPromoCode(promoCode)
                setPromoDialogOpen(false)
                setPromoCode("")
                setPromoError("")
            } else {
                setPromoError("Invalid promo code. Please try again.")
            }
            setIsApplyingPromo(false)
        }, 2000)
    }

    const removePromoCode = () => {
        setPromoApplied(false)
        setAppliedPromoCode("")
        setPromoError("")
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Main Content Container */}
            <div className="px-1 pb-96 lg:pb-4 max-w-7xl mx-auto lg:px-8 lg:py-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    {/* Cart Items - Desktop Table Layout */}
                    <div className="lg:col-span-2">
                        {/* Desktop Header */}
                        <div className="hidden lg:flex lg:items-center lg:justify-between lg:mb-8">
                            <h1 className="text-3xl font-bold">Shopping Cart</h1>
                            <span className="text-xl text-muted-foreground">{selectedItems.length} Items</span>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="lg:hidden pt-4">
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between mb-4 px-2">
                                <Link href="/products">
                                    <Button variant="ghost" size="icon" className="w-10 h-10">
                                        <ChevronLeft className="h-5 w-5" /> Shop
                                    </Button>
                                </Link>
                                <h1 className="text-xl font-bold">Your Cart</h1>
                                <div className="w-10 h-10"></div>
                            </div>

                            <div className="bg-card backdrop-blur-sm border rounded-2xl p-1 sm:p-2 shadow-lg mx-1 min-h-[200px]">
                                {isEmpty ? (
                                    <div className="flex items-center justify-center h-48">
                                        <p className="text-muted-foreground text-lg">Your cart is empty</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Select All - Mobile */}
                                        <div className="flex items-center gap-3 mb-2 mt-2 p-3 rounded-lg  mx-2">
                                            <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} className="w-6 h-6" />
                                            <span className="font-medium">Select all</span>
                                        </div>

                                        {/* Mobile Cart Items */}
                                        <div className="space-y-3">
                                            {cartItems.map((item, index) => (
                                                <div key={item.id}>
                                                    <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border-b border-border/50 pb-4 mx-2">
                                                        <Checkbox
                                                            checked={item.selected}
                                                            onCheckedChange={() => toggleItemSelection(item.id)}
                                                            className="w-6 h-6 flex-shrink-0"
                                                        />

                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                                            <Image
                                                                src={item.image || "/placeholder.svg"}
                                                                alt={item.title}
                                                                width={80}
                                                                height={80}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h3 className="font-medium text-sm sm:text-base pr-2 line-clamp-2 leading-tight">
                                                                    {item.name}
                                                                </h3>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => removeItem(item)}
                                                                    className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="w-6 h-6 bg-transparent hover:bg-muted"
                                                                        onClick={() => updateQuantity(item.id, -1)}
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </Button>
                                                                    <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="w-6 h-6 bg-transparent hover:bg-muted"
                                                                        onClick={() => updateQuantity(item.id, 1)}
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                                <p className="text-base sm:text-lg font-semibold">{item.price.toFixed(2) }</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Mobile Promo Code Button - Only show if cart has items */}
                            {!isEmpty && (
                                <div className="mt-6 mx-1">
                                    {promoApplied ? (
                                        <div className="bg-green-50 backdrop-blur-sm border border-green-200 rounded-2xl p-4 shadow-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                                                        <Check className="h-3 w-3 text-white" />
                                                    </div>
                                                    <span className="font-medium text-green-800">Promo Applied</span>

                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={removePromoCode}
                                                    className="text-green-600 hover:text-green-800 hover:bg-green-100"
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
                                                    className="w-full py-4 text-lg font-medium border-dashed border-2 hover:bg-muted bg-transparent"
                                                >
                                                    + Apply Promo Code
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Apply Promo Code</DialogTitle>
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
                            )}
                        </div>

                        {/* Desktop Table Layout */}
                        <div className="hidden lg:block">
                            {isEmpty ? (
                                <div className="flex items-center justify-center h-64 bg-card backdrop-blur-sm border rounded-lg">
                                    <p className="text-muted-foreground text-xl">Your cart is empty</p>
                                </div>
                            ) : (
                                <>
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 gap-4 pb-4 border-b mb-3 bg-muted/30 backdrop-blur-sm rounded-lg p-4">
                                        <div className="col-span-5 text-muted-foreground font-medium">PRODUCT DETAILS</div>
                                        <div className="col-span-2 text-muted-foreground font-medium text-center">QUANTITY</div>
                                        <div className="col-span-2 text-muted-foreground font-medium text-center">PRICE</div>
                                        <div className="col-span-2 text-muted-foreground font-medium text-center">TOTAL</div>

                                    </div>



                                    {/* Table Items */}
                                    <div className="space-y-4">
                                        {cartItems.map((item, index) => (
                                            <div key={item.id}>
                                                <div className="grid grid-cols-12 gap-4 items-center py-4 bg-card backdrop-blur-sm border rounded-lg p-4 hover:bg-muted/50 transition-all duration-200 shadow-sm">
                                                    {/* Product Details */}
                                                    <div className="col-span-5 flex items-center gap-4">
                                                        <Checkbox
                                                            checked={item.selected}
                                                            onCheckedChange={() => toggleItemSelection(item.id)}
                                                            className="w-5 h-5"
                                                        />
                                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                            <Image
                                                                src={item.image || "/placeholder.svg"}
                                                                alt={item.title}
                                                                width={80}
                                                                height={80}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-lg">{item.name}</h3>
                                                            <p className="text-muted-foreground text-sm font-medium">{item.category}</p>
                                                        </div>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="col-span-2 flex items-center justify-center gap-3">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="w-8 h-8 bg-transparent hover:bg-muted"
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="w-8 h-8 bg-transparent hover:bg-muted"
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="col-span-2 text-center">
                                                        <span className="font-medium">${item.price.toFixed(2)}</span>
                                                    </div>

                                                    {/* Total */}
                                                    <div className="col-span-2 text-center">
                                                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>

                                                    {/* Action - Dustbin */}
                                                    <div className="col-span-1 flex justify-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeItem(item)}
                                                            className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Continue Shopping - Only show when cart has items */}
                            {!isEmpty && (
                                <div className="mt-8 pt-6 border-t">
                                    <Link href="/products">
                                        <Button variant="ghost" className="p-0">
                                            <ChevronLeft className="h-4 w-4 mr-2" />
                                            Continue Shopping
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 lg:mt-0 lg:col-span-1">
                        <div className="lg:sticky lg:top-8">
                            {/* Desktop Header */}
                            <h2 className="hidden lg:block text-2xl font-bold mb-6">Order Summary</h2>

                            {/* Order Summary Card - Desktop - Only show when cart has items */}
                            {!isEmpty && (
                                <div className="hidden lg:block bg-card backdrop-blur-sm border rounded-2xl p-4 sm:p-6 shadow-lg">
                                    {/* Items Summary */}
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                        <span className="text-muted-foreground">ITEMS {selectedItems.length}</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>

                                    {/* Order Summary Details */}
                                    <div className="space-y-3 mb-6 text-sm">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Delivery Fee:</span>
                                            <span>${deliveryFee.toFixed(2)}</span>
                                        </div>
                                        {promoApplied && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount:</span>
                                                <span>-${discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Promo Code - Desktop */}
                                    <div className="mb-6">
                                        <label className="block text-muted-foreground text-sm font-medium mb-2">PROMO CODE</label>
                                        {promoApplied ? (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <div className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-600" />
                                                    <span className="text-green-800 font-medium">Promo Applied</span>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={removePromoCode}
                                                        className="ml-auto text-green-600 hover:text-green-800 hover:bg-green-100 p-1"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={promoCode}
                                                        onChange={(e) => {
                                                            setPromoCode(e.target.value)
                                                            setPromoError("")
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                applyPromoCode();
                                                            }
                                                        }}
                                                        placeholder="Enter your code"
                                                        className="flex-1"
                                                    />
                                                    <Button onClick={applyPromoCode} disabled={isApplyingPromo} className="px-6">
                                                        {isApplyingPromo ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Applying...
                                                            </>
                                                        ) : (
                                                            "APPLY"
                                                        )}
                                                    </Button>
                                                </div>
                                                {promoError && <p className="text-destructive text-sm mt-2">{promoError}</p>}
                                            </>
                                        )}
                                    </div>

                                    {/* Total */}
                                    <div className="border-t pt-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground text-base font-medium">TOTAL COST</span>
                                            <span className="text-3xl font-bold">${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Button className="w-full py-4 text-lg font-semibold">CHECKOUT</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout Section - Only show if cart has items */}
            {!isEmpty && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t p-4 pb-8 shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        {/* Order Summary Details */}
                        <div className="space-y-3 mb-4 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee:</span>
                                <span>${deliveryFee.toFixed(2)}</span>
                            </div>
                            {promoApplied && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount:</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center mb-4 pb-4 border-t pt-4">
                            <span className="text-muted-foreground font-medium">TOTAL COST</span>
                            <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                        </div>

                        <Button className="w-full py-4 text-lg font-semibold">CHECKOUT</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
