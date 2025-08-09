"use client"

import { RetrieveCartfromDB, SaveCartToDB } from "@/backend-utilities/cart-related/SaveAndRetrieveCart";
import ValidateCartProducts from "@/lib/ValidateCartProducts"
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react"

export default function useCart() {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);


  const { data: session } = useSession();



  useEffect(() => {


    try {
      const syncCart = async () => {

        let dbCart = [];
        let localCart = [];
        let mergedCart = [];



        if (session && session?.user) {
          dbCart = await RetrieveCartfromDB(session?.user?.email);

        }


        const rawCart = localStorage.getItem("cart");
        if (rawCart) {
          localCart = JSON.parse(rawCart);
          const isOK = ValidateCartProducts(localCart);
          if (!isOK) throw new Error("Invalid Cart");

          // MERGE CART LOGIC: 
          mergedCart = [...dbCart, ...localCart].filter((item,index,arr)=>{

            return arr.findIndex(i=>i._id === item._id) === index // only return true for unique items (means only keep unique items)

          });

          // console.log("The merged cart is :",mergedCart);



          setCartItems(mergedCart);
        } else {
          setCartItems(dbCart) // fallback to dbCart if no cart in localStorage
        }
      }
      syncCart();
      
     
    } catch (err) {
      console.log("Error initializing cart from localStorage:", err)
      setCartItems([])
    }
    setIsInitialized(true)
  }, [session]); // session isnt available instantly on mount, so run this useEffect on mount + change in session!
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems))

    }

    if (session?.user) SaveCartToDB(session?.user?.email, cartItems)
  }, [cartItems, isInitialized])

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
    localStorage.removeItem("cart")
 
  }

  const allSelected = cartItems.every((item) => item.selected)
  const selectedItems = cartItems.filter((item) => item.selected)
  const isEmpty = cartItems?.length === 0

  
 

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 4.9
  const total = subtotal + deliveryFee

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
    total,
  
    clearCart, // Expose clearCart
  }
}