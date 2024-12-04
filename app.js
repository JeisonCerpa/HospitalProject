const express = require('express');
const bodyParser = require('body-parser'); // Importar body-parser
const session = require('express-session');
const cookie = require('cookie-parser');
const cookieParser = require('cookie-parser'); // Importar cookie-parser
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

const app = express();

app.set('view engine', 'ejs');

const server = http.createServer(app);

app.use(express.static('./public'));
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // for form data
app.use(cookie());
app.use(cookieParser()); // Usar cookie-parser

const port = process.env.PORT || 3000; // Cambiar el puerto de nuevo a 3000
server.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto: ${port}`);
});

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use((req, res, next) => {
  const userId = req.cookies.userId;
  if (userId) {
    db.getUserPermissions(userId, (err, permissions) => {
      if (err) {
        console.error('Error retrieving user permissions:', err);
        return res.status(500).send('Error retrieving user permissions');
      }
      req.permissions = permissions;
      res.locals.permissions = permissions; // Añadir esto para que las vistas tengan acceso a los permisos
      res.locals.role = req.cookies.role; // Añadir esto para que las vistas tengan acceso al rol
      res.locals.username = req.cookies.username; // Añadir esto para que las vistas tengan acceso al nombre de usuario
      next();
    });
  } else {
    next();
  }
});

app.use((req, res, next) => {
    if (req.cookies.userId) {
        db.getUserPermissions(req.cookies.userId, (err, permissions) => {
            if (err) {
                console.error('Error retrieving permissions:', err);
                return res.status(500).send('Error retrieving permissions');
            }
            res.locals.userPermissions = permissions;
            next();
        });
    } else {
        next();
    }
});

// Aplicar el middleware a las rutas que requieren permisos
app.use('/signup', signup);
app.use('/login', (req, res, next) => {
  // ...existing login logic...
  // Después de una autenticación exitosa, almacena el rol del usuario en las cookies
  const userRole = req.session.userRole; // Asegúrate de que userRole esté definido
  if (userRole) {
    res.cookie('userRole', userRole); // Asegúrate de que userRole esté definido
  }
  next();
});
app.use('/login', login);
app.use('/home', home);
app.use('/verify', verify);
app.use('/reset', reset);

app.use('/doctors', (req, res, next) => {
  if (req.permissions.includes('view_doctors')) {
    next();
  } else {
    res.redirect('back');
  }
}, doctors);

app.use('/employee', (req, res, next) => {
  if (req.permissions.includes('view_employees')) {
    next();
  } else {
    res.redirect('back');
  }
}, employee);

app.use('/appointment', (req, res, next) => {
  if (req.permissions.includes('view_appointments')) {
    next();
  } else {
    res.redirect('back');
  }
}, appointment);

app.use('/store', (req, res, next) => {
  if (req.permissions.includes('view_store')) {
    next();
  } else {
    res.redirect('back');
  }
}, store);

app.use('/receipt', receipt);

app.use('/complain', (req, res, next) => {
  if (req.permissions.includes('view_complaints')) {
    next();
  } else {
    res.redirect('back');
  }
}, complain);

app.use('/patients', (req, res, next) => {
  if (req.permissions.includes('view_patients')) {
    next();
  } else {
    res.redirect('back');
  }
}, patients);

app.use('/delete_patient', (req, res, next) => {
  if (req.permissions.includes('delete_patients') && req.cookies.role === 'admin') {
    next();
  } else {
    res.redirect('back');
  }
});

app.use('/logout', logout);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});