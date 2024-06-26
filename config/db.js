import mysql from "mysql2";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "epl",
  waitForConnections: true,
});

export default db.promise();
