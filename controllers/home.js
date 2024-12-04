var express = require('express');
var router = express.Router();
var db = require.main.require('./models/db_controller');
var bodyParser = require('body-parser'); // Corregir el nombre del módulo

router.get('*', function(req, res, next){
    if(req.cookies['userId'] == null){
        res.redirect('/login');
    } else {
        next();
    }
});

router.get('/', (req, res) => {
    const userId = req.cookies.userId;
    const userRole = req.cookies.role;
    const username = req.cookies.username;
    db.getUserPermissions(userId, (err, userPermissions) => {
        if (err) {
            console.error('Error retrieving permissions:', err);
            return res.status(500).send('Error retrieving permissions');
        }
        db.getAllDoc((err, doctors) => {
            if (err) {
                console.error('Error retrieving doctors:', err);
                return res.status(500).send('Error retrieving doctors');
            }
            db.getAllleave((err, leaves) => {
                if (err) {
                    console.error('Error retrieving leaves:', err);
                    return res.status(500).send('Error retrieving leaves');
                }
                db.getAllPatients((err, patients) => {
                    if (err) {
                        console.error('Error retrieving patients:', err);
                        return res.status(500).send('Error retrieving patients');
                    }
                    db.getallappointment((err, appointments) => {
                        if (err) {
                            console.error('Error retrieving appointments:', err);
                            return res.status(500).send('Error retrieving appointments');
                        }
                        res.render('home.ejs', {
                            userId: userId,
                            userRole: userRole,
                            username: username,
                            userPermissions: userPermissions,
                            doc: doctors.length,
                            appointment: appointments.length,
                            applist: appointments,
                            doclist: doctors,
                            newPatients: patients
                        });
                    });
                });
            });
        });
    });
});

router.get('/departments',function(req,res){

    db.getalldept(function(err,result){

        res.render('departments.ejs',{list:result});

    });
    
});

router.get('/add_departments',function(req,res){
    res.render('add_departments.ejs');
});

router.post('/add_departments',function(req,res){
    var name = req.body.dpt_name;
    db.add_dept(name,function(err,result){
        res.redirect('/home/departments');
    });
});

router.get('/delete_department/:id',function(req,res){

    var id = req.params.id;
    db.getdeptbyId(id,function(err,result){
        res.render('delete_department.ejs',{list:result});
    });
});

router.post('/delete_department/:id',function(req,res){
    var id = req.params.id;
    db.delete_department(id,function(err,result){
        res.redirect('/home/departments');
    });
});

router.get('/edit_department/:id',function(req,res){
    var id = req.params.id;
    db.getdeptbyId(id,function(err,result){
        res.render('edit_department.ejs',{list:result});
    })
});

router.post('/edit_department/:id',function(req,res){
    db.edit_dept(req.params.id,req.body.dpt_name,function(err,result){
        res.redirect('/home/departments');
    });
});

router.get('/profile',function(req,res){
    var userId = req.cookies['userId'];
    db.getuserdetails(userId,function(err,result){
        //console.log(result);
        res.render('profile.ejs',{list:result});
    });
});

router.post('/profile',function(req,res){
    var userId = req.cookies['userId'];
    db.getuserdetails(userId,function(err,result){
        var id = result[0].id;
        var password = result[0].password;
        var username = result[0].username; 
        if (password== req.body.password){

            db.edit_profile(id,req.body.username,req.body.email,req.body.new_password,function(err,result1){
                if (result1){
                    res.send("profile edited successfully");
                }
                if(!result1){ res.send("old password did not match");}
                   

            });
        }
        


    }) ;
});

module.exports = router;