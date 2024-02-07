import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { createPollBody } from "../../types/polls-types";

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request, reply) => {
    const { title, pollOptions } = createPollBody.parse(request.body);

    const poll = await prisma.poll.create({
      data: {
        title,
        PoolOption: {
          createMany: {
            data: pollOptions.map((option) => {
              //se criar aqui dentro não precisa passar o id, como já ta relacionado ele já pega sozinho
              return { title: option };
            }),
          },
        },
      },
    });

    return reply.status(201).send({ pollId: poll.id });
  });
}
