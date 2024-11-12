var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { check } = require('express-validator');
var db = require.main.require('./models/db_controller');
const { validationResult } = require('express-validator');

module.exports = router;

router.get('*', (req, res, next) => {
    if (req.cookies['username'] == null) {
        res.redirect('/login');
    } else {
        next()
    }

});


router.get('/', (req, res) => {
    db.getAllemployee((err, result) => {
        res.render('employee.ejs', {employee: result});
    });
});

router.get('/add', (req, res) => {
    res.render('add_employee.ejs');
});

router.post('/add', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var contact = req.body.contact;
    var join_date = req.body.date;
    var role = req.body.role;
    var salary = req.body.salary;

    db.add_employee(name, email, contact, join_date, role, (err, result) => {
        console.log('Empleado agregado');
        res.redirect('/employee');
    });
});

router.get('/leave', (req, res) => {
    db.getAllLeave((err, result) => {
        res.render('leave.ejs', {user: result});
    });
});

router.get('/add_leave', (req, res) => {
    res.render('add_leave.ejs');
});

router.get('/edit_leave/:id', (req, res) => {
    var id = req.params.id;
    db.getleavebyid(id, (err, result) => {
        res.render('edit_leave.ejs', {user: result});
    });
});

router.post('/edit_leave/:id', (req, res) => {
    var id = req.params.id;
    db.edit_leave(id, req.body.name, req.body.leave_type, req.body.from,req.body.to, req.body.reason, (err, result) => {
        res.redirect('/employee/leave');
    });
});

router.get('/delete_leave/:id', (req, res) => {
    var id = req.params.id;
    db.getleavebyid(id, (err, result) => {
        res.render('delete_leave.ejs', {user: result});
    });
});

router.post('/delete_leave/:id', (req, res) => {
    var id = req.params.id;
    db.deleteleave(id, (err, result) => {
        res.redirect('/employee/leave');
    });
});

router.get('/edit_employee/:id', (req, res) => {
    var id = req.params.id;
    db.getEmpbyid(id, (err, result) => {
        res.render('edit_employee.ejs', {list: result});
    });
});

router.post('/edit_employee/:id', (req, res) => {
    var id = req.params.id;
    var name = req.body.name;
    var email = req.body.email;
    var contact = req.body.contact;
    var join_date = req.body.date;
    var role = req.body.role;
    var salary = req.body.salary;
    db.editEmp(id, name, email, contact, join_date, role, salary, (err, result) => {
        console.log('Empleado editado');
        res.redirect('/employee');
        });
});

router.get('/delete_employee/:id', (req, res) => {
    var id = req.params.id;
    db.getEmpbyid(id, (err, result) => {
        res.render('delete_employee.ejs', {list: result});
    });
});

router.post('/delete_employee/:id', (req, res) => {
    var id = req.params.id;
    db.deleteEmp(id, (err, result) => {
        res.redirect('/employee');
    });
});

router.post('/search', (req, res) => {
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