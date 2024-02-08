import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { voteOnPollBody, voteOnPollParams } from "../../types/polls-types";
import { redis } from "../../lib/redis";
import { voting } from "../../utils/voting-pub-sub";

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/votes", async (request, reply) => {
    const { pollOptionId } = voteOnPollBody.parse(request.body);
    const { pollId } = voteOnPollParams.parse(request.params);

    let { sessionId } = request.cookies;

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          //busca pelo indice criado no prisma usando o @unique
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      });

      if (
        userPreviousVoteOnPoll &&
        userPreviousVoteOnPoll.pollOptionId !== pollOptionId
      ) {
        //usuario troca o voto
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id,
          },
        });
        const votes = await redis.zincrby(
          pollId,
          -1,
          userPreviousVoteOnPoll.pollOptionId
        );

        voting.publish(pollId, {
          pollOptionId: userPreviousVoteOnPoll.pollOptionId,
          votes: Number(votes),
        });
      } else if (userPreviousVoteOnPoll) {
        return reply
          .status(400)
          .send({ message: "You already vote on this poll" });
      }
    }

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        //em quais rotas da aplicação eu posso acessar o cookie, / significa todas as rotas
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        signed: true,
        httpOnly: true,
      });
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    });

    const votes = await redis.zincrby(pollId, 1, pollOptionId);

    voting.publish(pollId, {
      pollOptionId,
      votes: Number(votes),
    });

    return reply.status(201).send(sessionId);
  });
}
