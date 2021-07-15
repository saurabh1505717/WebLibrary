require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth')
const app = express();

require("./db/conn");
const Register = require("./models/registers");
const { json } = require('express');
const { log } = require('console');


const port = process.env.PORT || 8000;

// PUBLIC STATIC PATH
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);


app.use(express.static(static_path));

// console.log(process.env.SECRET_KEY);

// ROUTING
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/second", (req, res) => {
    // console.log(`this is the cookie awesome${req.cookies.jwt}`);
    res.render("second");
});

app.get("/FP", (req, res) => {
    res.render("FP");
});

app.get("/home", (req, res) => {
    res.render("index");
});

app.get("/Home", (req, res) => {
    res.render("index");
});

app.get("/sem1", (req, res) => {
    res.render("sem1");
});

app.get("/sem2", (req, res) => {
    res.render("sem2");
});

app.get("/back1", (req, res) => {
    res.render("second");
});

app.get("/back2", (req, res) => {
    res.render("second");
});

app.get("/maths1", (req, res) => {
    res.render("maths1");
});

app.get("/maths2", (req, res) => {
    res.render("maths2");
});

// app.get("/register", (req, res) => {
//     res.render("index");
// });
// app.get("/login", (req, res) => {
//     res.render("cong");
// });

// create a new user profile in our database
app.post("/register", async (req, res) => {
    try {

       const password = req.body.password;
       const cpassword = req.body.confirmpassword;

       if(password === cpassword){

        const RegisterData = new Register({
            yourname : req.body.yourname,
            emailid : req.body.emailid,
            password : password,
            confirmpassword : cpassword
        })

        console.log("the success part" + RegisterData);

        const token =  await RegisterData.generateAuthToken();
        console.log("the token part" + token);


        // The res.cookie() function is used to set the cookie name to value.
        // The value parameter may be a string or object converted to JSON.

        res.cookie("jwt", token, {
            expires:new Date(Date.now() + 25892000000),
            httpOnly:true
        });
        console.log(cookie);

        const registered = await RegisterData.save();
        console.log("the page part" + registered);

        res.status(201).render("index");

       }else{
            res.send("password are not matching");
       }

    } catch (error) {
        res.status(400).send(error);
        console.log("the error part page");
    }
});


// Login check
app.post("/login", async(req, res) => {
    try {
        
        const email = req.body.myUserID;
        const password = req.body.myPassword;

        const useremail = await Register.findOne({emailid:email});
        
        const isMatch = bcrypt.compare(password, useremail.password);

        const token =  await useremail.generateAuthToken();
        console.log("the token part" + token);

        res.cookie("jwt", token, {
            expires:new Date(Date.now() + 25892000000),
            httpOnly:true,
            // secure:true
        });

     

        if(isMatch){
            res.status(201).render('cong');
        }else{
            res.send('invalid credentials');
        }

    } catch (error) {
        res.status(400).send("invalid credentials");
        
    }
});

app.get("*", (req, res) => {
    res.render("404error");
});


app.listen(port, () => {
    console.log(`listening to the port ${port}`);
});