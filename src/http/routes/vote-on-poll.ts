import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import {
  createPollBody,
  voteOnPollBody,
  voteOnPollParams,
} from "../../types/polls-types";
import { randomUUID } from "node:crypto";

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/votes", async (request, reply) => {
    const { pollOptionId } = voteOnPollBody.parse(request.body);
    const { pollId } = voteOnPollParams.parse(request.params);

    let { sessionId } = request.cookies;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        //em quais rotas da aplicação eu posso acessar o cookie, / significa todas as rotas
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        signed: true,
        httpOnly: true,
      });
      return reply.status(201);
    }
    return reply.status(400).send({ message: "O usuário já realizou um voto" });
  });
}
