import { z } from "zod";



const productSchema = z.object({
    title: z.string(),
    isAvailable: z.boolean(),
    price: z.number(),
    oldPrice: z.number(),
    description: z.string().optional(),
    category: z.string(),
    images:z.array(z.string()),
    availableUnits:z.number()
});


// THIS FUNCTION IS USED IN ADD PRODUCT:
// THIS FUNCTION TAKES THE INDIVUDAL PRODUCT OBJECT AS AN ARGUMENT AND CHECKS IF IT MATCHES ABOVE SCHEMA
// AND THEN RETURNS TRUE IF MATCHES OTHERIWSE FALSE

export default function ValidateProduct(productObject){
    return productSchema.safeParse(productObject).success
}





// console.log(ValidateProduct( {
//     title: 'iPhone 15 Pro Max',
//     isAvailable: true,
//     rating: 4.5,
//     price: 999,
//     oldPrice: 45,
//     description: 'Experience the new iPhone!',
//     category: 'Smartphones',
//     images: [ '/iphone15promax.jpeg' ],
//     availableUnits:2
//   }))