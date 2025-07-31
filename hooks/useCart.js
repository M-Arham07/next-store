"use client"

import ValidateProducts from "@/lib/ValidateProducts"
import { useState, useEffect } from "react"

export default function useCart() {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  useEffect(() => {
    try {
      const rawCart = localStorage.getItem("cart")
      if (rawCart) {
        const cart = JSON.parse(rawCart)
        const isOK = ValidateProducts(cart)
        if (!isOK) throw new Error("Invalid Cart")
        setCartItems(cart)
      } else {
        setCartItems([])
      }

      // Load promo state from localStorage
      const savedPromoCode = localStorage.getItem("promoCode")
      const savedPromoApplied = localStorage.getItem("promoApplied")

      if (savedPromoCode) {
        setPromoCode(savedPromoCode)
      }

      if (savedPromoApplied === "true") {
        setPromoApplied(true)
      }
    } catch (err) {
      console.log("Error initializing cart from localStorage:", err)
      setCartItems([])
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
      // Save promo state to localStorage
      localStorage.setItem("promoCode", promoCode)
      localStorage.setItem("promoApplied", promoApplied.toString())
    }
  }, [cartItems, promoCode, promoApplied, isInitialized])

  const addItem = (currentProduct) => {
    const isExist = cartItems.some((product) => currentProduct._id === product._id)
    if (!isExist) {
      setCartItems((prev) => [...prev, { ...currentProduct, quantity: 1, selected: true }])
    } else {
      updateQuantity(currentProduct._id, 1)
    }
  }

  const removeItem = (currentProduct) => {
    setCartItems((prev) => prev.filter((product) => product._id !== currentProduct._id))
  }

  const toggleSelectAll = () => {
    setCartItems((items) => items.map((item) => ({ ...item, selected: !allSelected })))
  }

  const toggleItemSelection = (_id) => {
    setCartItems((items) => items.map((item) => (item._id === _id ? { ...item, selected: !item.selected } : item)))
  }

  const updateQuantity = (_id, change) => {
    setCartItems((items) =>
      items.map((item) => (item._id === _id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item)),
    )
  }

  const clearCart = () => {
    setCartItems([])
    setPromoCode("")
    setPromoApplied(false)
    localStorage.removeItem("cart")
    localStorage.removeItem("promoCode")
    localStorage.removeItem("promoApplied")
  }

  const allSelected = cartItems.every((item) => item.selected)
  const selectedItems = cartItems.filter((item) => item.selected)
  const isEmpty = cartItems?.length === 0

  const applyPromoCode = () => {
    setIsApplyingPromo(true)
    setPromoError("")

    setTimeout(() => {
      if (promoCode.toLowerCase() === "yellowchick") {
        setPromoApplied(true)
        setPromoDialogOpen(false)
        setPromoError("")
      } else {
        setPromoError("Invalid promo code. Please try again.")
      }
      setIsApplyingPromo(false)
    }, 2000)
  }

  const removePromoCode = () => {
    console.log("PROMOCODE WAS ", promoCode)
    setPromoCode("")
    setPromoApplied(false)
    setPromoError("")
  }

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 4.9
  const discountPercent = promoApplied ? 20 : 0
  const discount = subtotal * (discountPercent / 100)
  const total = subtotal + deliveryFee - discount

  return {
    cartItems,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    toggleItemSelection,
    toggleSelectAll,
    allSelected,
    selectedItems,
    subtotal,
    deliveryFee,
    discountPercent,
    discount,
    total,
    promoApplied,
    promoCode,
    promoError,
    applyPromoCode,
    setPromoCode,
    setPromoApplied,
    removePromoCode,
    setPromoError,
    setIsApplyingPromo,
    isApplyingPromo,
    promoDialogOpen,
    setPromoDialogOpen,
    clearCart, // Expose clearCart
  }
}
