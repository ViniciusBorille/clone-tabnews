import { Client } from "pg";
import { ServiceError } from "./errors";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com o Banco ou na Query.",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client(getConnectionConfig());

  await client.connect();
  return client;
}

function getConnectionConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: getSSLConfig(),
    };
  }

  return {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLConfig(),
  };
}

function getDatabaseName() {
  if (process.env.POSTGRES_DB) {
    return process.env.POSTGRES_DB;
  }

  if (!process.env.DATABASE_URL) {
    return undefined;
  }

  const parsedConnectionString = new URL(process.env.DATABASE_URL);
  return parsedConnectionString.pathname.replace("/", "") || undefined;
}

function getSSLConfig() {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  return {
    rejectUnauthorized: false,
  };
}

const database = {
  query,
  getNewClient,
  getConnectionConfig,
  getDatabaseName,
};

export default database;
