import fs from "node:fs/promises";
import path from "node:path";
import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline";
import dotenv from "dotenv";
import mariadb from "mariadb";

const DB_KEYS = ["DB_HOST", "DB_USER", "DB_PASSWORD"];
const DIRS = ["./server/uploads"];

dotenv.config();

for (const key of DB_KEYS) {
  if (!(key in process.env)) {
    console.error(`${key} required`);
    process.exit(1);
  }
}

const rl = readline.createInterface({ input, output });
rl.question("This will permanently delete existing `blogs` database.\nContinue? [y/n] ", (answer) => {
  rl.close();
  answer = answer.trim();
  if (answer.toLowerCase() === "y") {
    setup();
  } else {
    console.log("aborted");
  }
});

async function setup() {
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    console.log("connected with database");

    const sql = await fs.readFile("./server/db.sql", "utf8");
    console.log("./server/db.sql read");
    console.log("executing SQL statements...");
    conn.query(sql);
    console.log("SQL statements executed");

    const serverDirContents = await fs.readdir("./server");
    for (const dir of DIRS) {
      if (serverDirContents.includes(path.basename(dir))) {
        console.log(`${dir} alredy exists! skipping...`);
      } else {
        await fs.mkdir(dir);
        console.log(`${dir} created`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) {
      conn.end();
    }
  }
}
