import { model, Schema, Types, Document } from "mongoose";
import { IUser } from "./userModel.js";

export interface IVisitor extends Document {
  visitor: Types.ObjectId | IUser;
  visited: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const profileVisitsSchema = new Schema<IVisitor>(
  {
    visited: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    visitor: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

profileVisitsSchema.index({ visited: 1 });

const ProfileVisitsModel = model<IVisitor>("ProfileVisitsModel", profileVisitsSchema);
export default ProfileVisitsModel;
