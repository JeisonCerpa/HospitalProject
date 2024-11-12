var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller'); 

router.get('*', (req, res, next) => {
    if (req.cookies['username'] == null) {
        res.redirect('/login');
    } else {
        next()
    }

});

router.get('/', (req, res) => {
    db.getallmed((err, result) => {
        console.log(result);
        res.render('store.ejs', {list: result});
    });
});

router.get('/add_med', (req, res) => {
    res.render('add_med.ejs');
});

router.post('/add_med', (req, res) => {
    var name = req.body.name;
    var p_date = req.body.p_date;
    var expire_date = req.body.expire_date;
    var e_date = req.body.e_date;
    var price = req.body.price;
    var quantity = req.body.quantity;

    db.addMed(name, p_date, expire_date, e_date, price, quantity, (err, result) => {
        console.log('Medicamento agregado');
        res.redirect('/store');
    });
});

router.get('/edit_med/:id', (req, res) => {
    var id = req.params.id;
    db.getMedbyId(id, (err, result) => {
        console.log(result);
        res.render('edit_med.ejs', {list: result});
    });
});

router.post('/edit_med/:id', (req, res) => {
    var id = req.params.id;
    var name = req.body.name;
    var p_date = req.body.p_date;
    var expire_date = req.body.expire_date;
    var e_date = req.body.e_date;
    var price = req.body.price;
    var quantity = req.body.quantity;

    db.editMed(id, name, p_date, expire_date, e_date, price, quantity, (err, result) => {
        console.log('Medicamento actualizado');
        res.redirect('/store');
    });
});

router.get('/delete_med/:id', (req, res) => {
    var id = req.params.id;
    db.getMedbyId(id, (err, result) => {
        console.log(result);
        res.redirect('/delete_med.ejs', {list: result});    
    });
});

router.post('/delete_med/:id', (req, res) => {
    var id = req.params.id;
    db.deletemed(id, (err, result) => {
        console.log(result);
        res.redirect('/store');
    });
});

router.post('/search', (req, res) => {
    var key = req.body.key;
    db.searchmed(key, (err, result) => {
        console.log(result);
        res.render('store.ejs', {list: result});
    });
});

module.exports = router;