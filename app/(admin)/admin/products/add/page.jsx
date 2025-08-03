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



const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
const MB = 1 // change this to control max file size for images
const MAX_FILE_SIZE = MB * 1024 * 1024; // 5MB
const IMAGES_LIMIT = 6;


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
                .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
                .refine(
                    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
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
    const [dragActive, setDragActive] = useState(false)
    const [imageError, setImageError] = useState("") //default is saving!
    const [previewImage, setPreviewImage] = useState(null)
    const fileInputRef = useRef(null)

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

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleFileInput = (e) => {
        if (e.target.files) {
            handleFiles(e.target.files)
        }
    }

    const handleFiles = (files) => {
        const newImages = []
        const errors = []

        // Check if adding new files would exceed the maximum limit

        /*
         For example limit is 7. There are already 4 images. 
         Now if user tries to upload 5 more images, then file.length becomes 5 , 
         and when both existing product images and new images are added,
         they give the result 4+5=9,which is greater than limit, so they're rejected
        */

        if (productImages.length + files.length > IMAGES_LIMIT) {
            setImageError(`Maximum ${IMAGES_LIMIT} images allowed`)
            return
        }

        Array.from(files).forEach((file) => {
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                errors.push(`${file.name} is not a supported format`)
                return
            }
            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name} exceeds 5MB limit`)
                return
            }

            const id = Math.random().toString(36).substr(2, 9)
            const preview = URL.createObjectURL(file)
            newImages.push({
                id,
                file,
                preview,
            })
        })

        if (errors.length > 0) {
            setImageError(errors.join(", "))
            return
        }

        const updatedImages = [...productImages, ...newImages];
        updateFormImages(updatedImages);
        setImageError("")
    }

    const removeImage = (id) => {
        const newImages = productImages.filter((img) => img.id !== id);
        setProductImages(newImages);
        // Update form field when images change
        form.setValue('images', newImages);
    }

    // Update form when files are added
    const updateFormImages = (images) => {
        setProductImages(images);
        form.setValue('images', images);
    }












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
            <div className="max-w-2xl mx-auto">
                <ProgressModal isOpen={modalOpen}
                    status={modalStatus}
                    savingTitle="Saving Product..."
                    successDescription="Product Saved Successfuly!"
                    failedDescrption="Failed Saving Product!"
                    onClose={() => {
                        setModalOpen(false);
                        if (modalStatus === "success") {
                            window.location.reload();
                              
                            // Redirect to this same page after successful add, to reset the form
                        } else {
                            setModalStatus("saving");
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

                                {/* Image Upload */}
                                <div className="space-y-4">
                                    <FormLabel className="dark:text-gray-200">Product Images *</FormLabel>

                                    {/* Upload Area */}
                                    <div
                                        className={cn(
                                            "border-2 border-dashed rounded-lg p-6 text-center transition-colors dark:bg-black",
                                            dragActive
                                                ? "border-white bg-white/5 dark:bg-white/10"
                                                : "border-gray-300 dark:border-white/10",
                                            imageError ? "border-red-500" : "",
                                        )}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileInput}
                                            className="hidden"
                                        />
                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Drag and drop images here</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">or click to browse files</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Supported formats: JPG, JPEG, PNG, SVG (max 5MB)</p>
                                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Choose Files
                                        </Button>
                                    </div>

                                    {imageError && <p className="text-sm text-red-500">{imageError}</p>}

                                    {/* Image Preview Grid */}
                                    {productImages.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {productImages.map((image, index) => (
                                                <div
                                                    key={image.id}
                                                    className="relative group border-2 border-gray-200 dark:border-white/10 rounded-lg overflow-hidden transition-all hover:border-gray-300 dark:hover:border-white/20"
                                                >
                                                    <Image
                                                        src={image.preview || "/placeholder.svg"}
                                                        alt={`Product ${index + 1}`}
                                                        width={400}
                                                        height={300}
                                                        className="w-full h-24 sm:h-32 object-cover cursor-pointer"
                                                        onClick={() => setPreviewImage(image.preview)}
                                                    />

                                                    {/* Action Buttons */}
                                                    <div className="absolute top-2 right-2 flex gap-1">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="secondary"
                                                            className="h-6 w-6 p-0 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black"
                                                            onClick={() => setPreviewImage(image.preview)}
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-6 w-6 p-0"
                                                            onClick={() => removeImage(image.id)}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {productImages.length > 0 && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {productImages.length} image{productImages.length !== 1 ? "s" : ""} uploaded
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button type="submit" className="w-full dark:bg-white dark:text-black dark:hover:bg-white/90" size="lg">
                                    Add Product
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Image Preview Modal */}
                <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                        <DialogHeader className="p-6 pb-0">
                            <DialogTitle>Image Preview</DialogTitle>
                        </DialogHeader>
                        <div className="p-6 pt-0">
                            {previewImage && (
                                <Image
                                    src={previewImage || "/placeholder.svg"}
                                    alt="Preview"
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
