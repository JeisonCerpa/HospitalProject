var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller');
var myslq = require('mysql');
var session = require('express-session');
var sweetalert = require('sweetalert2');
const { check, validationResult } = require('express-validator');


const con = myslq.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitalmanagement'
});

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', [check('username').notEmpty().withMessage('El nombre de usuario es requerido'), check('password').notEmpty().withMessage('La contraseña es requerida')], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var username = req.body.username;
    var password = req.body.password;

    if (username && password) {
        con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result, fields) => {
            if (result.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.cookie('username', username);
                var status = result[0].email_status;
                if (status == "No verificado") {
                    res.send('Por favor verifique su cuenta');
                } else {
                    sweetalert.fire('Inicio de sesión exitoso');
                    res.redirect('/home');
                }
            } else {
                res.send('Usuario o contraseña incorrectos');
            }
            res.end();
        });
    }else{
        res.send('Por favor ingrese usuario y contraseña');
        res.end();
    }
});

module.exports = router;
