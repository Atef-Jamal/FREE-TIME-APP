import { Document, model, Schema } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  expirationDate: Date;
  prize: number;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
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

const Coupon = model<ICoupon>("Coupon", couponSchema);
export default Coupon;
