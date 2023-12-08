const mysql = require("mysql2");

const dotenv = require("dotenv");
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3006,
  })
  .promise();

async function getUserByUsername(username) {
  const [rows] = await pool.query("SELECT * FROM credentials WHERE uname = ?", [
    username,
  ]);
  return rows[0];
}

async function getRecord(id) {
  const [rows] = await pool.query("SELECT * FROM credentials WHERE id = ?", [
    id,
  ]);
  return rows[0];
}

function createRecord(uname, pword, group) {
  return new Promise(async (resolve, reject) => {
    try {
      const [result] = await pool.query(
        "INSERT INTO credentials (uname, pword, permissions) VALUES (?,?,?)",
        [uname, pword, group]
      );

      const id = result.insertId;
      const record = await getRecord(id);

      resolve(record);
    } catch (error) {
      reject(error);
    }
  });
}

async function getHealthRecords() {
  const healthQuery = "SELECT * FROM healthRecords";
  const result = await pool.query(healthQuery);
  return result;
}

module.exports = {
  createRecord,
  getRecord,
  getUserByUsername,
  getHealthRecords,
};
