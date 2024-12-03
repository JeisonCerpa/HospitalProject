var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

module.exports = router;

router.get('/', (req, res) => {
    res.render('verify.ejs');
});

router.post('/', (req, res) => {
    var document = req.body.document;
    var token = req.body.token;
    var newPassword = req.body.password; // Obtener la nueva contraseña
    db.matchtoken(document, token, (err, result) => {
        if (err) {
            console.error('Error al comparar el token:', err);
            return res.status(500).send('Error en el servidor');
        }
        console.log(result);
        if (result.length > 0) {
            var email = result[0].email;
            var email_status = "Verificado";
            db.updateverify(email, email_status, (err, result) => {
                if (err) {
                    console.error('Error al actualizar la verificación:', err);
                    return res.status(500).send('Error en el servidor');
                }
                db.updatePassword(document, newPassword, (err, result) => { // Actualizar la contraseña
                    if (err) {
                        console.error('Error al actualizar la contraseña:', err);
                        return res.status(500).send('Error en el servidor');
                    }
                    res.redirect('/login'); // Redirigir a la página de login
                });
            });
        } else {
            res.send('Token inválido');
        }
    });
});

router.post('/setpassword', (req, res) => {
    var document = req.body.document;
    var token = req.body.token;
    var newPassword = req.body.password; // Obtener la nueva contraseña
    db.matchtoken(document, token, (err, result) => {
        if (err) {
            console.error('Error al comparar el token:', err);
            return res.status(500).send('Error en el servidor');
        }
        console.log(result);
        if (result.length > 0) {
            var email = result[0].email;
            var email_status = "Verificado";
            db.updateverify(email, email_status, (err, result) => {
                if (err) {
                    console.error('Error al actualizar la verificación:', err);
                    return res.status(500).send('Error en el servidor');
                }
                db.updatePassword(document, newPassword, (err, result) => { // Actualizar la contraseña
                    if (err) {
                        console.error('Error al actualizar la contraseña:', err);
                        return res.status(500).send('Error en el servidor');
                    }
                    res.redirect('/login'); // Redirigir a la página de login
                });
            });
        } else {
            res.send('Token inválido');
        }
    });
});

router.get('/:document/:token', (req, res) => {
    var document = req.params.document;
    var token = req.params.token;
    console.log('Document:', document);
    console.log('Token:', token);
    db.matchtoken(document, token, (err, result) => {
        if (err) {
            console.error('Error al comparar el token:', err);
            return res.status(500).send('Error en el servidor');
        }
        console.log('Resultado de matchtoken:', result);
        if (result.length > 0) {
            var email = result[0].email;
            var email_status = "Verificado";
            db.updateverify(email, email_status, (err, result) => {
                if (err) {
                    console.error('Error al actualizar la verificación:', err);
                    return res.status(500).send('Error en el servidor');
                }
                res.render('setpassword.ejs', { document: document, token: token }); // Redirigir a la página para cambiar la contraseña
            });
        } else {
            res.send('Token inválido');
        }
    });
});