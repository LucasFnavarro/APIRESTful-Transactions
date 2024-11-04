import { expect, it, beforeAll, afterAll, describe, beforeEach } from "vitest";
import { exec, execSync } from "node:child_process";
import request from "supertest";
import { app } from "../src/app";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("o usuário consegue criar uma nova transação", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "Transaction de teste auto",
        amount: 500,
        type: "credit",
      })
      .expect(201); 

    // console.log(response.get("Set-Cookie"));
    //   expect(response.statusCode).toEqual(201);
  });

  it("o usuário consegue listar todas transações feita por ele", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Transaction de teste auto",
        amount: 500,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie") || [];

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "Transaction de teste auto",
        amount: 500,
      }),
    ]);
  });
});
