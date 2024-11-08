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
    db.getallappointment((err, result) => {
        console.log(result);
        res.render('appointment.ejs', {list: result});
    });
});

router.get('/add_appointment', (req, res) => {
    res.render('add_appointment.ejs');
});

router.post('/add_appointment', (req, res) => {
    db.add_appointment(req.body.p_name, req.body.department, req.body.d_name, req.bodu.date, req.body.time, req.body.email, req.body.phone, (err, result) => {
        console.log('Cita agregada');
        res.redirect('/appointment');
    });
});

router.get('/edit_appointment/:id', (req, res) => {
    var id = req.params.id;
    db.getallappointmentbyid(id, (err, result) => {
        console.log(result);
        res.render('edit_appointment.ejs', {list: result});
    });
});

router.post('/edit_appointment/:id', (req, res) => {
    var id = req.params.id;
    db.editappointment(id, req.body.p_name, req.body.department, req.body.d_name, req.body.date, req.body.time, req.body.email, req.body.phone, (err, result) => {
        console.log('Cita actualizada');
        res.redirect('/appointment');
    });
});

router.get('/delete_appointment/:id', (req, res) => {
    var id = req.params.id;
    db.getallappointmentbyid(id, (err, result) => {
        console.log(result);
        res.redirect('/delete_appointment.ejs', {list: result});    
    });
});

router.post('/delete_appointment/:id', (req, res) => {
    var id = req.params.id;
    db.deleteappointment(id, (err, result) => {
        console.log(result);
        res.redirect('/appointment');
    });
});

module.exports = router;