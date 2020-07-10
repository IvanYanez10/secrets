require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require ('md5');
const bcrypt = require('bcrypt');
const app = express();

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// bcrypt conditions
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// Schema task
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Model
const User = mongoose.model("User", userSchema);

app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if (err) {
        console.log(err);
      }else{
        res.render("secrets");
      }
    });
  });

});

app.post("/login", function(req, res) {

  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({
      email: userName
    }, function(err, foundUser) {
      if (!err) {
        if (foundUser) {

          bcrypt.compare(password, foundUser.password, function(err, result) {
            if (result) {
              res.render("secrets");
            }else{
              console.log("Error login");
              res.render("login");
            }
          });

        }
      }
    });

});

app.get("/", function(req, res) {
  res.render('home');
});

app.get("/login", function(req, res) {
  res.render('login');
});

app.get("/register", function(req, res) {
  res.render('register');
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
