const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Debalina@2025!', 
  database: 'job_portal_open_source'
});

connection.connect((err) => {
  if (err) {
    console.error(' MySQL connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = connection;