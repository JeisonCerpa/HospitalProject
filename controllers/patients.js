var express = require('express');
var router = express.Router();
var multer = require('multer');
var db = require.main.require('./models/db_controller'); 
var randomtoken = require('random-token');
var nodemailer = require('nodemailer');

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
    const username = req.cookies.username; // Asegúrate de que username esté definido
    db.getUserPermissions(userId, (err, userPermissions) => {
        if (err) throw err;
        db.getAllPatients((err, result) => {
            if (err) throw err;
            res.render('patients.ejs', { list: result, userId: userId, userRole: userRole, username: username, userPermissions: userPermissions });
        });
    });
});

router.get('/add_patient', (req, res) => {
    const userId = req.cookies.userId;
    const userRole = req.cookies.role;
    const username = req.cookies.username; // Asegúrate de que username esté definido
    db.getUserPermissions(userId, (err, userPermissions) => {
        if (err) throw err;
        if (userRole === 'admin') {
            res.render('add_patient.ejs', { userPermissions: userPermissions, username: username, userRole: userRole });
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
                
                var token = randomtoken(8);
                db.verify(req.body.document, req.body.name, req.body.email, token);
                db.getuserid(req.body.email, (err, result) => {
                    var document = req.body.document;
                    var output = `<p>Querido ${req.body.name}</p><p>Gracias por registrarte en nuestro sitio web. Su token de ingreso está abajo:</p>
                        <ul>
                        <li>Document: ${document}</li>
                        <li>Token: ${token}</li>
                        <li>Contraseña predeterminada: patient123</li>
                        </ul>
                        <p>Por favor, haga clic en el siguiente enlace para verificar su cuenta y cambiar su contraseña: <a href="http://localhost:3000/verify/${document}/${token}">¡Click Aquí!</a></p>
                        <p><b>Nota:</b>Este es un correo electrónico generado automáticamente. Si no ha solicitado este correo electrónico, por favor ignore este mensaje.</p>`;

                    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: "cerpajeisontest@gmail.com",
                            pass: "dyii pyjs wcjs gvjs"
                        }
                    });
                    var mailOptions = {
                        from: 'Hospital MS Team',
                        to: req.body.email,
                        subject: 'Verificación de cuenta',
                        html: output
                    };
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Correo enviado: ' + info);
                        }
                    });

                    var roleId = 5; // Asumiendo que el rol de paciente tiene el ID 5
                    db.addUserRole(document, roleId, (err) => {
                        if (err) {
                            console.error('Error al agregar el rol del usuario:', err);
                            return res.status(500).send('Error en el servidor');
                        }
                        res.redirect('/patients');
                    });
                });
            });
        }
    });
});

router.get('/edit_patient/:document', (req, res) => {
    var document = req.params.document;
    const userId = req.cookies.userId;
    const userRole = req.cookies.role;
    const username = req.cookies.username; // Asegúrate de que username esté definido
    db.getUserPermissions(userId, (err, userPermissions) => {
        if (err) throw err;
        db.getPatientByDoc(document, (err, result) => {
            if (err) throw err;
            res.render('edit_patient.ejs', { list: result, userPermissions: userPermissions, username: username, userRole: userRole });
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
    const userRole = req.cookies.role;
    const username = req.cookies.username; // Asegúrate de que username esté definido
    db.getUserPermissions(userId, (err, userPermissions) => {
        if (err) throw err;
        if (userRole === 'admin') {
            db.getPatientByDoc(document, (err, result) => {
                if (err) throw err;
                res.render('delete_patient.ejs', { list: result, userPermissions: userPermissions, username: username, userRole: userRole });
            });
        } else {
            res.redirect('/patients');
        }
    });
});

router.post('/delete_patient/:document', (req, res) => {
    var document = req.params.document;
    db.getPatientByDoc(document, (err, patient) => {
        if (err) {
            console.error('Error al obtener el paciente:', err);
            return res.status(500).send('Error en el servidor');
        }
        if (patient.length > 0) {
            var userId = patient[0].user_id;
            db.deletePatient(document, (err) => {
                if (err) {
                    console.error('Error al eliminar el paciente:', err);
                    return res.status(500).send('Error en el servidor');
                }
                db.deleteUser(userId, (err) => {
                    if (err) {
                        console.error('Error al eliminar el usuario:', err);
                        return res.status(500).send('Error en el servidor');
                    }
                    db.deleteUserRole(userId, (err) => {
                        if (err) {
                            console.error('Error al eliminar el rol del usuario:', err);
                            return res.status(500).send('Error en el servidor');
                        }
                        db.deleteVerify(userId, (err) => {
                            if (err) {
                                console.error('Error al eliminar la verificación del usuario:', err);
                                return res.status(500).send('Error en el servidor');
                            }
                            res.redirect('/patients');
                        });
                    });
                });
            });
        } else {
            res.status(404).send('Paciente no encontrado');
        }
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