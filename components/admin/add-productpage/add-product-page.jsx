"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { success, z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Upload, ImageIcon, Eye } from "lucide-react"
import { cn } from "@/lib/utils";
import useUploadImages from "@/hooks/useUploadImages";
import ProgressModal from "@/components/ProgressModal"
import SaveProductToDB from "@/backend-utilities/add-product/SaveProductToDB"
import { useRouter } from "next/navigation"



import ImageUploadSection from "../image-upload-section";

// Constants for image upload configuration:

const MB_LIMIT = 5;

const IMAGE_CONFIG = {
  ACCEPTED_IMAGE_TYPES:["image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
  MB : MB_LIMIT,
  MAX_FILE_SIZE : MB_LIMIT * 1024 * 1024,
  IMAGES_LIMIT : 6,
}

  const { ACCEPTED_IMAGE_TYPES, MB, MAX_FILE_SIZE, IMAGES_LIMIT } = IMAGE_CONFIG;

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.string().refine((val) => !isNaN(val) && Number(val) > 0, {
    message: "Price must be a valid positive number",
  }),
  oldPrice: z.string().refine((val) => !isNaN(val) && Number(val) >= 0, {
    message: "Original price must be a valid non-negative number",
  }),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  availableUnits: z.string().refine((val) => !isNaN(val) && Number(val) > 0, {
    message: "Units must be a valid number greater than 0",
  }),
  images: z
    .array(z.object({
      id: z.string(),
      file: z.any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          'Only .jpg, .jpeg, .png and .svg formats are supported'
        ),
      preview: z.string(),
    }))
    .min(1, "At least one image is required")
    .max(IMAGES_LIMIT, `Maximum ${IMAGES_LIMIT} images allowed`),
})
  .refine((data) => {
    const { price, oldPrice } = data;
    return Number(oldPrice) > Number(price);
  }, {
    message: "Original price must be greater than current price",
    path: ["oldPrice"]
  })

export default function AddProductPage() {
  const router = useRouter();


  const { uploadImages, Progress } = useUploadImages();

  //PROGRESS MODAL:
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("saving"); // default is saving!



  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: "",
      oldPrice: "",
      category: "",
      description: "",
      availableUnits: "",
      images: [],
    },
  })



  const [productImages, setProductImages] = useState([])

  const updateFormImages = (images) => {
    setProductImages(images);
    form.setValue('images', images);
  }

  const categories = [
    "Electronics",
    "Smartphones",
    "Clothing",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Toys & Games",
    "Health & Beauty",
    "Automotive",
  ]













  const onSubmit = async (values) => {


    setModalOpen(true);


    const productData = {
      ...values,
      price: Number.parseFloat(values.price),
      oldPrice: Number.parseFloat(values.oldPrice),
      availableUnits: Number.parseInt(values.availableUnits),
      images: values.images.map(img => img.file), // images is an array of image files (pure files,no other thing)
    }



    const imageURLS = await uploadImages(productData.images);
    if (!imageURLS) { setModalStatus("failed"); return false; };

    // SAVING PRODUCT LOGIC:

    // CONSTRUCT THE ACTUAL PRODUCT AS IN DB:
    const newProduct = {
      ...productData, images: imageURLS, isAvailable: true
    }

    // CALL SERVER ACTION TO SAVE PRODUCT IN DATABASE:

    const isSaved = await SaveProductToDB(newProduct);

    if (!isSaved) { setModalStatus("failed"); return false; };


    // AS PRODUCT IS SAVED SO SHOW SUCCESS:

    setModalStatus("success");

    return true;








  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ProgressModal
          isOpen={modalOpen}
          status={modalStatus}
          savingTitle="Saving Product..."
          successDescription="Product Saved Successfuly!"
          failedDescrption="Failed Saving Product!"
          onClose={() => {
            setModalOpen(false)
            if (modalStatus === "success") {
              window.location.reload()
              // Redirect to this same page after successful add, to reset the form
            } else {
              setModalStatus("saving")
            }
            /* If modal status is currently success, redirect to this same page to reset the form,  else reset modal status to saving */
          }}
          percentage={Progress}
        />

        <Card className="dark:bg-black dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center dark:text-white">Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Two Column Layout for Large Screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Form Fields */}
                  <div className="space-y-6">
                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">Product Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter product title"
                              className="dark:bg-black dark:border-white/10 dark:text-white dark:placeholder-white/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-200">Current Price * ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="dark:bg-black dark:border-white/10 dark:text-white dark:placeholder-white/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="oldPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-200">Original Price * ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="dark:bg-black dark:border-white/10 dark:text-white dark:placeholder-white/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="dark:bg-black dark:border-white/10 dark:text-white">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter product description"
                              className="dark:bg-black dark:border-white/10 dark:text-white dark:placeholder-white/50"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Units Field */}
                    <FormField
                      control={form.control}
                      name="availableUnits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">Available Units *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              placeholder="Enter available units"
                              className="dark:bg-black dark:border-white/10 dark:text-white dark:placeholder-white/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right Column - Image Upload */}
                  <ImageUploadSection
                    productImages={productImages}
                    updateFormImages={updateFormImages}
                    form={form}
                    IMAGE_CONFIG={IMAGE_CONFIG}
                  />
                </div>

                {/* Submit Button - Full Width */}
                <Button type="submit" className="w-full dark:bg-white dark:text-black dark:hover:bg-white/90" size="lg">
                  Add Product
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

      </div>
    </div>
  )


}
