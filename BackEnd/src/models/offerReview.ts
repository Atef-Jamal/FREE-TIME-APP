import { Document, model, Schema, Types } from "mongoose";
import { IOffer } from "./offer.js";
import { IUser } from "./user.js";

export interface IOfferReview extends Document {
  offer: Types.ObjectId | IOffer;
  user: Types.ObjectId | IUser;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const offerReviewSchema = new Schema<IOfferReview>({
  offer: { type: Schema.Types.ObjectId, ref: "Offer", required: true },
  comment: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const OfferReview = model<IOfferReview>("OfferReview", offerReviewSchema);
export default OfferReview;
