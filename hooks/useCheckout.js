"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { useRouter } from "next/navigation"
import { CartContext } from "@/contexts/CartProvider"
import VerifyPromoCode from "@/backend-utilities/promo-related/VerifyPromo"
import ConfirmOrder from "@/backend-utilities/confirm-order/ConfirmOrder"

export default function useCheckout() {
  const { selectedItems, subtotal, deliveryFee, clearCart } = useContext(CartContext)
  const router = useRouter()

  const [customerName, setCustomerName] = useState("")
  const [displayMobileNumber, setDisplayMobileNumber] = useState("+92")
  const [mobileNumber, setMobileNumber] = useState("+92")
  const [addressInput, setAddressInput] = useState("")
  const [confirmedAddress, setConfirmedAddress] = useState(null)
  const [streetAddress, setStreetAddress] = useState("")
  const [landmark, setLandmark] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [deliveryInstructions, setDeliveryInstructions] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)

  // Error Modal:
  const [errModalOpen, setErrModalOpen] = useState(false);





  // PROMO CODE::
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);





  const [discountPercentage, setDiscountPercentage] = useState(0);

  const applyPromoCode = async () => {
    setIsApplyingPromo(true);
    setPromoError("");

    const Verified = await VerifyPromoCode(promoCode);

    if (!Verified.success) {
      setPromoError("Invalid promo code. Please try again.")
    }
    else {
      setPromoApplied(true);
      setPromoDialogOpen(false);
      setPromoError("");
      setDiscountPercentage(Verified.discountPercentage);
      console.log("Discount is", discountPercentage);

    }
    setIsApplyingPromo(false);
  }


  const removePromoCode = () => {
    setPromoCode("")
    setPromoApplied(false)
    setPromoError("")
  }



  const addressInputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Calculate COD Surcharge
  const codSurcharge = paymentMethod === "cod" ? 1 : 0

  // Calculate total

  const total = subtotal + deliveryFee - (subtotal * (discountPercentage / 100)) + codSurcharge

  // Validation functions
  const validateName = (name) => name.trim().length >= 3
  const validateMobileNumber = (number) => {
    const strippedNumber = number.replace(/^\+92/, "")
    return number.startsWith("+92") && strippedNumber.length >= 10 && strippedNumber.length <= 13
  }

  // LocationIQ API functions
  const LOCATIONIQ_API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY

  const searchAddresses = async (query) => {
    if (query.length < 3) {
      setAddressSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=pk`,
      )

      if (response.ok) {
        const data = await response.json()
        const pkSuggestions = data.filter((item) => item.address?.country_code === "pk")
        const suggestions = pkSuggestions.map((item) => ({
          display_name: item.display_name,
          lat: Number.parseFloat(item.lat),
          lon: Number.parseFloat(item.lon),
          address: item.address || {},
        }))
        setAddressSuggestions(suggestions)
        setShowSuggestions(suggestions.length > 0)
      } else {
        console.error("LocationIQ API error:", response.status, await response.text())
        setAddressSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error("Address search error:", error)
      setAddressSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsSearching(false)
    }
  }

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      )

      if (response.ok) {
        const data = await response.json()
        if (data.address?.country_code === "pk") {
          return {
            display_name: data.display_name,
            lat: Number.parseFloat(data.lat),
            lon: Number.parseFloat(data.lon),
            address: data.address || {},
          }
        } else {
          return null
        }
      }
      return null
    } catch (error) {
      console.error("Reverse geocoding error:", error)
      return null
    }
  }

  const handleAddressInputChange = (value) => {
    setAddressInput(value)
    setConfirmedAddress(null)
    setLocationError("")

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      searchAddresses(value)
    }, 300)

    setSearchTimeout(timeout)
  }

  const handleSuggestionSelect = (suggestion) => {
    setAddressInput(suggestion.display_name)
    setConfirmedAddress(suggestion)
    setShowSuggestions(false)
    setLocationError("")
  }

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    setLocationError("")
    setConfirmedAddress(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.")
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const address = await reverseGeocode(latitude, longitude)
        if (address) {
          setAddressInput(address.display_name)
          setConfirmedAddress(address)
          setLocationError("")
        } else {
          setLocationError(
            "Your current location is not in Pakistan or could not be determined. Please enter manually.",
          )
        }
        setIsLoadingLocation(false)
      },
      (error) => {
        setIsLoadingLocation(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enable location access or enter your address manually.")
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable. Please enter your address manually.")
            break
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try again or enter manually.")
            break
          default:
            setLocationError("An unknown error occurred. Please enter your address manually.")
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  const handleMobileNumberChange = (e) => {
    let value = e.target.value

    if (value === "" || value === "+") {
      setDisplayMobileNumber("+92")
      setMobileNumber("+92")
      return
    }

    if (!value.startsWith("+92")) {
      value = "+92" + value.replace(/^\+?92?/, "")
    }

    let normalizedValue = value
    if (normalizedValue.startsWith("+920") && normalizedValue.length > 3) {
      normalizedValue = "+92" + normalizedValue.substring(3)
    }

    if (value.length > 15) {
      value = value.substring(0, 15)
    }

    setDisplayMobileNumber(value)
    setMobileNumber(normalizedValue)
  }

  const handleOrderNow = async () => {
    if (!validateName(customerName)) {
      setLocationError("Please enter your full name (at least 3 characters).")
      return
    }
    if (!validateMobileNumber(mobileNumber)) {
      setLocationError("Please enter a valid Pakistani mobile number (e.g., +923XX-XXXXXXX, max 15 digits).")
      return
    }
    if (!confirmedAddress) {
      setLocationError("Please select a delivery address from the suggestions or use your current location.")
      return
    }

    setShowConfirmationDialog(true)
  }

  const handleConfirmOrder = async (session_email) => {
    setIsProcessing(true)
    setShowConfirmationDialog(false)



    // Pack all order details into an object!

    const orderDetails = {
      customerDetails: {
        name: customerName,
        email: session_email,
        phone: mobileNumber,
      },
      deliveryDetails: {
        address: confirmedAddress.display_name,
        streetAddress,
        landmark,
        instructions: deliveryInstructions,
        coordinates: {
          lat: confirmedAddress.lat,
          lon: confirmedAddress.lon
        },
        googleMapsUrl: `https://www.google.com/maps?q=${confirmedAddress.lat},${confirmedAddress.lon}`
      },
      paymentDetails: {
        method: paymentMethod,
        codSurcharge: codSurcharge
      },
      orderedItems: selectedItems.map(item => item._id),
      pricing: {
        subtotal,
        deliveryFee,
        discount: {
          promoCode: promoApplied ? promoCode : null,
          percentage: discountPercentage,
          discountedAmount: (subtotal * (discountPercentage / 100))
        },
        codSurcharge,
        total
      }
    };


    // Call Server action to confirm order:

    const ConfirmedOrder = await ConfirmOrder(orderDetails);

    // if order not confirmed:
    if (!ConfirmedOrder) {
      setIsProcessing(false);
      // Show error modal:
      setErrModalOpen(true);
      return false;

    }

    const { orderId } = ConfirmedOrder;


    router.push(`/checkout/confirmed/${orderId}`);
    clearCart();

    setIsProcessing(false);
    return true; 



  }

  const handleRemoveAddress = () => {
    setConfirmedAddress(null)
    setAddressInput("")
    setStreetAddress("")
    setLandmark("")
    setDeliveryInstructions("")
    setLocationError("")
  }

  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    window.addEventListener("mousedown", handleClickOutside)
    return () => window.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  return {
    // State
    customerName,
    setCustomerName,
    displayMobileNumber,
    handleMobileNumberChange,
    mobileNumber,
    addressInput,
    handleAddressInputChange,
    confirmedAddress,
    streetAddress,
    setStreetAddress,
    landmark,
    setLandmark,
    paymentMethod,
    setPaymentMethod,
    deliveryInstructions,
    setDeliveryInstructions,
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
    promoCode, setPromoCode,
    promoApplied, setPromoApplied,
    promoError, setPromoError,
    promoDialogOpen, setPromoDialogOpen,
    isApplyingPromo, setIsApplyingPromo, removePromoCode,
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
    validateMobileNumber,
    handleSuggestionSelect,
    getCurrentLocation,
    handleOrderNow,
    handleConfirmOrder,
    handleRemoveAddress,

    //ERR MODAL:
    errModalOpen, setErrModalOpen
  }
}