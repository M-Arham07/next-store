"use client"

import { useState } from "react"
import { Search, Filter, Edit, Trash2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import useProductManager from "@/hooks/useProductManager"
import AlertNotification from "@/components/AlertNotification"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"

function getStockBadge(stock) {
  if (stock === 0) {
    return <Badge className="bg-red-500 text-white hover:bg-red-600 text-xs">Out of Stock</Badge>
  } else if (stock < 5) {
    return <Badge className="bg-yellow-500 text-black hover:bg-yellow-600 text-xs">Low Stock</Badge>
  } else {
    return (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-xs">
        In Stock
      </Badge>
    )
  }
}

export default function ManageProductsPage() {
  const router = useRouter()
  const { products, deleteProduct, showDeleteNotification } = useProductManager()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const filterCategories = ["all", ...new Set(products.map((product) => product.category))]

  const handleEditClick = (productId) => {
    router.push(`/admin/products/${productId}/edit`)
  }

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  return (
    <div className="flex-1 space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Manage Products</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          View and manage all active products in your inventory
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              <span className="truncate">Category: {categoryFilter === "all" ? "All" : categoryFilter}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {filterCategories.map((category) => (
              <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                {category === "all" ? "All Categories" : category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Active Products ({filteredProducts.length})</CardTitle>
          <CardDescription className="text-sm">All products currently available in your store</CardDescription>
        </CardHeader>
        <div className="px-4 pb-4">
          <Link href="/admin/products/add">
            <Button variant="default" className="w-full sm:w-auto">
              + Add Product
            </Button>
          </Link>
        </div>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col space-y-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center"
              >
                {/* Mobile Layout */}
                <div className="flex space-x-3 sm:hidden">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden border">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{product.sku}</span>
                      <span>•</span>
                      <span>{product.category}</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex sm:flex-shrink-0">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden border">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="hidden sm:flex sm:flex-1 sm:min-w-0 sm:space-y-1 sm:flex-col">
                  <h3 className="font-semibold text-base truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>SKU: {product.sku}</span>
                    <span>•</span>
                    <span>{product.category}</span>
                  </div>
                </div>

                {/* Price and Stock - Mobile */}
                <div className="flex items-center justify-between sm:hidden">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">{product.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStockBadge(product.stock)}
                    <span className="text-xs text-muted-foreground">{product.stock} units</span>
                  </div>
                </div>

                {/* Actions - Mobile */}
                <div className="flex justify-end space-x-2 sm:hidden">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(product.id)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>

                {/* Price, Stock and Actions - Desktop */}
                <div className="hidden sm:flex sm:items-center sm:justify-between sm:space-x-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg">{product.price}</span>
                    <div className="flex items-center space-x-2">
                      {getStockBadge(product.stock)}
                      <span className="text-sm text-muted-foreground">{product.stock} units</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(product.id)}>
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => handleDeleteClick(product)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="w-[90vw] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone and will
              permanently remove the product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notifications */}
      {showDeleteNotification && (
        <div className="notification-container">
          <AlertNotification message="Product deleted successfully!" />
        </div>
      )}
    </div>
  )
}
