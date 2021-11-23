import { ConnectionOptions } from "typeorm";
import { Wallet } from "../models";

let config: ConnectionOptions;
if (process.env.DATABASE_URL) {
  config = {
    type: "postgres",
    entities: [Wallet],
    synchronize: true,
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  }
} else {
  config = {
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB || "coldfront_poc_ts_api",
    ssl: process.env.POSTGRES_SSL ? { rejectUnauthorized: true } : false,
    entities: [Wallet],
    synchronize: true,
  };
}

export default config;