import { Request, Response } from "express";
import Offer from "../models/offer.js";
import User from "../models/user.js";
import { io } from "../app.js";
import { userExcludedFields } from "../constants/index.js";
import { redisClient } from "../lib/redis.js";
import { Types } from "mongoose";
import Notification from "../models/notification.js";
import PublicMessage from "../models/publicMessage.js";
import OfferReview from "../models/offerReview.js";

type IFilterByPopularity = "ALL" | "POPULAR" | "REWARD" | "RAITING" | undefined;
type IFilterByDevice = "ALL" | "DESKTOP" | "ANDROID" | "MAC" | undefined;

export const getAllOffers = async (req: Request, res: Response) => {
  const filterByPopularity = req.query.filterByPopularity as IFilterByPopularity;
  const filterByDevice = req.query.filterByDevice as IFilterByDevice;
  const pageParam = parseInt(req.query.pageParam as string) || 1;
  const limitedPerPage = parseInt(req.query.limitedPerPage as string) || 20;
  const skip = (pageParam - 1) * limitedPerPage;

  try {
    const query = {
      ...(filterByPopularity === "POPULAR" && { completedBy: { $not: { $size: 0 } } }),
      ...(filterByPopularity === "REWARD" && { prize: { $gt: 150 } }),
      ...(filterByPopularity === "RAITING" && { rating: { $gt: 4 } }),
      ...(filterByDevice && { devices: filterByDevice }),
    };
    const offersCacheKey = `offers:list:${JSON.stringify({ query, skip, limitedPerPage })}`;
    const cachedOffers = await redisClient.get(offersCacheKey);

    if (cachedOffers) {
      const hasMore = limitedPerPage === JSON.parse(cachedOffers).length;
      return res.status(200).json({ offers: JSON.parse(cachedOffers), hasMore });
    }

    const offers = await Offer.find(query).skip(skip).limit(limitedPerPage);
    await redisClient.set(offersCacheKey, JSON.stringify(offers));

    const hasMore = limitedPerPage === offers.length;

    return res.status(200).json({ offers, hasMore });
  } catch (error) {
    return res.status(404).json({ error: "can't Load apps and offers" });
  }
};

export const getOfferDetails = async (req: Request, res: Response) => {
  try {
    const offerId = req.params.id;
    const OfferDetailsCacheKey = `offers:details:${offerId}`;

    const cachedOffer = await redisClient.get(OfferDetailsCacheKey);

    if (cachedOffer) return res.status(200).json(JSON.parse(cachedOffer));

    const offer = await Offer.findById(offerId)
      .populate("completedBy", userExcludedFields)
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "_id name",
        },
      });

    if (!offer) return res.status(404).json({ error: "Offer not found" });

    await redisClient.set(OfferDetailsCacheKey, JSON.stringify(offer));

    return res.status(200).json(offer);
  } catch (error) {
    return res.status(404).json({ error: "can't Load offer, an Error occurred" });
  }
};

export const completingQuizApp = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const completedOffers = req.user.completedOffers;
  const { offerId } = req.params;
  const { answers } = req.body;
  try {
    const offer = await Offer.findById(offerId);

    if (!offer) return res.status(404).json({ error: "App Not Found" });

    if (offer.isAvailable === "UNAVAILABLE") {
      return res.status(404).json({ error: "sorry, this app is not available" });
    }

    const isAlreadyCompleted =
      offer.completedBy.includes(req.user._id) || completedOffers.includes(new Types.ObjectId(offerId));

    if (isAlreadyCompleted)
      return res.status(404).json({ error: "sorry, offer already completed, try another" });

    let corrects = 0;
    let wrongs = 0;

    for (let index = 0; index < offer.quizes.length; index++) {
      if (answers[index] === offer.quizes[index].correctAnswer) {
        corrects++;
      } else {
        wrongs++;
      }
    }

    if (wrongs !== 0) {
      return res.status(200).json({
        corrects,
        wrongs,
        message: "Failed to pass this offer, try again",
      });
    }

    offer.completedBy.push(req.user._id);
    await offer.save();
    const iterator = redisClient.scanIterator({
      MATCH: "offers:*",
      COUNT: 100,
    });

    for await (const key of iterator) {
      await redisClient.del(key);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: { completedOffers: offerId },
    });

    const newNotification = await Notification.create({
      type: "QUIZ-APP",
      belongsTo: req.user._id,
      metadata: {
        isCollected: false,
        prize: offer.prize,
      },
    });
    const newMessage = await PublicMessage.create({
      type: "FREETIME",
      typeOfTask: "OFFER",
      sender: req.user._id,
    });

    const populatedMessage = await PublicMessage.findById(newMessage._id)
      .populate("sender", userExcludedFields)
      .lean();

    if (populatedMessage) io.emit("public_chat_message", populatedMessage);
    await redisClient.del(`notifications:list:${req.user._id}`);
    return res
      .status(200)
      .json({ corrects, wrongs, message: "successfully completed", notification: newNotification });
  } catch (error) {
    return res.status(404).json({ error: "can't complete offer an error occurred" });
  }
};

export const completingGuessCard = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { offerId } = req.params;
  const completedOffers = req.user.completedOffers;

  try {
    const offer = await Offer.findById(offerId);

    if (!offer) return res.status(404).json({ error: "Offer Not Found" });

    if (offer.isAvailable === "UNAVAILABLE") {
      return res.status(404).json({ error: "sorry, this Offer is not available" });
    }

    const isAlreadyCompleted =
      offer.completedBy.includes(req.user._id) || completedOffers.includes(new Types.ObjectId(offerId));

    if (isAlreadyCompleted)
      return res.status(404).json({ error: "sorry, offer already completed, try another" });

    offer.completedBy.push(req.user._id);
    await offer.save();

    const iterator = redisClient.scanIterator({
      MATCH: "offers:*",
      COUNT: 100,
    });

    for await (const key of iterator) {
      await redisClient.del(key);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: { completedOffers: offerId },
    });

    const newNotification = await Notification.create({
      type: "GUESS-CARD",
      belongsTo: req.user._id,
      metadata: {
        isCollected: false,
        prize: offer.prize,
      },
    });
    const newMessage = await PublicMessage.create({
      type: "FREETIME",
      typeOfTask: "OFFER",
      sender: req.user._id,
    });

    const populatedMessage = await PublicMessage.findById(newMessage._id)
      .populate("sender", userExcludedFields)
      .lean();

    await redisClient.del(`notifications:list:${req.user._id}`);

    if (populatedMessage) io.emit("public_chat_message", populatedMessage);

    return res.status(200).json({ notification: newNotification, message: "passed sucessfully" });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};

export const createOfferReview = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { offerId } = req.params;
  const { comment } = req.body;

  try {
    const offerCacheKey = `offers:details:${offerId}`;

    const offer = await Offer.findById(offerId);

    if (!offer) return res.status(404).json({ error: "offer Not Found" });

    const newOfferReview = await OfferReview.create({ offer: offer._id, user: req.user._id, comment });
    const populatedOfferReview = await OfferReview.findById(newOfferReview._id).populate(
      "user",
      userExcludedFields,
    );

    if (!populatedOfferReview) return res.status(404).json({ error: "an error occurred" });

    offer.reviews.push(populatedOfferReview._id);
    await offer.save();
    await redisClient.del(offerCacheKey);

    return res.status(200).json(populatedOfferReview);
  } catch (error) {
    return res.status(404).json({ error: "can not add review" });
  }
};
