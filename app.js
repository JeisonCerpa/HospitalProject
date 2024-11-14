const express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
const path = require('path');
const ejs = require('ejs');
const multer = require('multer');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const expressValidator = require('express-validator');
const sweetalert = require('sweetalert2');
const bodyParser = require('body-parser');
const http = require('http');
const db = require('./models/db_controller');
const signup = require('./controllers/signup');
const login = require('./controllers/login');
const verify = require('./controllers/verify');
var reset = require('./controllers/reset_controller');
var doctors = require('./controllers/doc_controller');
var employee = require('./controllers/employee');
var appointment = require('./controllers/appointment');
var store = require('./controllers/store');
var receipt = require('./controllers/receipt');
var complain = require('./controllers/complain');
var home = require('./controllers/home');
var patients = require('./controllers/patients');

const app = express();

app.set('view engine', 'ejs');

const server = http.createServer(app);

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookie());

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto: ${port}`);
});

app.use('/signup', signup);
app.use('/login', login);
app.use('/home', home);
app.use('/verify', verify);
app.use('/reset', reset);
app.use('/doctors', doctors);
app.use('/employee', employee);
app.use('/appointment', appointment);
app.use('/store', store);
app.use('/receipt', receipt);
app.use('/complain', complain);
app.use('/patients', patients);