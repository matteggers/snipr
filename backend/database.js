const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.envPG_URI,
});

module.exports = pool;