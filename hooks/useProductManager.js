"use client"

import { useState } from "react"
import useNotification from "@/hooks/useNotification"

const initialProducts = [
  {
    id: "PROD-001",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: "$199.99",
    stock: 45,
    status: "active",
    images: [
      "/placeholder.svg?height=200&width=200&text=Headphones+1",
      "/placeholder.svg?height=200&width=200&text=Headphones+2",
      "/placeholder.svg?height=200&width=200&text=Headphones+3",
    ],
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
    sku: "WBH-001",
  },
  {
    id: "PROD-002",
    name: "Smart Fitness Watch",
    category: "Wearables",
    price: "$299.99",
    stock: 3,
    status: "active",
    images: [
      "/placeholder.svg?height=200&width=200&text=Watch+1",
      "/placeholder.svg?height=200&width=200&text=Watch+2",
    ],
    description: "Advanced fitness tracking with heart rate monitor and GPS",
    sku: "SFW-002",
  },
  {
    id: "PROD-003",
    name: "Ergonomic Laptop Stand",
    category: "Accessories",
    price: "$79.99",
    stock: 0,
    status: "active",
    images: ["/placeholder.svg?height=200&width=200&text=Stand+1"],
    description: "Adjustable aluminum laptop stand for better ergonomics",
    sku: "ELS-003",
  },
  {
    id: "PROD-004",
    name: "USB-C Fast Charging Cable",
    category: "Accessories",
    price: "$24.99",
    stock: 156,
    status: "active",
    images: [
      "/placeholder.svg?height=200&width=200&text=Cable+1",
      "/placeholder.svg?height=200&width=200&text=Cable+2",
    ],
    description: "6ft braided USB-C cable with fast charging support",
    sku: "UFC-004",
  },
  {
    id: "PROD-005",
    name: "Protective Phone Case",
    category: "Accessories",
    price: "$34.99",
    stock: 2,
    status: "active",
    images: ["/placeholder.svg?height=200&width=200&text=Case+1"],
    description: "Drop-proof case with wireless charging compatibility",
    sku: "PPC-005",
  },
]

export default function useProductManager() {
  const [products, setProducts] = useState(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const { showNotification: showSaveNotification, notify: notifySave } = useNotification(3000)
  const { showNotification: showDeleteNotification, notify: notifyDelete } = useNotification(3000)

  const getProductById = (id) => {
    return products.find((product) => product.id === id)
  }

  const updateProduct = async (id, updatedData) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              ...updatedData,
            }
          : product,
      ),
    )

    setIsLoading(false)
    notifySave()
  }

  const deleteProduct = async (id) => {
    const productToDelete = products.find((product) => product.id === id)

    if (productToDelete) {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
      notifyDelete()
      return productToDelete
    }
    return null
  }

  return {
    products,
    isLoading,
    showSaveNotification,
    showDeleteNotification,
    getProductById,
    updateProduct,
    deleteProduct,
    notifySave,
    notifyDelete,
  }
}
