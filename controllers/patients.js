var express = require('express');
var router = express.Router();
var multer = require('multer');
var db = require.main.require('./models/db_controller'); 

router.get('*', (req, res, next) => {
    if (req.cookies['username'] == null) {
        res.redirect('/login');
    } else {
        next()
    }

});

router.get('/', (req, res) => {
    db.getAllPatients((err, result) => {
        if (err) throw err;
        res.render('patients.ejs', { list: result });
    });
});

router.get('/add_patient', (req, res) => {
    res.render('add_patient.ejs');
});

router.post('/add_patient', (req, res) => {
    console.log(req.body);
    db.addPatient(req.body.document, req.body.name, req.body.email, req.body.phone, req.body.gender, req.body.address, (err) => {
        if (err) throw err;
        console.log('1 patient inserted');
        res.redirect('/patients');
    });
});

router.get('/edit_patient/:id', (req, res) => {
    var id = req.params.id;
    db.getPatientById(id, (err, result) => {
        console.log(result);
        res.render('edit_patient.ejs', { list: result });
    });
});

router.post('/edit_patient/:id', (req, res) => {
    var id = req.params.id;
    db.editPatient(req.body.document, req.body.name, req.body.email, req.body.phone, req.body.gender, req.body.address, (err) => {
        if (err) throw err;
        console.log('1 patient updated');
        res.redirect('/patients');
    });
});

router.get('/delete_patient/:id', (req, res) => {
    var id = req.params.id;
    db.getPatientById(id, (err, result) => {
        console.log(result);
        res.render('delete_patient.ejs', { list: result });
    });
});

router.post('/delete_patient/:id', (req, res) => {
    var id = req.params.id;
    db.deletePatient(id, (err) => {
        if (err) throw err;
        console.log('1 patient deleted');
        res.redirect('/patients');
    });
});

router.get('/search', (req, res) => {
    var key = req.query.search;
    db.searchPatient(key, (err, result) => {
        console.log(result);
        res.render('patients.ejs', { list: result });
    });
});

module.exports = router;