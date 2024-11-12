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
    var id = req.body.id;
    var token = req.body.token;
    db.matchtoken(id, token, (err, result) => {
        console.log(result);
        if (result.length > 0) {
            var email = result[0].email;
            var email_status = "Verificado";
            db.updateverify(email, email_status, (err, result) => {
                res.send('Cuenta verificada');
                res.redirect('/login');
            });
        } else {
            res.send('Token inválido');
        }
    });
});