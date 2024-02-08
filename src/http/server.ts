import cookie from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import fastifyWebsocket from "@fastify/websocket";
import dotenv from "dotenv";
import fastify from "fastify";
import { pollResults } from "../ws/poll-results";
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { voteOnPoll } from "./routes/vote-on-poll";

dotenv.config();

const app = fastify();
app.register(cookie, {
  secret: process.env.COOKIE_SECRET, // for cookies signature
  hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
});

app.register(fastifyWebsocket);

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
app.register(pollResults);

app.listen({ port: Number(process.env.PORT) }).then(() => {
  console.log("Server running on port " + process.env.PORT);
});
