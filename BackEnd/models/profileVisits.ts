import mongoose from "mongoose";

const profileVisitsSchema = new mongoose.Schema(
  {
    visited: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ProfileVisits = mongoose.model("ProfileVisits", profileVisitsSchema);
export default ProfileVisits;
