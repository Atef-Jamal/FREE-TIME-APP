import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ITestimonial extends Document {
  user: Types.ObjectId;
  content: string;
  stars: number;
  createdAt: Date;
}

const testimonialSchema: Schema<ITestimonial> = new mongoose.Schema<ITestimonial>(
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

const Testimonial: Model<ITestimonial> = mongoose.model<ITestimonial>("Testimonial", testimonialSchema);
export default Testimonial;
