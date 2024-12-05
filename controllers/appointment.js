var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller');
var moment = require('moment');
require('moment/locale/es'); // Añadir esta línea para configurar moment en español

router.get('*', (req, res, next) => {
    if (req.cookies['username'] == null) {
        res.redirect('/login');
    } else {
        next()
    }
});

router.get('/', (req, res) => {
    const userId = req.cookies['userId'];
    db.getUserPermissions(userId, (err, permissions) => {
        if (err) {
            console.error('Error fetching user permissions:', err);
            res.status(500).send('Internal Server Error');
        } else {
            db.getallappointment((err, result) => {
                if (err) {
                    console.error('Error fetching appointments:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('appointment.ejs', { list: result, moment: moment, permissions: permissions });
                }
            });
        }
    });
});

router.get('/add_appointment', (req, res) => {
    const userId = req.cookies['userId'];
    db.getUserPermissions(userId, (err, permissions) => {
        if (err) {
            console.error('Error fetching user permissions:', err);
            res.status(500).send('Internal Server Error');
        } else if (!permissions.includes('edit_appointments')) {
            res.status(403).send('Forbidden');
        } else {
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
                                    res.render('add_appointment.ejs', { patients: patients, departments: departments, doctors: doctors, moment: moment });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post('/add_appointment', (req, res) => {
    const userId = req.cookies['userId'];
    db.getUserPermissions(userId, (err, permissions) => {
        if (err) {
            console.error('Error fetching user permissions:', err);
            res.status(500).send('Internal Server Error');
        } else if (!permissions.includes('edit_appointments')) {
            res.status(403).send('Forbidden');
        } else {
            console.log('Datos recibidos:', req.body); // Agregar este console.log para verificar los datos recibidos
            var date = moment(req.body.date, 'YYYY-MM-DD', true); // Asegurarse de que la fecha esté en el formato correcto
            if (!date.isValid()) {
                console.error('Fecha inválida:', req.body.date);
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
                                        res.render('add_appointment.ejs', {
                                            patients: patients,
                                            departments: departments,
                                            doctors: doctors,
                                            moment: moment,
                                            alert: { type: 'error', message: 'Fecha inválida' }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                return;
            }
            var formattedDate = date.format('YYYY-MM-DD');
            var time = req.body.time; // Asegurarse de que el tiempo esté en formato HH:mm:ss
            db.add_appointment(req.body.patient_document, req.body.department, req.body.doctor_document, formattedDate, time, (err, result) => {
                if (err) {
                    console.error('Error adding appointment:', err);
                    res.redirect('back');
                } else {
                    console.log('Cita agregada');
                    res.render('add_appointment.ejs', {
                        patients: [],
                        departments: [],
                        doctors: [],
                        moment: moment,
                        alert: { type: 'success', message: 'Cita agregada correctamente', redirect: true }
                    });
                }
            });
        }
    });
});

router.get('/edit_appointment/:id', (req, res) => {
    const userId = req.cookies['userId'];
    db.getUserPermissions(userId, (err, permissions) => {
        if (err) {
            console.error('Error fetching user permissions:', err);
            res.status(500).send('Internal Server Error');
        } else if (!permissions.includes('edit_appointments')) {
            res.status(403).send('Forbidden');
        } else {
            var id = req.params.id;
            db.getallappointmentbyid(id, (err, appointment) => {
                if (err) {
                    console.error('Error fetching appointment:', err);
                    res.redirect('back');
                } else {
                    db.getAllPatients((err, patients) => {
                        if (err) {
                            console.error('Error fetching patients:', err);
                            res.redirect('back');
                        } else {
                            db.getalldept((err, departments) => {
                                if (err) {
                                    console.error('Error fetching departments:', err);
                                    res.redirect('back');
                                } else {
                                    db.getAllDoc((err, doctors) => {
                                        if (err) {
                                            console.error('Error fetching doctors:', err);
                                            res.redirect('back');
                                        } else {
                                            res.render('edit_appointment.ejs', { appointment: appointment[0], patients: patients, departments: departments, doctors: doctors, moment: moment });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post('/edit_appointment/:id', (req, res) => {
    const userId = req.cookies['userId'];
    db.getUserPermissions(userId, (err, permissions) => {
        if (err) {
            console.error('Error fetching user permissions:', err);
            res.status(500).send('Internal Server Error');
        } else if (!permissions.includes('edit_appointments')) {
            res.status(403).send('Forbidden');
        } else {
            var id = req.params.id;
            var date = moment(req.body.date, 'YYYY-MM-DD', true); // Asegurarse de que la fecha esté en el formato correcto
            if (!date.isValid()) {
                console.error('Fecha inválida:', req.body.date);
                db.getallappointmentbyid(id, (err, appointment) => {
                    if (err) {
                        console.error('Error fetching appointment:', err);
                        res.redirect('back');
                    } else {
                        db.getAllPatients((err, patients) => {
                            if (err) {
                                console.error('Error fetching patients:', err);
                                res.redirect('back');
                            } else {
                                db.getalldept((err, departments) => {
                                    if (err) {
                                        console.error('Error fetching departments:', err);
                                        res.redirect('back');
                                    } else {
                                        db.getAllDoc((err, doctors) => {
                                            if (err) {
                                                console.error('Error fetching doctors:', err);
                                                res.redirect('back');
                                            } else {
                                                res.render('edit_appointment.ejs', {
                                                    appointment: appointment[0],
                                                    patients: patients,
                                                    departments: departments,
                                                    doctors: doctors,
                                                    moment: moment,
                                                    alert: { type: 'error', message: 'Fecha inválida' }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                return;
            }
            var formattedDate = date.format('YYYY-MM-DD');
            var time = req.body.time; // Asegurarse de que el tiempo esté en formato HH:mm:ss
            db.editappointment(id, req.body.patient_document, req.body.department, req.body.doctor_document, formattedDate, time, (err, result) => {
                if (err) {
                    console.error('Error updating appointment:', err);
                    res.redirect('back');
                } else {
                    console.log('Cita actualizada');
                    res.redirect('/appointment');
                }
            });
        }
    });
});

router.get('/delete_appointment/:id', (req, res) => {
    const userId = req.cookies['userId'];
    db.getUserPermissions(userId, (err, permissions) => {
        if (err) {
            console.error('Error fetching user permissions:', err);
            res.status(500).send('Internal Server Error');
        } else if (!permissions.includes('delete_appointments')) {
            res.status(403).send('Forbidden');
        } else {
            var id = req.params.id;
            db.getallappointmentbyid(id, (err, result) => {
                if (err) {
                    console.error('Error fetching appointment:', err);
                    res.redirect('back');
                } else {
                    res.render('delete_appointment.ejs', { list: result, moment: moment });
                }
            });
        }
    });
});

router.post('/delete_appointment/:id', (req, res) => {
    const userId = req.cookies['userId'];
    db.getUserPermissions(userId, (err, permissions) => {
        if (err) {
            console.error('Error fetching user permissions:', err);
            res.status(500).send('Internal Server Error');
        } else if (!permissions.includes('delete_appointments')) {
            res.status(403).send('Forbidden');
        } else {
            var id = req.params.id;
            db.deleteappointment(id, (err, result) => {
                if (err) {
                    console.error('Error deleting appointment:', err);
                    res.redirect('back');
                } else {
                    console.log('Cita eliminada');
                    res.redirect('/appointment');
                }
            });
        }
    });
});

router.get('/department', (req, res) => {
    var department = req.query.department;
    db.getAppointmentsByDepartment(department, (err, result) => {
        if (err) {
            console.error('Error fetching appointments by department:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('appointment.ejs', { list: result, moment: moment });
        }
    });
});

router.post('/check_availability', (req, res) => {
    var doctorDocument = req.body.doctor_document;
    var date = moment(req.body.date, 'YYYY-MM-DD', true); // Asegurarse de que la fecha esté en el formato correcto
    if (!date.isValid()) {
        console.error('Fecha inválida:', req.body.date);
        return res.json({ available: false });
    }
    var formattedDate = date.format('YYYY-MM-DD');
    var time = req.body.time; // Asegurarse de que el tiempo esté en formato HH:mm:ss

    db.checkDoctorAvailability(doctorDocument, formattedDate, time, (err, result) => {
        if (err) {
            console.error('Error checking doctor availability:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json({ available: result.length === 0 });
        }
    });
});

module.exports = router;