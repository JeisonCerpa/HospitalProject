var express = require('express');
var router = express.Router();
var multer = require('multer');
var db = require.main.require('./models/db_controller'); 

router.get('*', (req, res, next) => {
    if (req.cookies['username'] == null) {
        res.redirect('/login');
    } else {
        next();
    }
});

router.get('/', (req, res) => {
    const userId = req.cookies.userId;
    const userRole = req.cookies.role;
    db.getUserPermissions(userId, (err, userPermissions) => {
        if (err) throw err;
        db.getAllPatients((err, result) => {
            if (err) throw err;
            res.render('patients.ejs', { list: result, userId: userId, userRole: userRole, userPermissions: userPermissions });
        });
    });
});

router.get('/add_patient', (req, res) => {
    const userId = req.cookies.userId;
    db.getUserPermissions(userId, (err, userPermissions) => {
        if (err) throw err;
        if (req.cookies.userRole === 'admin') {
            res.render('add_patient.ejs', { userPermissions: userPermissions });
        } else {
            res.redirect('/patients');
        }
    });
});

router.post('/add_patient', (req, res) => {
    console.log(req.body);
    db.getPatientByDoc(req.body.document, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.redirect('/patients/add_patient');
        } else {
            db.add_patient(req.body.document, req.body.name, req.body.email, req.body.date_of_birth, req.body.phone, req.body.gender, req.body.address, (err) => {
                if (err) throw err;
                console.log('1 patient inserted');
                res.redirect('/patients');
            });
        }
    });
});

router.get('/edit_patient/:document', (req, res) => {
    var document = req.params.document;
    const userId = req.cookies.userId;
    db.getUserPermissions(userId, (err, userPermissions) => {
        if (err) throw err;
        db.getPatientByDoc(document, (err, result) => {
            if (err) throw err;
            res.render('edit_patient.ejs', { list: result, userPermissions: userPermissions });
        });
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
    const userId = req.cookies.userId;
    db.getUserPermissions(userId, (err, userPermissions) => {
        if (err) throw err;
        if (req.cookies.userRole === 'admin') {
            db.getPatientByDoc(document, (err, result) => {
                if (err) throw err;
                res.render('delete_patient.ejs', { list: result, userPermissions: userPermissions });
            });
        } else {
            res.redirect('/patients');
        }
    });
});

router.post('/delete_patient/:document', (req, res) => {
    var document = req.params.document;
    db.deletePatient(document, (err, result) => {
        if (err) throw err;
        console.log('1 patient and corresponding user deleted');
        res.redirect('/patients');
    });
});

router.post('/search', (req, res) => {
    var key = req.body.search;
    console.log(key);
    const userId = req.cookies.userId;
    db.getUserPermissions(userId, (err, userPermissions) => {
        if (err) throw err;
        db.searchPatient(key, (err, result) => {
            if (err) throw err;
            res.render('patients.ejs', { list: result, userPermissions: userPermissions });
        });
    });
});

router.get('/check_duplicate/:document', (req, res) => {
    var document = req.params.document;
    db.getPatientByDoc(document, (err, result) => {
        if (err) throw err;
        res.json({ exists: result.length > 0 });
    });
});

module.exports = router;