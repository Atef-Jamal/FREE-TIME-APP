import { IUser } from "../../../features/user/types";

export interface ITestimonial {
  _id: string;
  user: IUser;
  content: string;
  stars: number;
  createdAt: Date;
  updatedAt: Date;
}
