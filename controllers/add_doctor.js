var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller');
var multer = require('multer');
var path = require('path');
var fileUpload = require('express-fileupload');


router.get('*', (req, res, next) => {
    if (req.cookies['username'] == null) {
        res.redirect('/login');
    } else {
        next()
    }

});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/images/upload_images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

router.get('/add_doctor', function (req, res) {
    db.getalldept((err, result) => {
        if (err)
            throw err;
        res.render('add_doctor.ejs', { list: result });
        console.log(result);
    });
});


router.post('/add_doctor', upload.single('image'), function (req, res) {
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).send('Image is required');
    }

    var image = req.file.filename;

    db.add_doctor(req.body.first_name, req.body.last_name, req.body.email, req.body.dob, req.body.gender, req.body.address, req.body.phone, image, req.body.department, req.body.biography, (err) => {
        if (err) throw err;
        console.log('1 doctor inserted');
        res.render('add_doctor.ejs', { list: result });
    });
});

module.exports = router;