import fastify from "fastify";
import cookie from "@fastify/cookie";

import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";

export const app = fastify();

// Para executar o middleware global, colocamos antes das rotas.
// app.addHook("preHandler", async (request) => {
//   console.log(`[${request.method}] ${request.url}`);
// });

app.register(cookie);
app.register(transactionsRoutes, {
  prefix: "transactions",
});

// app.register(transactionsRoutes);
