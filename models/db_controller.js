const myslq = require('mysql');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


const con = myslq.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitalmanagement'
});

con.connect((err) => {
    if (err) {
        console.log('Error de conexión a la base de datos');
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

module.exports.signup = (username, email, password, status, callback) => {
    con.query('SELECT email FROM users WHERE email = ?', [email], (err, result) => {
        if (result[0] == undefined) {
            var query = 'INSERT INTO users (username, email, password, email_status) VALUES ("' + username + '","' + email + '","' + password + '","' + status + '")';
            console.log(query);
            con.query(query, [email], callback);
        } else {
            console.log('El correo ya existe');
        }
    });
}

module.exports.verify = (username, email, token, callback) => {
    var query = 'INSERT INTO verify (username, email, token) VALUES ("' + username + '","' + email + '","' + token + '")';
    con.query(query, callback);
};

module.exports.getuserid = (email, callback) => {
    var query = 'SELECT * FROM verify WHERE email = "' + email + '"';
    con.query(query, callback);
};

module.exports.matchtoken = (id, token, callback) => {
    var query = 'SELECT * FROM verify WHERE id = "' + id + '" AND token = "' + token + '"';
    con.query(query, callback);
    console.log(query);
};

module.exports.updateverify = (email, email_status, callback) => {
    var query = 'UPDATE users SET email_status = "' + email_status + '" WHERE email = "' + email + '"';
    con.query(query, callback);
    console.log(query); 
};


