import { Redis } from "ioredis";

const redisOptions =
  process.env.REDIS_PORT !== "6379"
    ? {
        port: Number(process.env.REDIS_PORT!), // Redis port
        host: process.env.REDIS_HOSTNAME!, // Redis host
        username: "default", // needs Redis >= 6
        password: process.env.REDIS_PASSWORD!,
        db: 0, // Defaults to 0
      }
    : {};

export const redis = new Redis(redisOptions);
//todo quando for publicar tem que passar as configurações aqui
