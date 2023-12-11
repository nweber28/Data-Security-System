Project Setup
1. Clone This Repository.
2. Once the code is cloned into one of your local directories be sure to install Node (download should include npm as well) as our code structure and execution relies on these two tools.
3. Next for the database tools XAMPP must be installed in order to host the database.
4. Once these dependencies are installed, navigate to the directory that contains server.js within the downloaded code folder.
5. Create a file within this directory called ‘.env’. This file will contain environment variables that allow for a connection to the database

6. Within this .env folder, paste the following:
SESSION_SECRET=secret
MYSQL_HOST = '127.0.0.1'
MYSQL_USER = 'root'
MYSQL_PASSWORD = ''
MYSQL_DATABASE = 'security'

7. IMPORTANT: Navigate to your XAMPP Application and configure the Apache Web Server to be running on port 80. Similarly ensure MYSQL Database is configured to run on port 3006.

8. Next, start both MYSQL Database and Apache Web Server and make sure that they are both up and running
9. Navigate back to your terminal and inside the directory containing the server.js file. From there enter the command ‘npm install’. This will install the node_modules needed for our project.
10. Next type localhost/phpmyadmin into your search bar and hit enter. This should bring you to the MYSQL database page. Create a new database named ‘security’. If one with this exact name exists already, delete/rename it to another name. We will need an empty database with no tables named ‘security’ for the connection to work correctly.

12. Navigate back to your terminal and issue the command ‘npm run db-init’. This should populate the ‘security’ database with two tables: credentials and healthRecords.
- The credentials table will hold registration information
- The healthRecords table will be populated with 100 records of data
13. Once these tables have been populated, navigate back to your terminal and terminate the command (typically ctrl + c).
Once this is done, issue the command ‘npm run dev-start’. This will launch our application on http://localhost:3007/ .

It should be all set up from here!

