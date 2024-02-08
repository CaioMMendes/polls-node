import { FastifyInstance } from "fastify";
import { getPollParams } from "../types/polls-types";
import { voting } from "../utils/voting-pub-sub";

export async function pollResults(app: FastifyInstance) {
  app.get(
    "/polls/:pollId/results",
    {
      websocket: true,
    },
    (connection, request) => {
      //inscrever apenas nas mensagens publicadas no canal com o id da enquete

      const { pollId } = getPollParams.parse(request.params);

      voting.subscribe(pollId, (message) => {
        connection.socket.send(JSON.stringify(message));
      });
    }
  );
}

//pub/sub - publish
