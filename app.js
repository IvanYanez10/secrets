require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Schema task
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:['password']});
// Model
const User = mongoose.model("User", userSchema);

app.post("/register", function(req, res) {

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    }else{
      res.render("secrets");
    }
  });

});

app.post("/login", function(req, res) {

  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({
      email: userName
    }, function(err, foundUser) {
      if (foundUser) {
        if (foundUser.password === password) {
          console.log("Succes login!");
          res.render("secrets");
        }else{
          console.log("No match pass");
        }
      }else{
        console.log("No match user");
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
