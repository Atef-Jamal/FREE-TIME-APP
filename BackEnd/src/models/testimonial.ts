import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./user.js";

export interface ITestimonial extends Document {
  user: Types.ObjectId | IUser;
  content: string;
  stars: number;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

testimonialSchema.index({ user: 1 });

const Testimonial = model<ITestimonial>("Testimonial", testimonialSchema);
export default Testimonial;
