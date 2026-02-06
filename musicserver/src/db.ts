// import sqlite3 from "sqlite3";
// import { log } from "./utils";

// export const db = new sqlite3.Database(
//   "./db.db",
//   sqlite3.OPEN_READWRITE,
//   (err) => {
//     if (err) {
//       log(JSON.stringify(err));
//       createDatabase();
//     } else {
//       log("Connected to database");
//     }
//   },
// );

// function createDatabase() {
//   const newDB = new sqlite3.Database("db.db", (err) => {
//     if (err) {
//       log("Couldn't create database due to: " + JSON.stringify(err));
//     } else {
//       createTables(newDB);
//     }
//   });
// }

// function createTables(newDB: sqlite3.Database) {
//   newDB.exec(`
//   CREATE TABLE users (
//     username TEXT UNIQUE NOT NULL,
//     upvotes INTEGER DEFAULTS(0),
//     downvotes INTEGER DEFAULTS(0)
//   )`);
// }
