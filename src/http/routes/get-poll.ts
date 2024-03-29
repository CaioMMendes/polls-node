import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { createPollBody, getPollParams } from "../../types/polls-types";
import { redis } from "../../lib/redis";

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:pollId", async (request, reply) => {
    const { pollId } = getPollParams.parse(request.params);

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        PollOption: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!poll) {
      return reply.status(400).send({ message: "Poll not found" });
    }

    //o 0 e -1 significa que é pra pegar todas as opções
    const result = await redis.zrange(pollId, 0, -1, "WITHSCORES");

    const votes = result.reduce((object, column, index) => {
      if (index % 2 === 0) {
        const score = result[index + 1];

        //Object.assign serve para mesclar dois objetos
        Object.assign(object, { [column]: Number(score) });
      }

      return object;
    }, {} as Record<string, number>);

    return reply.status(200).send({
      poll: {
        id: poll.id,
        title: poll.title,
        pollOptions: poll.PollOption.map((option) => {
          return {
            id: option.id,
            title: option.title,
            score: option.id in votes ? votes[option.id] : 0,
          };
        }),
      },
    });
  });
}
