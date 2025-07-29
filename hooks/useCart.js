
import { useState, useEffect } from "react";

/**
 * USAGE:
 * const {addItem,removeItem,cartItems,isEmpty}=useCart();
 * 
 * addItem(currentProduct) --> adds product to cart, updates state and saves in localstorage
 * 
 * removeItem(currentProduct) --> removes product from cart, updates state and saves in localstorage
 * 
 * cartItems --> Shows all the current items in the cart!
 * 
 * isEmpty --> Tells whether the cart is empty or not
 * 
 *  
 * 
 */







export default function useCart() {

    const [cartItems, setCartItems] = useState([]);

    // retrieve cart from localStorage on Mount, and then update the state!
    // added try catch to prevent unexpected crashes if someone tampers with localStorage manually
    useEffect(() => {
        try {

            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartItems(cart);
        }
        catch (err) {
            console.log("Not this time, cuz i ain't a vibe coder!");
            setCartItems([]);

        }
    }, [])




    /* This is the useEffect where "cart" will be updated in localStorage when the cartItem state updates 
     (whether it updates after removing or adding a product) */

    useEffect(() => {

        localStorage.setItem("cart", JSON.stringify(cartItems));

    }, [cartItems]);


    const addItem = (currentProduct) => {
        setCartItems((prev) => [...prev, currentProduct]);
        console.log("Add success",currentProduct)
    }

    const removeItem = (currentProduct) => {
        // we will need to put CartItems in dependency array of useEffect, as CartItems isnt accessible right after state update!

        // filter and keep only those products whose id IS NOT EQUAL TO currentProduct's id
        setCartItems((prev) => prev.filter((product) => product.id !== currentProduct.id))
        console.log("Removed Success!");
    };




    // these ones from AI, so idk lol

      const toggleSelectAll = () => {
        setCartItems((items) => items.map((item) => ({ ...item, selected: !allSelected })))
    }


    const toggleItemSelection = (id) => {
        setCartItems((items) => items.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)))
    }

    // Here change is +1 or -1, +1 means increase and -1 means decrease quantity

    const updateQuantity = (id, change) => {
        setCartItems((items) =>
            items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item)),
        )
    }


    // check if cart isEmpty
    const isEmpty = cartItems?.length === 0;



    return {
        cartItems,
        isEmpty,
        addItem,
        removeItem,
        updateQuantity,
        toggleItemSelection,
        toggleSelectAll
    }


}