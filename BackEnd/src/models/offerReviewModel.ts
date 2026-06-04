import { Document, model, Schema, Types } from "mongoose";
import { IOffer } from "./offerModel.js";
import { IUser } from "./userModel.js";

export interface IOfferReview extends Document {
  offer: Types.ObjectId | IOffer;
  user: Types.ObjectId | IUser;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const offerReviewSchema = new Schema<IOfferReview>({
  offer: { type: Schema.Types.ObjectId, ref: "OfferModel", required: true },
  comment: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
});

const OfferReviewModel = model<IOfferReview>("OfferReviewModel", offerReviewSchema);
export default OfferReviewModel;
