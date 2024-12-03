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
            db.getallmed((err, result) => {
                res.render('store.ejs', { message: { type: 'error', text: 'Error al agregar la medicina' }, list: result });
            });
        } else {
            db.getallmed((err, result) => {
                res.render('store.ejs', { message: { type: 'success', text: 'Medicina agregada correctamente' }, list: result });
            });
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
        if (err) {
            console.error(err);
            db.getallmed((err, result) => {
                res.render('store.ejs', { message: { type: 'error', text: 'Error al actualizar la medicina' }, list: result });
            });
        } else {
            db.getallmed((err, result) => {
                res.render('store.ejs', { message: { type: 'success', text: 'Medicamento actualizado correctamente' }, list: result });
            });
        }
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
        if (err) {
            console.error(err);
            db.getallmed((err, result) => {
                res.render('store.ejs', { message: { type: 'error', text: 'Error al eliminar la medicina' }, list: result });
            });
        } else {
            db.getallmed((err, result) => {
                res.render('store.ejs', { message: { type: 'success', text: 'Medicamento eliminado correctamente' }, list: result });
            });
        }
    });
});

router.post('/search', (req, res) => {
    var key = req.body.key;
    db.searchmed(key, (err, result) => {
        console.log(result);
        res.render('store.ejs', { list: result });
    });
});

router.post('/use_med', (req, res) => {
    const cart = req.body.cart; // Obtener el carrito del cuerpo de la solicitud
    const updates = JSON.parse(cart); // Convertir el carrito a un objeto JSON

    updates.forEach(update => {
        db.getMedbyId(update.id, (err, result) => {
            if (err) {
                console.error(err);
                return db.getallmed((err, result) => {
                    res.render('store.ejs', { message: { type: 'error', text: 'Error al obtener la medicina' }, list: result });
                });
            }
            const newQuantity = result[0].quantity - update.quantity;
            db.editMed(update.id, result[0].name, result[0].p_date, result[0].expire_end, result[0].price, newQuantity, (err, result) => {
                if (err) {
                    console.error(err);
                    return db.getallmed((err, result) => {
                        res.render('store.ejs', { message: { type: 'error', text: 'Error al actualizar la medicina' }, list: result });
                    });
                }
            });
        });
    });

    db.getallmed((err, result) => {
        res.render('store.ejs', { message: { type: 'success', text: 'Medicamentos usados correctamente' }, list: result });
    });
});

module.exports = router;