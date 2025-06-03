import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IFrame extends Document {
  title: string;
  image: string;
  price: number;
  description: string;
  purshasedBy: Types.ObjectId[];
}

const framesSchema: Schema<IFrame> = new mongoose.Schema<IFrame>(
  {
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    purshasedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);
framesSchema.index({ purshasedBy: 1 });
const Frame: Model<IFrame> = mongoose.model<IFrame>("Frame", framesSchema);
export default Frame;
