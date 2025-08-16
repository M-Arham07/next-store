
import mongoose from "mongoose";
import { productSchema } from "./ProductModel";
const Schema = mongoose.Schema;

const OrdersSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },

    // CUSTOMER DETAILS:

    customerDetails: {

        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }

    },


    // DELIVERY DETAILS + ADDRESS:

    deliveryDetails: {
        address: { type: String, required: true },
        streetAddress: { type: String },
        landmark: { type: String },
        instructions: { type: String },
        coordinates: {
            lat: { type: Number, required: true },
            lon: { type: Number, required: true }
        },
        googleMapsUrl: { type: String, required: true }

    },

    // PAYMENT METHOD AND COD SURCHARGE!:

    paymentDetails: {
        method: { type: String, required: true },
        codSurcharge: { type: Number }
    },


    // ORDERED ITEMS!:

    orderedItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            qty:{
                type:Number,
                required:true
            }
        

        } // We can populate orderedItems before  showing results on Orders page, to also get all products!
    ],

    // PRICING, TOTAL AND DISCOUNT!

    pricing: {
        subtotal: { type: Number, required: true },
        deliveryFee: { type: Number, required: true },
        discount: {
            promoCode: { type: String },
            percentage: { type: Number },
            discountedAmount: { type: Number }
        },
        codSurcharge: { type: Number },
        total: { type: Number }
    },

    // CURRENT ORDER STATUS - FOR TRACKING:

    status: {
        type: String,
        required: true,
        enum: ["processing", "confirmed", "shipped", "out for delivery", "delivered", "cancelled"],
        default: "processing"

    },

    // DELIVERED DATE:
    deliveredAt: {
        type: Date
    },

    // CANCELLED DATE: MUST EXIST IF STATUS IS cancelled
    cancelledAt: {
        type: Date,
        required: function () { return this.status === "cancelled" }
    },

    // CANCELLATION REASON: MUST EXIST IF CANCELLED AT EXISTS!

    cancelReason: {
        type: String,
        required: function () { return !!this.cancelledAt }
    },

    /* CANCELLED BY USER OR ADMIN ?
       BOTH SUPERUSER AND ADMIN ARE ALLOWED TO CANCEL ORDERS! */
    cancelledBy: {
        type: String,
        enum: ["user", "admin"],
        required: function () { return this.status === "cancelled" }
    }


}, { collection: "orders", timestamps: true });

export default mongoose.models.Orders || mongoose.model("Orders", OrdersSchema);

