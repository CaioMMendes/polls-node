import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import dotenv from "dotenv";
import { createPollBody } from "../types/polls-types";
import { prisma } from "../lib/prisma";
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { voteOnPoll } from "./routes/vote-on-poll";

dotenv.config();

const app = fastify();

app.register(fastifyCors, {
  origin: [
    process.env.URL_ACCESS1!,
    process.env.URL_ACCESS2!,
    process.env.URL_ACCESS3!,
    process.env.URL_ACCESS4!,
  ],
});

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);

app.listen({ port: Number(process.env.PORT) }).then(() => {
  console.log("Server running on port " + process.env.PORT);
});
