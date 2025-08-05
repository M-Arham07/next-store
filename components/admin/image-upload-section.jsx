"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormLabel } from "@/components/ui/form"
import { X, Upload, ImageIcon, Eye } from "lucide-react"
import { cn } from "@/lib/utils"



//USAGE:

// const MB_LIMIT = 5;

// const IMAGE_CONFIG = {
//   ACCEPTED_IMAGE_TYPES:["image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
//   MB : MB_LIMIT,
//   MAX_FILE_SIZE : MB_LIMIT * 1024 * 1024,
//   IMAGES_LIMIT : 6,
// }


/* <ImageUploadSection
    productImages={productImages}
    updateFormImages={updateFormImages}
    form={form}
    IMAGE_CONFIG={IMAGE_CONFIG}
/> */




export default function ImageUploadSection({ productImages, updateFormImages, form, IMAGE_CONFIG }) {

    const { ACCEPTED_IMAGE_TYPES, MB, MAX_FILE_SIZE, IMAGES_LIMIT } = IMAGE_CONFIG;
    


    const [dragActive, setDragActive] = useState(false)
    const [imageError, setImageError] = useState("")
    const [previewImage, setPreviewImage] = useState(null)
    const fileInputRef = useRef(null)

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
                errors.push(`${file.name} exceeds ${MB}MB limit`)
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
        updateFormImages(newImages);
        form.setValue('images', newImages);
    }

    return (
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
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Drag and drop images here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">or click to browse files</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Supported formats: JPG, JPEG, PNG, SVG (max {MB}MB)
                </p>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                </Button>
            </div>

            {imageError && <p className="text-sm text-red-500">{imageError}</p>}

            {/* Image Preview Grid */}
            {productImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {productImages.map((image, index) => (
                        <div
                            key={image.id || index}
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
    )
}
