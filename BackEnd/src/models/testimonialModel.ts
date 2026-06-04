import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./userModel.js";

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
      ref: "UserModel",
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

const TestimonialModel = model<ITestimonial>("TestimonialModel", testimonialSchema);
export default TestimonialModel;
