import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../types/productType';


const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);


const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
