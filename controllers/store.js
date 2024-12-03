var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller'); 
var moment = require('moment'); // Añadir esta línea

router.use((req, res, next) => {
    if (req.cookies['username'] == null) {
        res.redirect('/login');
    } else {
        const userId = req.cookies.userId;
        db.getUserPermissions(userId, (err, permissions) => {
            if (err) {
                console.error('Error retrieving user permissions:', err);
                return res.status(500).send('Error retrieving user permissions');
            }
            res.locals.permissions = permissions;
            next();
        });
    }
});

router.get('/', (req, res) => {
    db.getallmed((err, result) => {
        console.log(result);
        res.render('store.ejs', { list: result });
    });
});

router.get('/add_med', (req, res) => {
    res.render('add_med.ejs');
});

router.post('/add_med', (req, res) => {
    const { name, p_date, e_date, price, quantity } = req.body;
    const formattedPDate = moment(p_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const formattedEDate = moment(e_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    db.addMed(name, formattedPDate, formattedEDate, price, quantity, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al agregar la medicina');
        } else {
            res.redirect('/store');
        }
    });
});

router.get('/edit_med/:id', (req, res) => {
    var id = req.params.id;
    db.getMedbyId(id, (err, result) => {
        console.log(result);
        res.render('edit_med.ejs', { list: result });
    });
});

router.post('/edit_med/:id', (req, res) => {
    var id = req.params.id;
    var name = req.body.name;
    var p_date = moment(req.body.p_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var expire_date = moment(req.body.expire_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var e_date = moment(req.body.e_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
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
        res.render('delete_med.ejs', { list: result });    
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
        res.render('store.ejs', { list: result });
    });
});

module.exports = router;