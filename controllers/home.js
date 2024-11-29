var express = require('express');
var router = express.Router();
var db = require.main.require('./models/db_controller');
var bodyPaser = require('body-parser');
const checkPermissions = require('../models/checkPermissions');

router.get('*', function(req, res, next){
    if(req.cookies['username'] == null){
        res.redirect('/login');
    } else {
        next();
    }
});

router.get('/', function(req, res){
    const userId = req.cookies.userId; // Obtener el ID del usuario desde las cookies
    const userRole = req.cookies.role; // Obtener el rol del usuario

    db.getAllDoc(function(err, result){
        if (err || !result) {
            console.error('Error retrieving doctors:', err);
            return res.status(500).send('Error retrieving doctors');
        }
        db.getallappointment(function(err1, result1){
            if (err1 || !result1) {
                console.error('Error retrieving appointments:', err1);
                return res.status(500).send('Error retrieving appointments');
            }
            var total_doc = result.length;
            var appointment = result1.length;

            // Obtener los permisos del usuario
            const query = `
                SELECT p.name 
                FROM permissions p
                JOIN role_permissions rp ON p.id = rp.permission_id
                JOIN user_roles ur ON rp.role_id = ur.role_id
                WHERE ur.user_id = ?
            `;
            db.con.query(query, [userId], (err, permissions) => {
                if (err) {
                    console.error('Error retrieving permissions:', err);
                    return res.status(500).send('Error retrieving permissions');
                }

                const userPermissions = permissions.map(p => p.name);
                res.render('home.ejs', {
                    doc: total_doc,
                    doclist: result,
                    appointment: appointment,
                    applist: result1,
                    permissions: userPermissions,
                    role: userRole // Pasar el rol del usuario a la vista
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
    var desc = req.body.desc;
    db.add_dept(name,desc,function(err,result){
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

    db.edit_dept(req.params.id,req.body.dpt_name,req.body.desc,function(err,result){
        res.redirect('/home/departments');
    });
});

router.get('/profile',function(req,res){
    var username = req.cookies['username'];
    db.getuserdetails(username,function(err,result){
        //console.log(result);
        res.render('profile.ejs',{list:result});
    });
});

router.post('/profile',function(req,res){
    var username = req.cookies['username'];
    db.getuserdetails(username,function(err,result){
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