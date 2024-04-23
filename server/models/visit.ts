import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whoVisit: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

const Visit = mongoose.model("Visit", visitSchema);

export default Visit;
