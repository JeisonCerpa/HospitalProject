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
        res.render('add_doctor.ejs', {list: result});
    });
});

router.post('/add_doctor', upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).send('Image is required');
    }

    var image = req.file.filename;

    db.add_doctor(req.body.first_name, req.body.last_name, req.body.email, req.body.dob, req.body.gender, req.body.address, req.body.phone, image, req.body.department, req.body.biography, (err) => {
        if (err) throw err;
        console.log('1 doctor inserted');
        db.getalldept((err, result) => {
            if (err) throw err;
            res.redirect('/doctors');
        });
    });
});

router.get('/edit_doctor/:id', (req, res) => {
    var id = req.params.id;
    db.getDocbyId(id, (err, result) => {
        res.render('edit_doctor.ejs', {list: result});
    });
});

router.post('/edit_doctor/:id', (req, res) => {
    var id = req.params.id;
    db.editDoc(id, req.body.first_name, req.body.last_name, req.body.email, req.body.dob, req.body.gender, req.body.address, req.body.phone, req.body.department, req.body.biography, (err, result) => {
        if(err)
            throw err;
        res.redirect('/doctors');
    });
});

router.get('/delete_doctor/:id', (req, res) => {
    var id = req.params.id;
    db.getDocbyId(id, (err, result) => {
        res.render('delete_doctor.ejs', {list: result});
    });
});

router.post('/delete_doctor/:id', (req, res) => {
    var id = req.params.id;
    db.deleteDoc(id, (err, result) => {
        res.redirect('/doctors');
    });
});

router.get('/', (req, res) => {
    db.getAllDoc((err, result) => {
        if(err)
            throw err;
        res.render('doctors.ejs', {list: result});
    });
});

router.post('/search', (req, res) => {
    var key = req.body.search;
    db.searchDoc(key, (err, result) => {
        if(err)
            throw err;
        res.render('doctors.ejs', {list: result});
    });
});

module.exports = router;

