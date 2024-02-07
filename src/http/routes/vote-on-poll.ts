import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import {
  createPollBody,
  voteOnPollBody,
  voteOnPollParams,
} from "../../types/polls-types";

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/votes", async (request, reply) => {
    const { pollOptionId } = voteOnPollBody.parse(request.body);
    const { pollId } = voteOnPollParams.parse(request.params);

    return reply.status(201);
  });
}
