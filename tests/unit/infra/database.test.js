import database from "infra/database.js";

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = originalEnv;
});

describe("infra/database", () => {
  test("uses DATABASE_URL when available", () => {
    process.env.DATABASE_URL =
      "postgresql://neon_owner:secret@ep-preview.us-east-2.aws.neon.tech/agrdrive?sslmode=require";
    process.env.NODE_ENV = "production";

    expect(database.getConnectionConfig()).toEqual({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  });

  test("falls back to POSTGRES_* variables", () => {
    process.env.POSTGRES_HOST = "localhost";
    process.env.POSTGRES_PORT = "5433";
    process.env.POSTGRES_USER = "postgres";
    process.env.POSTGRES_DB = "agrdrive";
    process.env.POSTGRES_PASSWORD = "postgres";
    process.env.NODE_ENV = "test";

    expect(database.getConnectionConfig()).toEqual({
      host: "localhost",
      port: "5433",
      user: "postgres",
      database: "agrdrive",
      password: "postgres",
      ssl: false,
    });
  });

  test("extracts database name from DATABASE_URL when POSTGRES_DB is absent", () => {
    delete process.env.POSTGRES_DB;
    process.env.DATABASE_URL =
      "postgresql://neon_owner:secret@ep-preview.us-east-2.aws.neon.tech/agrdrive?sslmode=require";

    expect(database.getDatabaseName()).toBe("agrdrive");
  });
});
