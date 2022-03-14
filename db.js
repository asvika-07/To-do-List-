var mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database:"todo"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("use todo", function (err, result) {
    if (err) throw err;
    else
    {
      console.log("Database selected ");
      con.query("CREATE TABLE IF NOT EXISTS users(`id` int(11) NOT NULL AUTO_INCREMENT,`username` varchar(50) NOT NULL,`password` varchar(255) NOT NULL,`role` varchar(20), PRIMARY KEY (`id`))");
      if (err) throw err;
      else{
        console.log("table created");
        con.query("CREATE TABLE IF NOT EXISTS todo(`id` int(11) NOT NULL AUTO_INCREMENT,`username` varchar(50) NOT NULL,`title` varchar(255) NOT NULL,`description` varchar(200),`date` varchar(11), PRIMARY KEY (`id`))");
        if (err) throw err;
        else
        {
          console.log("table created");
        }
      }
    }
  });
});
module.exports = con;