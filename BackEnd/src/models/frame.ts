import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./user.js";

export interface IFrame extends Document {
  title: string;
  image: string;
  price: number;
  description: string;
  purshasedBy: (Types.ObjectId | IUser)[];
  createdAt: Date;
  updatedAt: Date;
}

const framesSchema = new Schema<IFrame>(
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
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);
framesSchema.index({ purshasedBy: 1 });
const Frame = model<IFrame>("Frame", framesSchema);
export default Frame;
