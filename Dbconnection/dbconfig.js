const mysql = require('mysql2');
const express = require('express');
const app = express();
require('dotenv').config();
const dbconnect = mysql.createPool({
  host: process.env.DB_HOST,
  user:process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = dbconnect.promise();
