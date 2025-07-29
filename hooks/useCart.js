
import { type } from "os";
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
    const [isInitialized, setIsInitialized] = useState(false);



    // HOW THIS WORKS:

    /* FIRST, cart is retrieved from localStorage
     * If its null or undefined or some error occurs, initialize it with an empty array []
     * If it exists, setCartItems to JSON.parse(cart) to update the state and show
       the items on screen.
     * After the first useEffect has run, it will setIsInitialized to true,
       indicating that the cart has been intialized!
     
     ** 2ND useEffect:
     * The 2nd useEffect runs on mount,when cartItems change or when isInitialized state is changed
     * The action by the 2nd useEffect only takes place when isInitialized is true
     * So the 2nd useEffect only runs when the cart has been initialized
     * This prevents infinite loops and prevents emptying the cart on every reload
     * In the second useEffect, if the cart has been initialized, and cartItems have been changed,
       it will update the cart in the localStorage
    */



    useEffect(() => {

        try {
            const cart = localStorage.getItem("cart");
            cart ? setCartItems(JSON.parse(cart)) : setCartItems([]);

        }
        catch (err) {
            setCartItems([]);
        }

        setIsInitialized(true);


    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }

    }, [cartItems, isInitialized]);




const addItem = (currentProduct) => {
    // check if the added item already exists in cart, if it does increase its quantity by one
    // .some returns a boolean if required thing exists, .find returns the whole array that matches the condition
    const isExist = cartItems.some((product) => currentProduct.id === product.id);
    if (!isExist) {
        setCartItems((prev) => [...prev, { ...currentProduct, quantity: 1 ,selected:true}]);
        console.log("Add success", currentProduct)
    }
    else {
        updateQuantity(currentProduct.id, 1)
    }
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

{/* SELECTION   */ }
const allSelected = cartItems.every((item) => item.selected)
const selectedItems = cartItems.filter((item) => item.selected)


// check if cart isEmpty
const isEmpty = cartItems?.length === 0;



return {
    cartItems,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    toggleItemSelection,
    toggleSelectAll,
    allSelected,
    selectedItems
}

}

