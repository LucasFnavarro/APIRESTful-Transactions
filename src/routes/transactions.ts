import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import crypto, { randomUUID } from "crypto";
import { knex } from "../database";
import { checkSessionIdExists } from "../middleware/check-session-id-exists";

export async function transactionsRoutes(app: FastifyInstance) {
  // Middleware que será executado em todas as rotas deste plugin
  // app.addHook("preHandler", async (request) => {
  //   console.log(`[${request.method}] ${request.url}`);
  // });

  app.get(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select();

      return { transactions };
    }
  );

  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(request.params);

    const { sessionId } = request.cookies;

    const transaction = await knex("transactions")
      .where({
        session_id: sessionId,
        id,
      })
      .first();

    return { transaction };
  });

  app.get(
    "/summary",
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies;

      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();

      return { summary };
    }
  );

  app.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    let { sessionId } = request.cookies;

    if (!sessionId) {
      sessionId = randomUUID();

      // Setando o cookie
      reply.setCookie("sessionId", sessionId, {
        path: "/", // qualquer rota do backend acessa esses cookies
        maxAge: 100 * 60 * 60 * 24 * 7, // Expiração 7 Dias
      });
    }

    await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send({ msg: "Transação concluída!" });
  });
}
