import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent 'username'", async () => {
      const response = await fetch(
        "http:localhost:3000/api/v1/users/UsuarioInexistente", {
        method: "PATCH"
      }
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema",
        action: "Verifique se o username está digitado corretamente",
        status_code: 404,
      });
    });
    test("With duplicated 'username'", async () => {
      const user1Response = await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "user1@email.com",
          password: "senha123",
          role: "gestor",
        }),
      });
      expect(user1Response.status).toBe(201);
      
      const user2Response = await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "user2@email.com",
          password: "senha123",
          role: "gestor",
        }),
      });

      expect(user2Response.status).toBe(201);

      const response = await fetch("http:localhost:3000/api/v1/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar o cadastro.",
        status_code: 400,
      });
    });
  });
});
