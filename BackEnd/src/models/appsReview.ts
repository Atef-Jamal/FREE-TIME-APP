import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IReview extends Document {
  appId: Types.ObjectId;
  user: Types.ObjectId;
  comment: string;
}

const appsReviewSchema: Schema<IReview> = new Schema<IReview>({
  appId: { type: Schema.Types.ObjectId, required: true },
  comment: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const AppsReview: Model<IReview> = mongoose.model<IReview>("AppsReview", appsReviewSchema);
export default AppsReview;
