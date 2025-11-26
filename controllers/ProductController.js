import express from "express";
import { Client } from "pg";

const router = express.Router();

const con = new Client({
  host: "localhost",
  user: "postgres",
  password: "v155179m20",
  database: "postgres",
  port: 5432,
});

con
  .connect()
  .then(() => console.log("Postgres is connected!!!"))
  .catch((err) => console.error(err));



export default router;
