import { createClient } from "redis";

export const redisClient = createClient({
  username: "default",
  password: "7aQKUXw3ktDHsilJGTDvtXq1J3RAbzF0",
  socket: {
    host: "redis-19779.c10.us-east-1-4.ec2.cloud.redislabs.com",
    port: 19779,
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
