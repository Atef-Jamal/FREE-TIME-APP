import { model, Schema, Types, Document } from "mongoose";
import { IUser } from "./user.js";

export interface IProfileView extends Document {
  viewer: Types.ObjectId | IUser;
  profileOwner: Types.ObjectId | IUser;
  viewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileViewSchema = new Schema<IProfileView>(
  {
    viewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profileOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

ProfileViewSchema.index({ profileOwner: 1 });

const ProfileView = model<IProfileView>("ProfileView", ProfileViewSchema);
export default ProfileView;
