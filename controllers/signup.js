var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller');
var myslq = require('mysql');
var nodemailer = require('nodemailer');
var randomtoken = require('random-token');
const { check, validationResult } = require('express-validator');

    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());

router.post('/', [check('username').notEmpty().withMessage('El nombre de usuario es requerido'), check('password').notEmpty().withMessage('La contraseña es requerida'), check('email').isEmail().withMessage('El correo electrónico no es válido')], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    var email_status = "No verificado";
    var email = req.body.email;
    var username = req.body.username;

    db.signup(req.body.username, req.body.email, req.body.password, email_status);
    var token = randomtoken(8);
    db.verify(username, email, token);

    db.getuserid(email, (err, result) => {
        var id = result[0].id;
        var output = `<p>Querido ${username}</p><p>Gracias por registrarte en nuestro sitio web. Su token de ingreso está abajo:</p>
            <ul>
            <li>UserID: ${id}</li>
            <li>Token: ${token}</li>
            </ul>
            <p>Por favor, haga clic en el siguiente enlace para verificar su cuenta: <a href="http://localhost:3000/verify">¡Click Aquí!</a></p>
            <p><b>Nota:</b>Este es un correo electrónico generado automáticamente. Si no ha solicitado este correo electrónico, por favor ignore este mensaje.</p>`;

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "cerpajeisontest@gmail.com",
                pass: "dyii pyjs wcjs gvjs"
            }
        });
        var mailOptions = {
            from: 'Hospital MS Team',
            to: email,
            subject: 'Verificación de cuenta',
            html: output
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Correo enviado: ' + info);
            }
        });
        res.send('Correo enviado, por favor verifique su cuenta');
    })
});

module.exports = router;