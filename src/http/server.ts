import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createPollBody } from "../types/polls";

dotenv.config();

const app = fastify();

const prisma = new PrismaClient();

app.register(fastifyCors, {
  origin: [
    process.env.URL_ACCESS1!,
    process.env.URL_ACCESS2!,
    process.env.URL_ACCESS3!,
    process.env.URL_ACCESS4!,
  ],
});

app.post("/polls", async (request, reply) => {
  const { title } = createPollBody.parse(request.body);

  const poll = await prisma.poll.create({
    data: { title },
  });
  return reply.status(201).send({ pollId: poll.id });
});

app.listen({ port: Number(process.env.PORT) }).then(() => {
  console.log("Server running on port " + process.env.PORT);
});
