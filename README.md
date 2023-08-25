# MLB Statistics Database

Authors: Daniel Murray and Justo H Triana

This is the Portfolio Project for Oregon State University (OSU) class CS340, Introduction to Databases, course taken in the Summer of 2023.

This project features a basic web app for an MLB Statistics Database built with MySQL. The Schema was made in MySQL Workbench. For the user interface, the app uses JavaScript with Node.js. The pages were created using Handlebars.

The app provides all four CRUD (create, read, update, delete) operations in most of its tables. Each table represents an entity like Players, Teams, Games, Locations, Contracts, Batter_Boxscores, etc. Each table is pre-populated with sample data in order to show its functionality.

To run the app, just replace the 'YOUR_DATABASE_NAME_HERE' placeholder in /database/DDL.sql, then enter the appropriate database credentials in /database/db-connector.js, and finally enter the port information at the top of app.js.

Citations:
- All code is based on the given CS340 Starter App. Basic functions were tweaked to work with our database, and many changes were made throughout the code. The structure and primary logic, however, all rely on the CS340 Starter App code provided.
- The background image and the favicon are the original creation of the authors.
