const express = require("express");
const res = require("express/lib/response");
const app = express();
const path = require('path');
var con = require('./db');
// import con from './db';

app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use("/static", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});
app.get("/signup",function(request,response)
{
    response.sendFile(path.join(__dirname + '/signup.html'));
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				// Authenticate the user
                if (results[0].role == "admin")
                {
                    response.redirect('/admin');   
                }
                else
				// Redirect to home page
				    response.redirect(`/home/${results[0].username}`);
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
app.post('/newuser', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
    let role = request.body.role;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
        var sql=`insert into users (username,password,role) values ("${username}","${password}","${role}")`;
		con.query(sql,function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
            else
            {
                if (role == "admin")
				    response.redirect('/admin');
                else
                    response.redirect('/home/'+username);
			 } 	
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/todo', function(request, response) {
	// Capture the input fields
    let username=request.body.username;
	let title = request.body.title;
	let description = request.body.description;
    let deadline = request.body.deadline;
	// Ensure the input fields exists and are not empty
	if (title && description) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
        var sql=`insert into todo (username,title,description,date) values ("${username}","${title}","${description}","${deadline}")`;
		con.query(sql,function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
            else
            {
			    response.redirect('/home/'+username);
			 } 	
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


app.get('/admin',function(request,response)
{
    var sql=`Select * from todo order by username `;
    con.query(sql,function(error, results) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        else
        {
            response.render('adminhome.html',{results:results});
        }
    });
       
}
);


app.get('/home/edit/:id',function(request,response)
{
    var id=request.params.id;
    var sql=` select username from todo where id = "${id}" `;
    con.query(sql,function(error,results){
        if (error) throw error
        else{
            var username=results[0].username;
            sql=`delete from todo where id = "${id}" `;
            con.query(sql,function(error,results){
                if (error) throw error
                else{
                    response.redirect('/home/'+username);
                }
            })
        }
    })

});

app.get('/home/delete/:id',function(request,response)
{
    var id=request.params.id;
    var sql=` select username from todo where id = "${id}" `;
    con.query(sql,function(error,results){
        if (error) throw error
        else{
            var username=results[0].username;
            sql=`delete from todo where id = "${id}" `;
            con.query(sql,function(error,results){
                if (error) throw error
                else{
                    response.redirect('/home/'+username);
                }
            })
        }
    })

});

app.get('/home/:username', function(request, response) {
    // response.send("HELLO"+request.params.username);
    var name=request.params.username;
    var sql=`Select * from todo where username = "${name}"`;
    con.query(sql,function(error, results) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        else
        {
            response.render('todo.html',{name:name,results:results});
        }
    });
    
});

app.listen(3000, () => console.log("Server Up and running"));
