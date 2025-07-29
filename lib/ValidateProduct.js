
import {z} from "zod";
// CUSTOM SCHEMA TO VALIDATE PRODUCT OBJECTS:


const productSchema= z.object({
    id: z.number(),
    title: z.string(),
    isAvailable: z.boolean(),
    rating: z.number(), 
    price: z.number(),
    oldPrice: z.number(), 
    category: z.string(), 
    description: z.string().optional(),
    images: z.array(z.string()).optional(), 
    // note also add qty and selected
})