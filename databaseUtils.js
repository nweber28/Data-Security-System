const mysql = require("mysql2");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const securityFunctions = require("./securityUtils.js");

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

function generateRandomSalt(length) {
  return crypto.randomBytes(length);
}

function encryptAge(age) {
  const ageString = age.toString();

  // Generate a random salt
  const salt = generateRandomSalt(16); // 16 bytes for AES-256

  // Use AES encryption
  const cipher = crypto.createCipheriv(
    "aes-256-ecb",
    Buffer.alloc(32),
    Buffer.alloc(0)
  );
  const encryptedData = Buffer.concat([
    cipher.update(ageString, "utf8"),
    cipher.final(),
  ]);

  // Concatenate salt and encrypted data
  const encryptedValue = Buffer.concat([salt, encryptedData]);

  // Convert the result to a hexadecimal string
  const encryptedHexString = encryptedValue.toString("hex");

  return encryptedHexString;
}

function encryptGender(gender) {
  const salt = generateRandomSalt(16); // 16 bytes for AES-256

  // Use AES encryption
  const cipher = crypto.createCipheriv(
    "aes-256-ecb",
    Buffer.alloc(32),
    Buffer.alloc(0)
  );
  const encryptedData = Buffer.concat([
    cipher.update(gender, "utf8"),
    cipher.final(),
  ]);

  // Concatenate salt and encrypted data
  const encryptedValue = Buffer.concat([salt, encryptedData]);

  // Convert the result to a hexadecimal string
  const encryptedHexString = encryptedValue.toString("hex");

  return encryptedHexString;
}

function createHealthRecord(first, last, gender, age, weight, height, history) {
  return new Promise(async (resolve, reject) => {
    try {
      gender = encryptGender(gender);
      age = encryptAge(age);

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
    }

    // Query health records
    const healthResults = await pool.query(healthQuery);

    const dataIntegrity = securityFunctions.digitalSignature(healthResults);

    // alert user if data integrity is compromised
    if (!dataIntegrity) {
      console.error("Data Integrity Compromised!");
    }

    return { healthResults, dataIntegrity };
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
