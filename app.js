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
const http = require('http');
const db = require('./models/db_controller'); // Corregir la ruta del módulo
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
var logout = require('./controllers/logout');
const checkPermissions = require('./models/checkPermissions'); // Importar el middleware

const app = express();

app.set('view engine', 'ejs');

const server = http.createServer(app);

app.use(express.static('./public'));
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // for form data
app.use(cookie());

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto: ${port}`);
});

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// Aplicar el middleware a las rutas que requieren permisos
app.use('/signup', signup);
app.use('/login', (req, res, next) => {
  // ...existing login logic...
  // Después de una autenticación exitosa, almacena el rol del usuario en las cookies
  res.cookie('userRole', userRole); // Asegúrate de que userRole esté definido
  next();
});
app.use('/home', home);
app.use('/verify', verify);
app.use('/reset', reset);
app.use('/doctors', checkPermissions('view_doctors'), doctors);
app.use('/employee', checkPermissions('view_employees'), employee);
app.use('/appointment', checkPermissions('view_appointments'), appointment);
app.use('/store', checkPermissions('view_store'), store);
app.use('/receipt', receipt);
app.use('/complain', checkPermissions('view_complaints'), complain);
app.use('/patients', checkPermissions('view_patients'), patients);
app.use('/delete_patient', checkPermissions('delete_patients'), (req, res, next) => {
  if (req.cookies.role !== 'admin') {
    res.redirect('/doctors');
  } else {
    next();
  }
});
app.use('/logout', logout);