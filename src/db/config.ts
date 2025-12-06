import dotenv from "dotenv";
import assert from "assert";
import sql from "mssql";

dotenv.config();

const { SQL_SERVER, SQL_USER, SQL_PWD, SQL_DB, SQL_PORT, PORT } = process.env;

assert(SQL_SERVER, "SQL_SERVER is not set in environment variables");
assert(SQL_USER, "SQL_USER is not set in environment variables");
assert(SQL_PWD, "SQL_PWD is not set in environment variables");
assert(SQL_DB, "SQL_DB is not set in environment variables");

export const config = {
  port: PORT || 5000,
  sqlConfig: {
    user: SQL_USER,
    password: SQL_PWD,
    database: SQL_DB,
    server: SQL_SERVER,
    port: Number(SQL_PORT) || 1433,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: true, // disable if using localhost
      trustServerCertificate: true,
    },
  },
};

let pool: sql.ConnectionPool | null = null;

export const getPool = async () => {
  try {
    if (pool) {
      // If already connected, reuse the existing pool
      return pool;
    }

    pool = await sql.connect(config.sqlConfig);
    console.log("Connected to SQL Server");
    return pool;
  } catch (error) {
    console.error(" SQL Connection Error:", error);
    throw error;
  }
};
