const config = require('config');
const host = config.get('server.host');
const user = config.get('server.user');
const pw = config.get('server.password');
const database = config.get('server.database');

//Connect to database
const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: host,
        user: user,
        password: pw,
        database: database
    },
    console.log('Connected to the election database.')
);

module.exports = db;