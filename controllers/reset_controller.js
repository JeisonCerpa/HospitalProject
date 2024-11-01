var express = require('express');
var flash = require('flash');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var randomtoken = require('random-token');
var db = require.main.require('./models/db_controller');

/* router.get('/', function(req, res) {
    res.render('resetpassword.ejs');
}); */

router.post('/', function (req, res) {
    var email = req.body.email;
    db.findOne(email, function (err, resultone) {
        if (!resultone) {
            console.log('No existe una cuenta con ese correo electrónico');
            res.send('No existe una cuenta con ese correo electrónico');
        }
        var id = resultone[0].id;
        var email = resultone[0].email;
        var token = randomtoken(8);
        db.temp(id, email, token, function (err, resulttwo) {
            var output = `
                <h2>Recuperar contraseña</h2>
                <p>Para recuperar tu contraseña, por favor haz clic en el siguiente enlace:</p>
                <ul>
                <li>User ID: ${id}</li>
                <li>Email: ${email}</li>
                <li>Token: ${token}</li>
                </ul>
                <a href="http://localhost:3000/reset/${token}">Recuperar contraseña</a>
            `;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'cerpajeisontest@gmail.com',
                    pass: 'vvbf jbko gnwh wgmb'
                }
            });
            var mailOptions = {
                from: 'Hospital MS Team',
                to: email,
                subject: 'Recuperar contraseña',
                html: output
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log('Correo enviado: ' + info);
                }
            });

        });
    });
    res.send('Correo enviado, por favor verifique su cuenta');
});

module.exports = router;
