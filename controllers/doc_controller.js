var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller');
var multer = require('multer');
var fs = require('fs');
var path = require('path');

router.get('*', (req, res, next) => {
    if (req.cookies['username'] == null) {
        res.redirect('/login');
    } else {
        next()
    }

});

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/images/upload_images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

router.get('/', (req, res) => {
    db.getAllDoc((err, result) => {
        if (err) throw err;
        res.render('doctors.ejs', { list: result });
    });
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/add_doctor', (req, res) => {
    db.getalldept((err, result) => {
        res.render('add_doctor.ejs', { list: result });
    });
});

router.post('/add_doctor', upload.single('image'), (req, res) => {
    console.log(req.body);
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).send('Image is required');
    }

    var image = req.file.filename;

    db.getDocByDocument(req.body.document, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            db.getalldept((err, departments) => {
                if (err) throw err;
                res.render('add_doctor.ejs', { list: departments, alert: { type: 'error', message: 'El médico ya existe' } });
            });
        } else {
            db.add_doctor(req.body.document, req.body.name, req.body.email, req.body.date_of_birth, req.body.gender, req.body.address, req.body.phone, image, req.body.department, req.body.biography, (err) => {
                if (err) throw err;
                console.log('1 doctor inserted');
                res.redirect('/doctors');
            });
        }
    });
});

router.get('/edit_doctor/:document', (req, res) => {
    var document = req.params.document;
    db.getDocByDocument(document, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.render('edit_doctor.ejs', { list: result });
        } else {
            res.status(404).send('Doctor not found');
        }
    });
});

router.post('/edit_doctor/:document', (req, res) => {
    var document = req.params.document;
    db.editDoc(document, req.body.name, req.body.email, req.body.date_of_birth, req.body.gender, req.body.address, req.body.phone, req.body.department, req.body.biography, (err, result) => {
        if (err) throw err;
        res.redirect('/doctors');
    });
});

router.get('/delete_doctor/:document', (req, res) => {
    var document = req.params.document;
    db.getDocByDocument(document, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.render('delete_doctor.ejs', { list: result });
        } else {
            res.status(404).send('Doctor not found');
        }
    });
});

router.post('/delete_doctor/:document', (req, res) => {
    var document = req.params.document;
    db.getDocByDocument(document, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            var userId = result[0].user_id;
            db.deleteDoc(document, (err, result) => {
                if (err) throw err;
                db.deleteUser(userId, (err, result) => {
                    if (err) throw err;
                    res.redirect('/doctors');
                });
            });
        } else {
            res.status(404).send('Doctor not found');
        }
    });
});

router.get('/', (req, res) => {
    db.getAllDoc((err, result) => {
        if (err)
            throw err;
        res.render('doctors.ejs', { list: result });
    });
});

router.post('/search', (req, res) => {
    var key = req.body.search;
    db.searchDoc(key, (err, result) => {
        if (err)
            throw err;
        res.render('doctors.ejs', { list: result });
    });
});

module.exports = router;

