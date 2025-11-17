// database connection setup using mysql

let mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "1234"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;