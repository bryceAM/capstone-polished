require('dotenv').config();
const { Client } = require('pg');

const DB_NAME = 'capstone_project';
const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`;

let client;

// github actions client config
if (process.env.CI) {
    client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'postgres'
    });
} else {
    // local or heroku client config
    client = new Client(DB_URL);
}

module.exports = client;