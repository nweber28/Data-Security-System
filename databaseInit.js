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

const inithealthRecords = `
IF NOT EXISTS (SELECT * FROM information_schema.tables WHERE table_name = 'healthRecords') THEN
CREATE TABLE healthRecords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender BOOLEAN,
    age INT,
    weight FLOAT,
    height FLOAT,
    health_history TEXT
);

INSERT INTO healthRecords (first_name, last_name, gender, age, weight, height, health_history) VALUES
('John', 'Doe', TRUE, 25, 70.5, 175.0, 'No significant health issues'),
('Jane', 'Smith', FALSE, 30, 62.0, 160.5, 'Allergic to peanuts'),
('Michael', 'Johnson', TRUE, 45, 80.2, 182.3, 'Hypertension'),
('Emily', 'Williams', FALSE, 28, 55.8, 165.5, 'None'),
('Daniel', 'Brown', TRUE, 35, 78.0, 178.0, 'Type 2 diabetes'),
('Sarah', 'Jones', FALSE, 32, 60.5, 155.0, 'Asthma'),
('Christopher', 'Davis', TRUE, 40, 85.5, 180.5, 'Seasonal allergies'),
('Emma', 'Moore', FALSE, 27, 57.0, 163.0, 'Migraines'),
('William', 'Taylor', TRUE, 38, 82.3, 175.5, 'None'),
('Olivia', 'Wilson', FALSE, 29, 58.7, 162.0, 'Allergic to cats'),
('James', 'Anderson', TRUE, 42, 77.8, 179.0, 'High cholesterol'),
('Sophia', 'Smith', FALSE, 31, 59.5, 161.5, 'None'),
('Alexander', 'White', TRUE, 34, 79.2, 177.5, 'None'),
('Mia', 'Martin', FALSE, 26, 56.3, 164.5, 'None'),
('Benjamin', 'Harris', TRUE, 41, 84.0, 181.0, 'Type 1 diabetes'),
('Ava', 'Clark', FALSE, 33, 61.5, 159.0, 'None'),
('Ethan', 'Thompson', TRUE, 36, 80.5, 176.0, 'None'),
('Isabella', 'Lewis', FALSE, 28, 55.0, 160.0, 'None'),
('Mason', 'Hall', TRUE, 43, 78.7, 182.0, 'None'),
('Grace', 'Young', FALSE, 30, 60.2, 158.5, 'Bronchitis'),
('Logan', 'Moore', TRUE, 37, 81.8, 177.8, 'None'),
('Chloe', 'Adams', FALSE, 27, 56.8, 161.8, 'None'),
('Carter', 'Nelson', TRUE, 44, 79.0, 183.0, 'Type 2 diabetes'),
('Lily', 'Cooper', FALSE, 29, 57.5, 162.5, 'None'),
('Liam', 'Baker', TRUE, 38, 83.2, 178.5, 'None'),
('Madison', 'Ward', FALSE, 31, 59.0, 159.5, 'Pneumonia'),
('Jackson', 'Rivera', TRUE, 45, 82.5, 184.0, 'None'),
('Avery', 'Barnes', FALSE, 32, 58.5, 163.5, 'None'),
('Lucas', 'Hill', TRUE, 39, 77.0, 179.5, 'Heart Disease'),
('Evelyn', 'Coleman', FALSE, 28, 54.5, 160.5, 'None'),
('Jack', 'Evans', TRUE, 40, 80.0, 180.0, 'None'),
('Abigail', 'Long', FALSE, 33, 60.8, 157.5, 'None'),
('Daniel', 'Gonzalez', TRUE, 41, 78.5, 178.8, 'None'),
('Emily', 'Ramirez', FALSE, 27, 55.5, 161.0, 'Asthma'),
('Caleb', 'Fisher', TRUE, 42, 82.0, 182.5, 'None'),
('Harper', 'Lopez', FALSE, 30, 57.2, 158.0, 'None'),
('Grayson', 'Young', TRUE, 43, 79.8, 180.2, 'Obesity'),
('Madison', 'Gomez', FALSE, 29, 56.0, 162.3, 'None'),
('Michael', 'Perez', TRUE, 44, 81.5, 183.0, 'None'),
('Aria', 'Hill', FALSE, 31, 59.8, 158.8, 'Asthma'),
('Jackson', 'Martin', TRUE, 45, 80.0, 181.5, 'None'),
('Scarlett', 'Clark', FALSE, 28, 55.5, 160.0, 'None'),
('Liam', 'Ramirez', TRUE, 46, 83.0, 184.0, 'None'),
('Zoe', 'Cooper', FALSE, 32, 58.0, 161.2, 'None'),
('Carter', 'Hernandez', TRUE, 47, 78.2, 177.5, 'Bone Spurs'),
('Grace', 'Fisher', FALSE, 29, 57.5, 162.8, 'Asthma'),
('Oliver', 'Stewart', TRUE, 48, 82.5, 180.5, 'None'),
('Charlotte', 'Ward', FALSE, 33, 59.0, 158.5, 'Obesity'),
('Aiden', 'Turner', TRUE, 49, 80.8, 178.0, 'None'),
('Aubrey', 'Baker', FALSE, 30, 56.8, 161.0, 'Shellfish Allergy'),
('Lucas', 'Ferguson', TRUE, 50, 83.2, 182.2, 'None'),
('Zoey', 'Mitchell', FALSE, 31, 58.5, 159.5, 'None'),
('Jackson', 'Cooper', TRUE, 51, 79.5, 179.8, 'Bone Cancer'),
('Hannah', 'Turner', FALSE, 32, 57.2, 161.5, 'None'),
('Logan', 'Lewis', TRUE, 52, 81.0, 181.2, 'None'),
('Amelia', 'Ward', FALSE, 33, 58.0, 160.0, 'None'),
('Noah', 'Gonzalez', TRUE, 53, 80.5, 180.8, 'None'),
('Ella', 'Barnes', FALSE, 34, 56.5, 162.5, 'Parkinsons Disease'),
('Liam', 'Mitchell', TRUE, 54, 82.0, 182.0, 'None'),
('Avery', 'Taylor', FALSE, 35, 58.8, 160.8, 'None'),
('Mason', 'Hernandez', TRUE, 55, 79.0, 179.0, 'None'),
('Sophia', 'Ferguson', FALSE, 36, 57.0, 161.8, 'Obesity'),
('Elijah', 'Lopez', TRUE, 56, 81.8, 181.5, 'None'),
('Lily', 'Wright', FALSE, 37, 59.5, 159.0, 'None'),
('Aiden', 'Baker', TRUE, 57, 80.2, 178.2, 'None'),
('Chloe', 'Rivera', FALSE, 38, 57.8, 160.2, 'Replaced Kidney'),
('Lucas', 'Gomez', TRUE, 58, 82.5, 180.5, 'None'),
('Aria', 'Smith', FALSE, 39, 58.2, 162.0, 'None'),
('Oliver', 'Harris', TRUE, 59, 81.0, 179.8, 'None'),
('Evelyn', 'Cooper', FALSE, 40, 56.8, 161.2, 'Rheumatoid Arthritis'),
('Ethan', 'Martin', TRUE, 60, 83.0, 183.0, 'None'),
('Emma', 'Hernandez', FALSE, 41, 58.0, 160.5, 'Back Spasms'),
('Noah', 'Ward', TRUE, 62, 82.5, 178.5, 'None'),
('Olivia', 'Fisher', FALSE, 35, 56.5, 163.0, 'None'),
('Liam', 'Stewart', TRUE, 53, 80.0, 180.2, 'None'),
('Ava', 'Long', FALSE, 44, 59.2, 159.8, 'None'),
('Sophia', 'Ramirez', TRUE, 27, 57.8, 162.5, 'Alzheimers Disease'),
('Jackson', 'Perez', FALSE, 36, 58.5, 161.0, 'None'),
('Ella', 'Lewis', TRUE, 50, 78.5, 177.2, 'None'),
('Mia', 'Wright', FALSE, 32, 56.0, 159.5, 'None'),
('Carter', 'Taylor', TRUE, 45, 80.8, 180.8, 'None'),
('Amelia', 'Hill', FALSE, 38, 58.8, 160.2, 'Depression'),
('Lucas', 'Clark', TRUE, 48, 79.2, 179.0, 'None'),
('Avery', 'Adams', FALSE, 31, 57.5, 161.8, 'None'),
('Ethan', 'Turner', TRUE, 43, 81.0, 182.5, 'None'),
('Harper', 'Anderson', FALSE, 34, 56.2, 160.0, 'Osteoarthritus'),
('Liam', 'Young', TRUE, 49, 79.8, 180.0, 'None'),
('Evelyn', 'Evans', FALSE, 30, 55.8, 162.8, 'None'),
('Mason', 'Baker', TRUE, 47, 78.0, 178.8, 'None'),
('Aria', 'Cooper', FALSE, 33, 58.0, 160.5, 'None'),
('Caleb', 'Mitchell', TRUE, 46, 80.5, 180.5, 'None'),
('Grace', 'Barnes', FALSE, 29, 57.2, 162.0, 'HIV/AIDs'),
('Oliver', 'Gonzalez', TRUE, 42, 79.5, 179.5, 'None'),
('Aurora', 'Williams', FALSE, 37, 59.0, 158.5, 'Lung cancer'),
('Aiden', 'Ferguson', TRUE, 54, 82.2, 181.5, 'Lupus'),
('Zoe', 'Rivera', FALSE, 39, 58.5, 159.5, 'None'),
('Carter', 'Lopez', TRUE, 52, 78.8, 177.8, 'None'),
('Charlotte', 'Turner', FALSE, 36, 56.8, 162.0, 'Breast Cancer'),
('Hunter', 'Coleman', TRUE, 51, 81.0, 180.0, 'None'),
('Scarlett', 'Ward', FALSE, 35, 59.2, 160.8, 'Cystic Fibrosis');
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

function createTable(queryString) {
  return new Promise(async (resolve, reject) => {
    try {
      const [result] = await pool.query(queryString);
    } catch (error) {
      reject(error);
    }
  });
}

createTable(inithealthRecords);
createTable(initCredentials);
createTable(addGroup);

const secretKey = securityFunctions.generateSecretKey();

const secretAssign = `
SET @secretKey = ${secretKey};
UPDATE your_table
SET encrypted_gender = AES_ENCRYPT(gender,@secretkey),
    encrypted_age    = AES_ENCRYPT( CAST(age AS CHAR) , @secretKey); `;

createTable(secretAssign);
