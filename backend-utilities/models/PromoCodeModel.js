
import mongoose from "mongoose";


const Schema = mongoose.Schema;

const PromoCodeSchema = new Schema({
    promoCode: {
        type: String,
        required: true,
        unique: true
    },
    leftUses: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true
    }


},
    { collection: "promos", timestamps: true }
);

export default mongoose.models.Promo || mongoose.model("Promo",PromoCodeSchema);