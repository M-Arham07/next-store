"use client";


import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import ProgressModal from "@/components/ProgressModal"
import ImageUploadSection from "@/components/admin/image-upload-section";
import useUploadImages from "@/hooks/useUploadImages"
import UpdateProduct from "@/backend-utilities/update-product/UpdateProduct";

// Constants for image upload configuration:
const MB_LIMIT = 5;

const IMAGE_CONFIG = {
    ACCEPTED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
    MB: MB_LIMIT,
    MAX_FILE_SIZE: MB_LIMIT * 1024 * 1024,
    IMAGES_LIMIT: 6,
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
            file: z.any(),
            preview: z.string(),
        }))
        .min(1, "At least one image is required")
        .max(IMAGES_LIMIT, `Maximum ${IMAGES_LIMIT} images allowed`),
})

export default function EditProductPage({ currentProduct }) {

    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState("saving");
    const [productImages, setProductImages] = useState([]);

    // FOR UPLOADING NEW IMAGES:
    const { uploadImages, Progress } = useUploadImages();

    //ROUTER:
    const router = useRouter();


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

    // Function to initialize form with current product
    const initializeForm = () => {

        const formattedImages = currentProduct.images.map(imageUrl => ({
            id: Math.random().toString(36).substr(2, 9), // Generate unique ID for each image
            file: imageUrl,
            preview: imageUrl // Use the existing URL as preview
        }));





        form.reset({
            title: currentProduct.title,
            price: currentProduct.price.toString(),
            oldPrice: currentProduct.oldPrice.toString(),
            category: currentProduct.category,
            description: currentProduct.description,
            availableUnits: currentProduct.availableUnits?.toString(),
            images: formattedImages
        });
   
        updateFormImages(formattedImages);


       
    }

    useEffect(() => {
        if (currentProduct) {
            initializeForm();
        }
    }, [currentProduct]);

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


        

                                           
                                // FILTER WILL RETURN WHOLE IMAGE OBJECT           //MAP WILL EXTRACT URL FROM IT

        const existingURLS = values.images.filter(image=>typeof image.file === "string").map(img=>img.file)

        const imagesToUpload = values.images.filter(image=>typeof image.file !== "string").map(img=>img.file)


        let newImageURLS = [];

        if (imagesToUpload.length > 0) {
            // console.log("IMAGES NEEDED TO UPLOAD ARE",imagesToUpload)
            newImageURLS = await uploadImages(imagesToUpload);
           

           if(!newImageURLS){ setModalStatus("failed"); return false};
           

        }

       

        const finalImages = [...existingURLS,...newImageURLS];

        console.log("These Images will be added:",finalImages)




        const updatedProductData = {
            ...values,
            price: Number.parseFloat(values.price),
            oldPrice: Number.parseFloat(values.oldPrice),
            availableUnits: Number.parseInt(values.availableUnits),
            images: finalImages, // images is an array of image files (pure files,no other thing)
        }

        console.log(`Updating ${currentProduct.title} with product data:`,updatedProductData);

        // CALL SERVER ACTION TO UPDATE PRODUCT, AND SEND _id of product to be updated and the new data!
        const isUpdated = await UpdateProduct(currentProduct._id,updatedProductData);

        if(!isUpdated){setModalStatus("failed"); return false;}



        setModalStatus("success");


    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pt-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <ProgressModal
                    isOpen={modalOpen}
                    status={modalStatus}
                    savingTitle="Updating Product..."
                    successDescription="Product Updated Successfully!"
                    failedDescrption="Failed Updating Product!"
                    onClose={() => {
                        router.push('/admin/products/')
                        setModalOpen(false);
                        setModalStatus("saving");
                        
                    }}
                    percentage={Progress}
                />

                <Card className="dark:bg-black dark:border-white/10">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center dark:text-white">Editing {currentProduct.title}</CardTitle>
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
                                                    <Select 
                                                        defaultValue={currentProduct?.category}
                                                        onValueChange={field.onChange}
                                                    >
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
                                    <div>
                                        <ImageUploadSection
                                            productImages={productImages}
                                            updateFormImages={updateFormImages}
                                            form={form}
                                            IMAGE_CONFIG={IMAGE_CONFIG}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="images"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button - Full Width */}
                                <Button type="submit" className="w-full dark:bg-white dark:text-black dark:hover:bg-white/90" size="lg">
                                    Update Product
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
