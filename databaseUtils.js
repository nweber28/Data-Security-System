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

function createHealthRecord(first, last, gender, age, weight, height, history) {
  return new Promise(async (resolve, reject) => {
    try {
      if (gender == "male") {
        gender = 1;
      } else {
        gender = 0;
      }
      const [result] = await pool.query(
        "INSERT INTO healthRecords (first_name, last_name, gender, age, weight, height, health_history) VALUES (?,?,?,?,?,?,?)",
        [first, last, gender, age, weight, height, history]
      );

      const id = result.insertId;
      const record = await getRecord(id);

      resolve(record);
    } catch (error) {
      reject(error);
    }
  });
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

async function getUserPermissions(username) {
  try {
    const [groupResults] = await pool.query(
      "SELECT permissions FROM credentials WHERE uname = ?",
      [username]
    );
    return groupResults;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching permission records.");
  }
}

async function getHealthRecords(username) {
  const groupResults = await getUserPermissions(username);
  if (groupResults.length > 0) {
    const userPermissions = groupResults[0].permissions;
    let healthQuery;

    // Determine the healthQuery based on user permissions
    if (userPermissions === "H") {
      healthQuery = "SELECT * FROM healthRecords";
    } else {
      healthQuery =
        "SELECT id, gender, age, weight, height, health_history FROM healthRecords";
      // healthQuery = "SELECT * FROM healthRecords";
    }

    // Query health records
    const healthResults = await pool.query(healthQuery);
    return healthResults;
  } else {
    throw new Error(`User with username ${username} not found.`);
  }
}

module.exports = {
  createRecord,
  getRecord,
  getUserByUsername,
  getHealthRecords,
  getUserPermissions,
  createHealthRecord,
};
