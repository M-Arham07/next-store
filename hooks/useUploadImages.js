"use client";

// I MADE THIS A HOOK INSTEAD OF REGULAR FUNCTION TO TRACK PROGRESS EFFICIENTLY:

import { useEdgeStore } from "@/contexts/EdgeStoreProvider";
import { useState } from "react";



export default function useUploadImages() {
    const [Progress, setProgress] = useState(0);
    
    const {edgestore}= useEdgeStore();
    

    // THIS FUNCTION RECEIVES AN ARRAY OF FILES (IMAGES), AND SENDS THEM TO EDGE STORE
    // AFTER RECEIVING URL FOR EACH IMAGE, IT PUSHES EACH URL INTO AN ARRAY
    // AFTER ALL IMAGE URLS ARE RECEIVED, IT RETURN URL ARRAY


    const uploadImages = async (imagesArray = []) => {
        console.log("RECEIEVD THE IMAGES ARRAY",imagesArray)

        if (imagesArray.length === 0) throw new Error("No imageArray provided");



        let totalImages = imagesArray.length;
        let completedFiles = new Array(totalImages).fill(0);

        /* if there are 4 images, uploadPromises will become an array of 4 promises [p1,p2,p3,p4]
           each promise returns res.url
           if we call const RESULTS=await Promise.all(uploadPromises), will it upload each image
           at the same time in parallel. After all promises p1,p2,p3,p4 are resolved, the return value of each
           promise will be pushed in the array RESULTS 
           */

         

        


        try {

            const uploadPromises = imagesArray.map(async (image,index) => {
               
                const res = await edgestore.publicFiles.upload({
                    file:image,
                    onProgressChange: (progress) => {
                        completedFiles[index]=progress;
                        let combinedProgress = (completedFiles.reduce((acc,current)=>acc+current,0)) / totalImages
                        setProgress(Math.floor(combinedProgress));
                    }
                });
                
                return res.url;
            });

            const imageURLS = await Promise.all(uploadPromises);
            return imageURLS;
        }
        catch (err) {
            console.error("ERROR UPLOADING FILES TO EDGE STORE AT useUploadImages! Logs:", err.message);
            return false;
        }
    }

    return { uploadImages, Progress }



}