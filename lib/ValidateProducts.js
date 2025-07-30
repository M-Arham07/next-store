
import { z } from "zod";
/* CUSTOM SCHEMA TO VALIDATE PRODUCT OBJECTS, SO APP DOESENT CRASHES AT RUNTIME
   IF SOMEONE TAMPERS WITH LOCAL STORAGE OR BYPASSES OTHER THINGS */

const productSchema = z.object({
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
});


/* This function returns true ONLY if product matches above schema AND id of products isnt duplicate
    otherwise false */

export default function ValidateProducts(Products) {




   return Products.every((product,index,arr)=>productSchema.safeParse(product).success 
   &&   arr.findIndex(p => p.id === product.id) === index
);

}







// // EXAMPLE:
// const Products =
//  [
//     {
//         id: 1,
//         title: "Samsung Galaxy Watch 6",
//         isAvailable: true,
//         rating: 4.2,
//         price: 349,
//         oldPrice: 52,
//         category: "Wearables",

//     },
//     {
//         id: 1,
//         title: "Samsung Galaxy Watch 6",
//         isAvailable: true,
//         rating: 4.2,
//         price: 349,
//         oldPrice: 52,
//         category: "Wearables",

//     },
//  ]

// 
// 
// console.log(ValidateProducts(Products)) // Output: true


