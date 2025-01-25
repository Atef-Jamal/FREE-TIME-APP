import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  expirationDate: Date;
  prize: number;
  createdAt: Date;
}

const couponSchema: Schema<ICoupon> = new mongoose.Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    prize: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Coupon: Model<ICoupon> = mongoose.model<ICoupon>("Coupon", couponSchema);
export default Coupon;
