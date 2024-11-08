var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller'); 

router.get('*', (req, res) => {
    if (req.cookies['username'] == null) {
        res.redirect('/login');
    } else {
        next()
    }

});

router.get('/', (req, res) => {
    res.render('complain.ejs');
});

router.post('/', (req, res) => {
    var message = req.body.message;
    var name = req.body.name;
    var email = req.body.email;
    var subject = req.body.subject;
    db.postcomplain(message, name, email, subject, (result) => {
        res.redirect('back');
    });
});

module.exports = router;