import mongoose from "mongoose";

const appsReviewSchema = new mongoose.Schema({
  appId: { type: mongoose.Schema.Types.ObjectId, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const AppsReview = mongoose.model("AppsReview", appsReviewSchema);
export default AppsReview;
