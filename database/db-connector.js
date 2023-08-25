// ./database/db-connector.js

// get an instance of mysql we can use in the app
const mysql = require('mysql');

// create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'YOUR_HOST_HERE',
    user            : 'YOUR_DATABASE_USERNAME_HERE',
    password        : 'YOUR_DATABASE_PASSWORD_HERE',
    database        : 'YOUR_DATABASE_NAME_HERE'
});

// export it for use in our application
module.exports.pool = pool;