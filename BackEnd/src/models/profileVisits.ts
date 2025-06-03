import mongoose, { Model, Schema, Types } from "mongoose";

export interface IVisitor extends Document {
  visitor: Types.ObjectId;
  visited: Types.ObjectId;
  createdAt: Date;
}

const profileVisitsSchema: Schema = new mongoose.Schema<IVisitor>(
  {
    visited: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visitor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

profileVisitsSchema.index({ visited: 1 });

const ProfileVisits: Model<IVisitor> = mongoose.model<IVisitor>("ProfileVisits", profileVisitsSchema);
export default ProfileVisits;
