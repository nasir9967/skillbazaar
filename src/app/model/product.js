import mongoose from 'mongoose';

const productsModel = new mongoose.Schema({
    name: { type: String },
    color: { type: String },
    price: { type: String }
});

export const product = mongoose.models.products || mongoose.model("products", productsModel);
