var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;
var path = require("path");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

let users = [
  {
    id: 0,
    login: "aaa",
    password: "AAA",
    age: 13,
    student: "checked",
    gender: "m",
  },
  { id: 1, login: "bbb", password: "BBB", age: 20, student: "", gender: "k" },
  { id: 2, login: "ccc", password: "ccc", age: 15, student: "", gender: "o" },
  { id: 3, login: "ddd", password: "ddd", age: 11, student: "", gender: "o" },
  { id: 4, login: "eee", password: "eee", age: 17, student: "", gender: "m" },
  { id: 5, login: "fff", password: "fff", age: 18, student: "", gender: "k" },
];

var logged = false;
let user;

//main-------------------------------------------------------------------

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/private/main.html"));
});

app.get("/main", function (req, res) {
  res.sendFile(path.join(__dirname + "/private/main.html"));
});

//register---------------------------------------------

app.get("/register", function (req, res) {
  res.sendFile(path.join(__dirname + "/private/register.html"));
});

app.post("/register", function (req, res) {
  let owned = false;
  for (let i = 0; i < users.length; i++) {
    if (req.body.login == users[i].login) {
      owned = true;
      break;
    }
  }
  if (owned) {
    res.send("istnieje uzytkownik z takim loginem");
  } else {
    let student;
    if (req.body.student == undefined) {
      student = "";
    } else {
      student = "checked";
    }
    users.push({
      id: users.length,
      login: req.body.login,
      password: req.body.password,
      age: req.body.age,
      student: student,
      gender: req.body.gender,
    });
    res.send("rejestracja udana");
  }
});

//login--------------------------------------------------------

app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname + "/private/login.html"));
});

app.post("/login", function (req, res) {
  for (let i = 0; i < users.length; i++) {
    if (
      users[i].login == req.body.login &&
      users[i].password == req.body.password
    ) {
      logged = true;
      user = users[i].id;
      break;
    }
  }
  if (!logged) {
    res.send(`Niepoprawne dane logowania`);
  } else {
    res.sendFile(path.join(__dirname + "/private/admin.html"));
  }
});

//admin-----------------------------------------------------------------------

app.get("/admin", function (req, res) {
  if (logged) res.sendFile(path.join(__dirname + "/private/admin.html"));
  else res.sendFile(path.join(__dirname + "/private/admin2.html"));
});

//logout------------------------------------------------------
app.get("/logout", function (req, res) {
  if (logged) {
    logged = false;
    user = "";
    res.redirect("/");
  } else res.redirect("login");
});

//show-----------------------------
app.get("/show", function (req, res) {
  if (logged) {
    let table = '<table class="table" >';
    for (let i = 0; i < users.length; i++) {
      table += `<tr><td>id: 
      ${users[i].id}</td><td>user: 
      ${users[i].login} -  
      ${users[i].password}</td><td>student: <input type="checkbox" name="student" id="student"
      ${users[i].student} disabled></td><td>age: 
      ${users[i].age}</td><td>gender: 
      ${users[i].gender}</td></tr>`;
    }
    table += "</table>";

    var structure = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/adminstyle.css">
        <title>Admin</title>
    </head>
    
    <body>
        <header>
            <a href="sort">sort</a>
            <a href="gender">gender</a>
            <a href="show">show</a>
        </header>
        ${table}
    </body>
    
    </html>`;
    res.send(structure);
  } else res.sendFile(path.join(__dirname + "/private/admin2.html"));
});

//sort--------------------------------------------------
app.get("/sort", function (req, res) {
  if (logged) {
    let table = '<table class="table" >';
    let tempusers = users;
    tempusers.sort((a, b) => (a.age > b.age ? 1 : -1));
    for (let i = 0; i < tempusers.length; i++) {
      table += `<tr><td>id: 
            ${tempusers[i].id}</td><td>user: 
            ${tempusers[i].login} -  
            ${tempusers[i].password}</td><td>student: <input type="checkbox" name="student" id="student"
            ${tempusers[i].student} disabled></td><td>age: 
            ${tempusers[i].age}</td><td>gender: 
            ${tempusers[i].gender}</td></tr>`;
    }
    table += "</table>";
    let action =
      '<form onchange="this.submit()" method="POST" action="/sort"><input type="radio" name="sort" id="inc" value="inc" checked>incrase   <input type="radio" name="sort" id="dcs" value="dcs" >decrease</form>';
    let structure = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="css/adminstyle.css">
            <title>Admin</title>
        </head>
        
        <body>
            <header>
                <a href="sort">sort</a>
                <a href="gender">gender</a>
                <a href="show">show</a>
            </header>
            ${action}
            ${table}
        </body>
        
        </html>`;
    res.send(structure);
  } else res.sendFile(path.join(__dirname + "/private/admin2.html"));
});

app.post("/sort", function (req, res) {
  if (logged) {
    let status = req.body.sort;
    let action;
    let tempusers = users;
    if (status == "inc") {
      tempusers.sort((a, b) => (a.age > b.age ? 1 : -1));
      action =
        '<form onchange="this.submit()" method="POST" action="/sort"><input type="radio" name="sort" id="inc" value="inc" checked>incrase   <input type="radio" name="sort" id="dcs" value="dcs" >decrease</form>';
    } else if (status == "dcs") {
      tempusers.sort((a, b) => (a.age < b.age ? 1 : -1));
      action =
        '<form onchange="this.submit()" method="POST" action="/sort"><input type="radio" name="sort" id="inc" value="inc" >incrase   <input type="radio" name="sort" id="dcs" value="dcs" >decrease</form>';
    }

    let table = '<table class="table" >';
    for (let i = 0; i < tempusers.length; i++) {
      table += `<tr><td>id: 
            ${tempusers[i].id}</td><td>user: 
            ${tempusers[i].login} -  
            ${tempusers[i].password}</td><td>student: <input type="checkbox" name="student" id="student"
            ${tempusers[i].student} disabled></td><td>age: 
            ${tempusers[i].age}</td><td>gender: 
            ${tempusers[i].gender}</td></tr>`;
    }
    let structure = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="css/adminstyle.css">
            <title>Admin</title>
        </head>
        
        <body>
            <header>
                <a href="sort">sort</a>
                <a href="gender">gender</a>
                <a href="show">show</a>
            </header>
            ${action}
            ${table}
        </body>
        
        </html>`;
    res.send(structure);
  } else res.sendFile(path.join(__dirname + "/private/admin2.html"));
});

//gender--------------------------------------------------------------

app.get("/gender", function (req, res) {
  for (let i = 0; i < users.length; i++) console.log(users[i].gender);
  if (logged) {
    let tabK = '<table class="table" >';
    let tabM = '<table class="table" >';
    let tabO = '<table class="table" >';
    for (let i = 0; i < users.length; i++) {
      switch (users[i].gender) {
        case "k":
          tabK += `<tr><td class="td">id: ${users[i].id}
                    </td><td>plec: ${users[i].gender}
                    </td></tr>`;
          break;
        case "m":
          tabM += `<tr><td class="td">id: ${users[i].id}
                    </td><td>plec: ${users[i].gender}
                    </td></tr>`;
          break;
        case "o":
          tabO += `<tr><td class="td">id: ${users[i].id}
                    </td><td>plec: ${users[i].gender}
                    </td></tr>`;
          break;
        default:
          res.sendFile(path.join(__dirname + "/private/adminNoAccess.html"));
      }
    }
    tabK += "</table>";
    tabM += "</table>";
    tabO += "</table>";

    let structure = `<!DOCTYPE html>
          <html lang="en">
          
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link rel="stylesheet" href="css/adminstyle.css">
              <title>Admin</title>
          </head>
          
          <body>
              <header>
                  <a href="sort">sort</a>
                  <a href="gender">gender</a>
                  <a href="show">show</a>
              </header>
              ${tabO}
              ${tabM}
              ${tabK}
          </body>
          
          </html>`;
    res.send(structure);
  }
});

app.listen(PORT, function () {
  console.log("to jest start serwera na porcie " + PORT);
});
