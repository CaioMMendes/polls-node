import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { createPollBody, getPollParams } from "../../types/polls-types";

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

    return reply.status(200).send({ poll });
  });
}
