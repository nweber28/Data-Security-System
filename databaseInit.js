const securityFunctions = require("./securityUtils");

const mysql = require("mysql2");

const dotenv = require("dotenv");
dotenv.config();

// connect to database
const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3006,
  })
  .promise();

function createTable(queryString) {
  return pool
    .query(queryString)
    .then(([result]) => result)
    .catch((error) => {
      throw error;
    });
}

const inithealthRecords = `
IF NOT EXISTS (SELECT * FROM information_schema.tables WHERE table_name = 'healthRecords') THEN
CREATE TABLE healthRecords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(255),
    age int(255),
    weight FLOAT,
    height FLOAT,
    health_history TEXT,
    encrypted_gender VARBINARY(255),
    encrypted_age VARBINARY(255)
);

INSERT INTO healthRecords (first_name, last_name, gender, age, weight, height, health_history) VALUES
('John', 'Doe', 'MALE', 25, 70.5, 175.0, 'No significant health issues'),
('Jane', 'Smith', 'FEMALE', 30, 62.0, 160.5, 'Allergic to peanuts'),
('Michael', 'Johnson', 'MALE', 45, 80.2, 182.3, 'Hypertension'),
('Emily', 'Williams', 'FEMALE', 28, 55.8, 165.5, 'None'),
('Daniel', 'Brown', 'MALE', 35, 78.0, 178.0, 'Type 2 diabetes'),
('Sarah', 'Jones', 'FEMALE', 32, 60.5, 155.0, 'Asthma'),
('Christopher', 'Davis', 'MALE', 40, 85.5, 180.5, 'Seasonal allergies'),
('Emma', 'Moore', 'FEMALE', 27, 57.0, 163.0, 'Migraines'),
('William', 'Taylor', 'MALE', 38, 82.3, 175.5, 'None'),
('Olivia', 'Wilson', 'FEMALE', 29, 58.7, 162.0, 'Allergic to cats'),
('James', 'Anderson', 'MALE', 42, 77.8, 179.0, 'High cholesterol'),
('Sophia', 'Smith', 'FEMALE', 31, 59.5, 161.5, 'None'),
('Alexander', 'White', 'MALE', 34, 79.2, 177.5, 'None'),
('Mia', 'Martin', 'FEMALE', 26, 56.3, 164.5, 'None'),
('Benjamin', 'Harris', 'MALE', 41, 84.0, 181.0, 'Type 1 diabetes'),
('Ava', 'Clark', 'FEMALE', 33, 61.5, 159.0, 'None'),
('Ethan', 'Thompson', 'MALE', 36, 80.5, 176.0, 'None'),
('Isabella', 'Lewis', 'FEMALE', 28, 55.0, 160.0, 'None'),
('Mason', 'Hall', 'MALE', 43, 78.7, 182.0, 'None'),
('Grace', 'Young', 'FEMALE', 30, 60.2, 158.5, 'Bronchitis'),
('Logan', 'Moore', 'MALE', 37, 81.8, 177.8, 'None'),
('Chloe', 'Adams', 'FEMALE', 27, 56.8, 161.8, 'None'),
('Carter', 'Nelson', 'MALE', 44, 79.0, 183.0, 'Type 2 diabetes'),
('Lily', 'Cooper', 'FEMALE', 29, 57.5, 162.5, 'None'),
('Liam', 'Baker', 'MALE', 38, 83.2, 178.5, 'None'),
('Madison', 'Ward', 'FEMALE', 31, 59.0, 159.5, 'Pneumonia'),
('Jackson', 'Rivera', 'MALE', 45, 82.5, 184.0, 'None'),
('Avery', 'Barnes', 'FEMALE', 32, 58.5, 163.5, 'None'),
('Lucas', 'Hill', 'MALE', 39, 77.0, 179.5, 'Heart Disease'),
('Evelyn', 'Coleman', 'FEMALE', 28, 54.5, 160.5, 'None'),
('Jack', 'Evans', 'MALE', 40, 80.0, 180.0, 'None'),
('Abigail', 'Long', 'FEMALE', 33, 60.8, 157.5, 'None'),
('Daniel', 'Gonzalez', 'MALE', 41, 78.5, 178.8, 'None'),
('Emily', 'Ramirez', 'FEMALE', 27, 55.5, 161.0, 'Asthma'),
('Caleb', 'Fisher', 'MALE', 42, 82.0, 182.5, 'None'),
('Harper', 'Lopez', 'FEMALE', 30, 57.2, 158.0, 'None'),
('Grayson', 'Young', 'MALE', 43, 79.8, 180.2, 'Obesity'),
('Madison', 'Gomez', 'FEMALE', 29, 56.0, 162.3, 'None'),
('Michael', 'Perez', 'MALE', 44, 81.5, 183.0, 'None'),
('Aria', 'Hill', 'FEMALE', 31, 59.8, 158.8, 'Asthma'),
('Jackson', 'Martin', 'MALE', 45, 80.0, 181.5, 'None'),
('Scarlett', 'Clark', 'FEMALE', 28, 55.5, 160.0, 'None'),
('Liam', 'Ramirez', 'MALE', 46, 83.0, 184.0, 'None'),
('Zoe', 'Cooper', 'FEMALE', 32, 58.0, 161.2, 'None'),
('Carter', 'Hernandez', 'MALE', 47, 78.2, 177.5, 'Bone Spurs'),
('Grace', 'Fisher', 'FEMALE', 29, 57.5, 162.8, 'Asthma'),
('Oliver', 'Stewart', 'MALE', 48, 82.5, 180.5, 'None'),
('Charlotte', 'Ward', 'FEMALE', 33, 59.0, 158.5, 'Obesity'),
('Aiden', 'Turner', 'MALE', 49, 80.8, 178.0, 'None'),
('Aubrey', 'Baker', 'FEMALE', 30, 56.8, 161.0, 'Shellfish Allergy'),
('Lucas', 'Ferguson', 'MALE', 50, 83.2, 182.2, 'None'),
('Zoey', 'Mitchell', 'FEMALE', 31, 58.5, 159.5, 'None'),
('Jackson', 'Cooper', 'MALE', 51, 79.5, 179.8, 'Bone Cancer'),
('Hannah', 'Turner', 'FEMALE', 32, 57.2, 161.5, 'None'),
('Logan', 'Lewis', 'MALE', 52, 81.0, 181.2, 'None'),
('Amelia', 'Ward', 'FEMALE', 33, 58.0, 160.0, 'None'),
('Noah', 'Gonzalez', 'MALE', 53, 80.5, 180.8, 'None'),
('Ella', 'Barnes', 'FEMALE', 34, 56.5, 162.5, 'Parkinsons Disease'),
('Liam', 'Mitchell', 'MALE', 54, 82.0, 182.0, 'None'),
('Avery', 'Taylor', 'FEMALE', 35, 58.8, 160.8, 'None'),
('Mason', 'Hernandez', 'MALE', 55, 79.0, 179.0, 'None'),
('Sophia', 'Ferguson', 'FEMALE', 36, 57.0, 161.8, 'Obesity'),
('Elijah', 'Lopez', 'MALE', 56, 81.8, 181.5, 'None'),
('Lily', 'Wright', 'FEMALE', 37, 59.5, 159.0, 'None'),
('Aiden', 'Baker', 'MALE', 57, 80.2, 178.2, 'None'),
('Chloe', 'Rivera', 'FEMALE', 38, 57.8, 160.2, 'Replaced Kidney'),
('Lucas', 'Gomez', 'MALE', 58, 82.5, 180.5, 'None'),
('Aria', 'Smith', 'FEMALE', 39, 58.2, 162.0, 'None'),
('Oliver', 'Harris', 'MALE', 59, 81.0, 179.8, 'None'),
('Evelyn', 'Cooper', 'FEMALE', 40, 56.8, 161.2, 'Rheumatoid Arthritis'),
('Ethan', 'Martin', 'MALE', 60, 83.0, 183.0, 'None'),
('Emma', 'Hernandez', 'FEMALE', 41, 58.0, 160.5, 'Back Spasms'),
('Noah', 'Ward', 'MALE', 62, 82.5, 178.5, 'None'),
('Olivia', 'Fisher', 'FEMALE', 35, 56.5, 163.0, 'None'),
('Liam', 'Stewart', 'MALE', 53, 80.0, 180.2, 'None'),
('Ava', 'Long', 'FEMALE', 44, 59.2, 159.8, 'None'),
('Sophia', 'Ramirez', 'MALE', 27, 57.8, 162.5, 'Alzheimers Disease'),
('Jackson', 'Perez', 'FEMALE', 36, 58.5, 161.0, 'None'),
('Ella', 'Lewis', 'MALE', 50, 78.5, 177.2, 'None'),
('Mia', 'Wright', 'FEMALE', 32, 56.0, 159.5, 'None'),
('Carter', 'Taylor', 'MALE', 45, 80.8, 180.8, 'None'),
('Amelia', 'Hill', 'FEMALE', 38, 58.8, 160.2, 'Depression'),
('Lucas', 'Clark', 'MALE', 48, 79.2, 179.0, 'None'),
('Avery', 'Adams', 'FEMALE', 31, 57.5, 161.8, 'None'),
('Ethan', 'Turner', 'MALE', 43, 81.0, 182.5, 'None'),
('Harper', 'Anderson', 'FEMALE', 34, 56.2, 160.0, 'Osteoarthritus'),
('Liam', 'Young', 'MALE', 49, 79.8, 180.0, 'None'),
('Evelyn', 'Evans', 'FEMALE', 30, 55.8, 162.8, 'None'),
('Mason', 'Baker', 'MALE', 47, 78.0, 178.8, 'None'),
('Aria', 'Cooper', 'FEMALE', 33, 58.0, 160.5, 'None'),
('Caleb', 'Mitchell', 'MALE', 46, 80.5, 180.5, 'None'),
('Grace', 'Barnes', 'FEMALE', 29, 57.2, 162.0, 'HIV/AIDs'),
('Oliver', 'Gonzalez', 'MALE', 42, 79.5, 179.5, 'None'),
('Aurora', 'Williams', 'FEMALE', 37, 59.0, 158.5, 'Lung cancer'),
('Aiden', 'Ferguson', 'MALE', 54, 82.2, 181.5, 'Lupus'),
('Zoe', 'Rivera', 'FEMALE', 39, 58.5, 159.5, 'None'),
('Carter', 'Lopez', 'MALE', 52, 78.8, 177.8, 'None'),
('Charlotte', 'Turner', 'FEMALE', 36, 56.8, 162.0, 'Breast Cancer'),
('Hunter', 'Coleman', 'MALE', 51, 81.0, 180.0, 'None'),
('Scarlett', 'Ward', 'FEMALE', 35, 59.2, 160.8, 'Cystic Fibrosis');
END IF;`;

const initCredentials = `CREATE TABLE IF NOT EXISTS credentials (
  id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  uname varchar(50) NOT NULL,
  pword varchar(100) NOT NULL
);`;

const addGroup = `IF NOT EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_name = 'credentials'
  AND column_name = 'permissions'
) THEN
  ALTER TABLE credentials
  ADD COLUMN permissions CHAR(1) NOT NULL;
END IF;
`;

createTable(inithealthRecords);
createTable(initCredentials);
createTable(addGroup);

const secretKey = securityFunctions.generateSecretKey();

(async () => {
  const connection = await pool.getConnection();

  try {
    // Set the secret key
    await connection.query("SET @secretKey = '${secretKey}'");

    // Update encrypted columns
    const updateQuery = `
      UPDATE security.healthRecords
      SET 
        encrypted_gender = AES_ENCRYPT(CONCAT(id, gender), @secretKey),
        encrypted_age = AES_ENCRYPT(CONCAT(id, CAST(age AS CHAR)), @secretKey);
    `;

    await connection.query(updateQuery);

    // Delete 'age' and 'gender' columns
    const deleteColumnsQuery = `
      ALTER TABLE security.healthRecords
      DROP COLUMN age,
      DROP COLUMN gender;
    `;

    await connection.query(deleteColumnsQuery);

    // Rename 'encrypted_age' and 'encrypted_gender' columns
    const renameColumnsQuery = `
      ALTER TABLE security.healthRecords
      CHANGE COLUMN encrypted_age age VARBINARY(255),
      CHANGE COLUMN encrypted_gender gender VARBINARY(255);
    `;

    await connection.query(renameColumnsQuery);

    console.log("Update successful");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    connection.release();
  }
})();
