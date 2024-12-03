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
    check('document').notEmpty().withMessage('El documento es requerido'),
    check('password').notEmpty().withMessage('La contraseña es requerida')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var document = req.body.document;
    var password = req.body.password;

    if (document && password) {
        con.query('SELECT * FROM users WHERE id = ? AND password = ?', [document, password], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error en el servidor');
                return;
            }
            if (result.length > 0) {
                req.session.loggedin = true;
                req.session.document = document; // Asegúrate de que el documento se almacene en la sesión
                var userId = result[0].id; // Obtener el ID del usuario
                var role = result[0].role; // Obtener el rol del usuario
                var username = result[0].username; // Obtener el nombre de usuario
                req.session.userRole = role; // Guardar el rol en la sesión
                res.cookie('userId', userId); // Guardar el ID del usuario en las cookies
                res.cookie('role', role); // Guardar el rol en las cookies
                res.cookie('document', document); // Guardar el documento en las cookies
                res.cookie('userRole', role); // Guardar el rol en las cookies
                res.cookie('username', username); // Guardar el nombre de usuario en las cookies
                var status = result[0].email_status;
                var passwordChanged = result[0].password_changed; // Verificar si la contraseña ha sido cambiada
                if (status == "No verificado") {
                    res.render('login.ejs', { message: 'Por favor verifique su cuenta' });
                } else if (!passwordChanged) {
                    // Obtener el token correspondiente al usuario
                    db.getuserid(result[0].email, (err, result) => {
                        if (err) {
                            console.error('Error al obtener el token:', err);
                            return res.status(500).send('Error en el servidor');
                        }
                        console.log('Resultado de getuserid:', result);
                        var token = result[0].token;
                        res.redirect(`/verify/${userId}/${token}`); // Redirigir a la página para cambiar la contraseña
                    });
                } else {
                    res.redirect('/home'); // Redirigir a la página de inicio
                }
            } else {
                res.render('login.ejs', { message: 'Documento o contraseña incorrectos' });
            }
        });
    } else {
        res.render('login.ejs', { message: 'Por favor ingrese documento y contraseña' });
    }
});

module.exports = router;
