var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller');
var myslq = require('mysql');
var session = require('express-session');
var sweetalert = require('sweetalert2');
const { check, validationResult } = require('express-validator');

router.get('/', (req, res) => {
    res.render('login.ejs', { message: null });
});

const con = myslq.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'h1'
});

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', [
    check('username').notEmpty().withMessage('El nombre de usuario es requerido'),
    check('password').notEmpty().withMessage('La contraseña es requerida')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var username = req.body.username;
    var password = req.body.password;

    if (username && password) {
        con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error en el servidor');
                return;
            }
            if (result.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                var userId = result[0].id; // Obtener el ID del usuario
                var role = result[0].role; // Obtener el rol del usuario
                res.cookie('userId', userId); // Guardar el ID del usuario en las cookies
                res.cookie('role', role); // Guardar el rol en las cookies
                var status = result[0].email_status;
                if (status == "No verificado") {
                    res.render('login.ejs', { message: 'Por favor verifique su cuenta' });
                } else {
                    res.render('login.ejs', { message: 'Inicio de sesión exitoso' });
                }
            } else {
                res.render('login.ejs', { message: 'Usuario o contraseña incorrectos' });
            }
        });
    } else {
        res.render('login.ejs', { message: 'Por favor ingrese usuario y contraseña' });
    }
});

module.exports = router;
