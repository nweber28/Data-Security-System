
Project Setup Guide
===================

Follow the steps below to set up the project on your local machine:

Prerequisites
-------------
Before starting, ensure you have the following installed:

- Node.js & npm: https://nodejs.org/ (npm is included)
- XAMPP: https://www.apachefriends.org/index.html (used to host the MySQL database)

Setup Steps
-----------

1. Clone the Repository:
   git clone <repository-url>

2. Install Project Dependencies:
   Navigate to the project directory (the folder containing server.js) and run:
   npm install

3. Database Configuration:

   a. Install & Configure XAMPP:
      - Launch the XAMPP Control Panel
      - Configure the following:
        * Apache Web Server: Port 80
        * MySQL Database: Port 3306 (default for MySQL)

      NOTE: If you use a custom port for MySQL, update your .env file accordingly.

      Start both Apache and MySQL services.

4. Create Environment Variables:
   In the same directory as server.js, create a file named `.env` with the following content:

   SESSION_SECRET=secret
   MYSQL_HOST=127.0.0.1
   MYSQL_USER=root
   MYSQL_PASSWORD=
   MYSQL_DATABASE=security

   NOTE: If you set a password for your MySQL root user, update the MYSQL_PASSWORD field accordingly.

5. Database Setup:
   - Open your browser and go to: http://localhost/phpmyadmin
   - Create a new database named 'security'
     * If a database named 'security' already exists, delete or rename it

6. Initialize the Database:
   Run the following command to populate the database with required tables and mock data:

   npm run db-init

   This will create:
   - credentials table: stores registration information
   - healthRecords table: pre-populated with 100 sample records

   Once complete, terminate the process using Ctrl + C.

7. Start the Application:
   Launch the development server with:

   npm run dev-start

   The application will be accessible at: http://localhost:3007
