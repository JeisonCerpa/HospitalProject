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
    var date = new Date(req.body.date).toISOString().split('T')[0]; // Formatear la fecha correctamente
    db.add_appointment(req.body.patient_document, req.body.department, req.body.doctor_document, date, req.body.time, (err, result) => {
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
    var date = new Date(req.body.date).toISOString().split('T')[0]; // Formatear la fecha correctamente
    db.editappointment(id, req.body.patient_document, req.body.department, req.body.doctor_document, date, req.body.time, (err, result) => {
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

router.post('/check_availability', (req, res) => {
    var doctorDocument = req.body.doctor_document;
    var date = req.body.date;
    var time = req.body.time;

    db.checkDoctorAvailability(doctorDocument, date, time, (err, result) => {
        if (err) {
            console.error('Error checking doctor availability:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json({ available: result.length === 0 });
        }
    });
});

module.exports = router;