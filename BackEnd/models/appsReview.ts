import mongoose from "mongoose";

const appsReviewSchema = new mongoose.Schema({
  appId: { type: mongoose.Schema.Types.ObjectId, required: true },
  contend: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const AppsReview = mongoose.model("AppsReview", appsReviewSchema);
export default AppsReview;
