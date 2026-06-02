import { createClient } from "redis";

export const redisClient = createClient({
  username: "default",
  password: "zNazqKRtag5ypBzi83DVMHgIXW8NKu5J",
  socket: {
    host: "redis-19345.crce309.us-east-1-6.ec2.cloud.redislabs.com",
    port: 19345,
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export const connectToRedis = async () => {
  try {
    await redisClient.connect();
    console.log("success connected to Redis cache");
  } catch (error) {
    console.log("Failed to coonect to Redis", error);
  }
};
