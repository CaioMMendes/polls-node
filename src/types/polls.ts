import z from "zod";

export const createPollBody = z.object({
  title: z.string().min(1),
  pollOptions: z.array(z.string()),
});

export const getPollParams = z.object({
  pollId: z.string().uuid(),
});
