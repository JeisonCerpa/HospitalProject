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
    db.getallappointment((err, result) => {
        console.log(result);
        res.render('appointment.ejs', {list: result});
    });
});

router.get('/add_appointment', (req, res) => {
    db.getAllPatients((err, patients) => {
        if (err) {
            console.error('Error fetching patients:', err);
            res.status(500).send('Internal Server Error');
        } else {
            db.getalldept((err, departments) => {
                if (err) {
                    console.error('Error fetching departments:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    db.getAllDoc((err, doctors) => {
                        if (err) {
                            console.error('Error fetching doctors:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            res.render('add_appointment.ejs', { patients: patients, departments: departments, doctors: doctors });
                        }
                    });
                }
            });
        }
    });
});

router.post('/add_appointment', (req, res) => {
    console.log(req.body);
    db.add_appointment(req.body.p_name, req.body.department, req.body.d_name, req.body.date, req.body.time, req.body.email, req.body.phone, (err, result) => {
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
        res.render('delete_appointment.ejs', {list: result});    
    });
});

router.post('/delete_appointment/:id', (req, res) => {
    var id = req.params.id;
    db.deleteappointment(id, (err, result) => {
        console.log(result);
        res.redirect('/appointment');
    });
});

router.get('/department', (req, res) => {
    var department = req.query.department;
    db.getAppointmentsByDepartment(department, (err, result) => {
        if (err) {
            console.error('Error fetching appointments by department:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('appointment.ejs', { list: result });
        }
    });
});

module.exports = router;