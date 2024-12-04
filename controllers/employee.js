var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { check } = require('express-validator');
var db = require.main.require('./models/db_controller');
const { validationResult } = require('express-validator');
var randomtoken = require('random-token');
var nodemailer = require('nodemailer');

module.exports = router;

router.get('*', (req, res, next) => {
    if (req.cookies['username'] == null) {
        res.redirect('/login');
    } else {
        const userId = req.cookies.userId;
        db.getUserPermissions(userId, (err, permissions) => {
            if (err) {
                console.error('Error retrieving permissions:', err);
                return res.status(500).send('Error retrieving permissions');
            }
            req.permissions = permissions;
            next();
        });
    }
});

router.get('/', (req, res) => {
    if (!req.permissions.includes('view_employees')) {
        return res.redirect('back');
    }
    const userId = req.cookies.userId;
    const userRole = req.cookies.role;
    const username = req.cookies.username;
    db.getAllemployee((err, result) => {
        if (err) throw err;
        res.render('employee.ejs', { employee: result, userId: userId, userRole: userRole, username: username });
    });
});

router.get('/add', (req, res) => {
    if (!req.permissions.includes('add_employees')) {
        return res.redirect('back');
    }
    const userId = req.cookies.userId;
    const userRole = req.cookies.role;
    const username = req.cookies.username;
    db.getUserPermissions(userId, (err, userPermissions) => {
        if (err) throw err;
        db.getAllRoles((err, roles) => {
            if (err) throw err;
            res.render('add_employee.ejs', { roles: roles, userPermissions: userPermissions, username: username, userRole: userRole });
        });
    });
});

router.post('/add', (req, res) => {
    if (!req.permissions.includes('add_employees')) {
        return res.redirect('back');
    }
    var document = req.body.document;
    var name = req.body.name;
    var email = req.body.email;
    var contact = req.body.contact;
    var date_of_birth = req.body.date_of_birth;
    var role = req.body.role;
    var password = 'employee123';
    var email_status = 'not_verified';
    var password_changed = false;

    // Verificar duplicados en la tabla users
    var checkDuplicateQuery = 'SELECT * FROM users WHERE id = ? OR email = ?';
    db.con.query(checkDuplicateQuery, [document, email], (err, results) => {
        if (err) {
            console.error('Error al verificar duplicados:', err);
            return res.status(500).send('Error en el servidor');
        }
        if (results.length > 0) {
            return db.getAllRoles((err, roles) => {
                if (err) throw err;
                res.render('add_employee.ejs', { 
                    roles: roles, 
                    message: { type: 'error', title: 'Error', text: 'El documento o correo electrónico ya existe' }
                });
            });
        }

        // Insertar en la tabla users
        var userQuery = 'INSERT INTO users (id, username, email, password, email_status, role, password_changed) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.con.query(userQuery, [document, name, email, password, email_status, role, password_changed], (err) => {
            if (err) {
                console.error('Error al insertar en la tabla users:', err);
                return res.status(500).send('Error en el servidor');
            }

            // Insertar en la tabla employee
            db.add_employee(document, name, email, contact, date_of_birth, role, document, (err, result) => {
                if (err) {
                    console.error('Error al insertar en la tabla employee:', err);
                    return db.getAllemployee((err, employees) => {
                        if (err) throw err;
                        res.render('employee.ejs', { message: { type: 'error', title: 'Error', text: 'Error en el servidor' }, employee: employees });
                    });
                }
                console.log('Empleado agregado');

                var token = randomtoken(8);
                db.verify(document, name, email, token);
                db.getuserid(email, (err, result) => {
                    var output = `<p>Querido ${name}</p><p>Gracias por registrarte en nuestro sitio web. Su token de ingreso está abajo:</p>
                        <ul>
                        <li>Document: ${document}</li>
                        <li>Token: ${token}</li>
                        <li>Contraseña predeterminada: employee123</li>
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
                        to: email,
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

                    // Obtener el roleId basado en el rol seleccionado
                    db.getAllRoles((err, roles) => {
                        if (err) {
                            console.error('Error al obtener los roles:', err);
                            return res.status(500).send('Error en el servidor');
                        }
                        const roleId = roles.find(r => r.name === role).id;
                        db.addUserRole(document, roleId, (err) => {
                            if (err) {
                                console.error('Error al agregar el rol del usuario:', err);
                                return res.status(500).send('Error en el servidor');
                            }
                            db.getAllemployee((err, employees) => {
                                if (err) throw err;
                                res.render('employee.ejs', { message: { type: 'success', title: 'Éxito', text: 'Empleado agregado exitosamente' }, employee: employees });
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get('/leave', (req, res) => {
    if (!req.permissions.includes('view_leaves')) {
        return res.redirect('back');
    }
    db.getAllLeave((err, result) => {
        res.render('leave.ejs', {user: result});
    });
});

router.get('/add_leave', (req, res) => {
    if (!req.permissions.includes('add_leaves')) {
        return res.redirect('back');
    }
    res.render('add_leave.ejs');
});

router.get('/edit_leave/:id', (req, res) => {
    if (!req.permissions.includes('edit_leaves')) {
        return res.redirect('back');
    }
    var id = req.params.id;
    db.getleavebyid(id, (err, result) => {
        res.render('edit_leave.ejs', {user: result});
    });
});

router.post('/edit_leave/:id', (req, res) => {
    if (!req.permissions.includes('edit_leaves')) {
        return res.redirect('back');
    }
    var id = req.params.id;
    db.edit_leave(id, req.body.name, req.body.leave_type, req.body.from,req.body.to, req.body.reason, (err, result) => {
        res.redirect('/employee/leave');
    });
});

router.get('/delete_leave/:id', (req, res) => {
    if (!req.permissions.includes('delete_leaves')) {
        return res.redirect('back');
    }
    var id = req.params.id;
    db.getleavebyid(id, (err, result) => {
        res.render('delete_leave.ejs', {user: result});
    });
});

router.post('/delete_leave/:id', (req, res) => {
    if (!req.permissions.includes('delete_leaves')) {
        return res.redirect('back');
    }
    var id = req.params.id;
    db.deleteleave(id, (err, result) => {
        res.redirect('/employee/leave');
    });
});

router.get('/edit_employee/:id', (req, res) => {
    if (!req.permissions.includes('edit_employees')) {
        return res.redirect('back');
    }
    var id = req.params.id;
    db.getEmpbyId(id, (err, result) => {
        if (err) throw err;
        db.getAllRoles((err, roles) => {
            if (err) throw err;
            res.render('edit_employee.ejs', { list: result, roles: roles });
        });
    });
});

router.post('/edit_employee/:id', (req, res) => {
    if (!req.permissions.includes('edit_employees')) {
        return res.redirect('back');
    }
    var id = req.params.id;
    var name = req.body.name;
    var email = req.body.email;
    var contact = req.body.contact;
    var date_of_birth = req.body.date_of_birth;
    var role = req.body.role;

    db.editEmp(id, name, email, contact, date_of_birth, role, (err, result) => {
        if (err) {
            console.error('Error al editar el empleado:', err);
            return db.getAllemployee((err, employees) => {
                if (err) throw err;
                res.render('employee.ejs', { message: { type: 'error', title: 'Error', text: 'Error en el servidor' }, employee: employees });
            });
        }
        db.getEmpbyId(id, (err, result) => {
            if (err) throw err;
            db.getAllRoles((err, roles) => {
                if (err) throw err;
                db.getAllemployee((err, employees) => {
                    if (err) throw err;
                    res.render('employee.ejs', { message: { type: 'success', title: 'Éxito', text: 'Empleado actualizado exitosamente' }, employee: employees });
                });
            });
        });
    });
});

router.get('/delete_employee/:id', (req, res) => {
    if (!req.permissions.includes('delete_employees')) {
        return res.redirect('back');
    }
    var id = req.params.id;
    db.getEmpbyId(id, (err, result) => {
        if (err) throw err;
        res.render('delete_employee.ejs', { list: result });
    });
});

router.post('/delete_employee/:id', (req, res) => {
    if (!req.permissions.includes('delete_employees')) {
        return res.redirect('back');
    }
    var id = req.params.id;
    db.getEmpbyId(id, (err, employee) => {
        if (err) {
            console.error('Error al obtener el empleado:', err);
            return res.status(500).send('Error en el servidor');
        }
        if (employee.length > 0) {
            var userId = employee[0].user_id;
            db.deleteEmp(id, (err) => {
                if (err) {
                    console.error('Error al eliminar el empleado:', err);
                    return db.getAllemployee((err, employees) => {
                        if (err) throw err;
                        res.render('employee.ejs', { message: { type: 'error', title: 'Error', text: 'Error en el servidor' }, employee: employees });
                    });
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
                            db.getAllemployee((err, employees) => {
                                if (err) throw err;
                                res.render('employee.ejs', { message: { type: 'success', title: 'Éxito', text: 'Empleado eliminado exitosamente' }, employee: employees });
                            });
                        });
                    });
                });
            });
        } else {
            res.status(404).send('Empleado no encontrado');
        }
    });
});

router.post('/search', (req, res) => {
    if (!req.permissions.includes('view_employees')) {
        return res.redirect('back');
    }
    var key = req.body.search;
    db.searchEmp(key, (err, result) => {
        console.log(result);
        res.render('employee.ejs', {employee: result});
    });
});

router.post('/add_leave', [
    check('name').notEmpty(),
    check('id').notEmpty(),
    check('leave_type').notEmpty(),
    check('from').notEmpty().withMessage('Fecha de inicio requerida'),
    check('to').notEmpty().withMessage('Fecha de finalización requerida'),
    check('reason').notEmpty().withMessage('Especifique la razón de la solicitud')
], (req, res) => {
    if (!req.permissions.includes('add_leaves')) {
        return res.redirect('back');
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});  
    }
    var name = req.body.name;
    var email = req.body.email;
    var contact = req.body.contact;
    var join_date = req.body.date;
    var role = req.body.role;
    var salary = req.body.salary;

    db.add_leave(name, email, contact, join_date, role, salary, (err, result) => {
        res.redirect('/employee/leave');
    });
});