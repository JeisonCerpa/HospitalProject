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
    db.add_patient(req.body.document, req.body.name, req.body.email, req.body.phone, req.body.gender, req.body.address, (err) => {
        if (err) throw err;
        console.log('1 patient inserted');
        res.redirect('/patients');
    });
});

router.get('/edit_patient/:document', (req, res) => {
    var document = req.params.document;
    db.getPatientByDoc(document, (err, result) => {
        res.render('edit_patient.ejs', { list: result });
    });
});

router.post('/edit_patient/:document', (req, res) => {
    var document = req.params.document;
    db.editPatient(document, req.body.name, req.body.email, req.body.phone, req.body.gender, req.body.address, (err) => {
        if (err) throw err;
        console.log('1 patient updated');
        res.redirect('/patients');
    });
});

router.get('/delete_patient/:document', (req, res) => {
    var document = req.params.document;
    db.getPatientByDoc(document, (err, result) => {
        console.log(result);
        res.render('delete_patient.ejs', { list: result });
    });
});

router.post('/delete_patient/:document', (req, res) => {
    var document = req.params.document;
    db.deletePatient(document, (err, result) => {
        if (err) throw err;
        console.log('1 patient deleted');
        res.redirect('/patients');
    });
});

router.post('/search', (req, res) => {
    var key = req.body.search;
    console.log(key);
    db.searchPatient(key, (err, result) => {
        if (err) throw err;
        res.render('patients.ejs', { list: result });
    });
});

module.exports = router;