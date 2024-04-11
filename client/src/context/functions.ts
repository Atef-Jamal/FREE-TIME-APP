import {
  DocumentData,
  DocumentSnapshot,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

import { makeRequest } from "../utils";


export const validation = (
  values: string[],
  signIn: boolean,
  agreePrivacy?: boolean
) => {
  let result = `Must Be Exist-`;
  values.map((item, index) => {
    let name;
    if (index === 0) name = `${signIn ? "Email" : "Username"} `;
    if (index === 1) name = `${signIn ? "Password" : "Email"} `;
    if (index === 2) name = `Password `;
    if (index === 3) name = `Confirm Password `;
    return item.trim() === "" ? (result += name) : undefined;
  });
  if (values.every((item) => item.trim() !== "") && values[2] !== values[3])
    return (result = `Password doesn't Match`);
  if (values[0].length < 3 && !signIn)
    return (result = `name must be at least 3 character`);
  if (values[0].length > 17 && !signIn)
    return (result = `name must be less than 17 character`);
  if (!signIn) {
    if (!agreePrivacy && values.every((item) => item.trim() !== "")) {
      return (result = `must agree Privacy Policy and terms of service`);
    }
  }
  if (values.every((item) => item.trim() !== "")) {
    return (result = "");
  }
  return result.split("-").reverse().join("");
};

export const formateTimestampDate = (
  createdAt: Timestamp,
  dateOrTime?: "DATEONLY" | "TIMEONLY"
) => {
  const newTime = createdAt.toDate().toLocaleTimeString("en-us");
  const newDate = createdAt
    .toDate()
    .toLocaleDateString("en-us")
    .split("/")
    .join("-");
  const pmoram = newTime.slice(-3);
  const finalTime = newTime.split(" ")[0].slice(0, -3);

  if (dateOrTime === "DATEONLY") {
    return `${newDate}`;
  }
  if (dateOrTime === "TIMEONLY") {
    return `${
      finalTime.split(":")[0].length === 2 ? finalTime : 0 + finalTime
    } ${pmoram}`;
  }
  return `${
    finalTime.split(":")[0].length === 2 ? finalTime : 0 + finalTime
  } ${pmoram}  ${newDate}`;
};

export const formateStringDate = (
  createdAt: string,
  dateOrTime?: "DATEONLY" | "TIMEONLY"
) => {
  const date = createdAt.split(",")[0].split("/").join("-");
  const pmoram = createdAt.split(",")[1].slice(-3);
  const finalTime = createdAt.split(",")[1].split(" ")[1].slice(0, -3);
  if (dateOrTime === "DATEONLY") {
    return `${date}`;
  }
  if (dateOrTime === "TIMEONLY") {
    return `${finalTime} ${pmoram}`;
  }
  return `${finalTime} ${pmoram} ${date}`;
};

export const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getUserData = async (id: string) => {
  const response: DocumentSnapshot<DocumentData, DocumentData> = await getDoc(
    doc(db, import.meta.env.VITE_USERS_COLLECTION_NAME, id)
  );
  return response;
};

export const addDocument = async (collectionName: string, dataObject: any) => {
  const response = await addDoc(collection(db, collectionName), dataObject);
  return response;
};

export const updateDocument = async (
  collectionName: string,
  docId: string,
  dataObject: any
) => {
  await updateDoc(doc(db, collectionName, docId), dataObject);
};

export const timeAgoFromMongoDBDate = (dateArg: string): string => {
  const mongoDBDate = new Date(dateArg);
  const now: Date = new Date();
  const timestampDate: Date = new Date(mongoDBDate);
  const difference: number = now.getTime() - timestampDate.getTime();

  const minutes: number = Math.floor(difference / (1000 * 60));
  const hours: number = Math.floor(difference / (1000 * 60 * 60));
  const days: number = Math.floor(difference / (1000 * 60 * 60 * 24));
  const months: number = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));

  if (months > 0) {
    return months + (months === 1 ? " month ago" : " months ago");
  } else if (days > 0) {
    return days + (days === 1 ? " day ago" : " days ago");
  } else if (hours > 0) {
    return hours + (hours === 1 ? " hour ago" : " hours ago");
  } else {
    return (
      (minutes === 0 ? "" : minutes) +
      (minutes === 0
        ? "Just now"
        : minutes === 1
        ? " minute ago "
        : " minutes ago")
    );
  }
};

export const collectReward = async (notificationId: string) => {
  const response = await makeRequest.patch(
    `api/notifications/collect/${notificationId}`,
    {
      FOR_CONSISTENCY: "FOR_CONSISTENCY",
    },
  );

  return response.data;
};
