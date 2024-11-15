const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'h1'
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
            var query = 'INSERT INTO users (username, email, password, email_status) VALUES (?, ?, ?, ?)';
            console.log(query);
            con.query(query, [username, email, password, status], callback);
        } else {
            console.log('El correo ya existe');
        }
    });
}


//Ejemplo de evitar injection SQL
module.exports.verify = (username, email, token, callback) => {
    var query = 'INSERT INTO verify (username, email, token) VALUES (?, ?, ?)';
    con.query(query, [username, email, token], callback);
};

module.exports.getuserid = (email, callback) => {
    var query = 'SELECT * FROM verify WHERE email = ?';
    con.query(query, [email], callback);
};

module.exports.matchtoken = (id, token, callback) => {
    var query = 'SELECT * FROM verify WHERE id = ? AND token = ?';
    con.query(query, [id, token], callback);
    console.log(query);
};

module.exports.updateverify = (email, email_status, callback) => {
    var query = 'UPDATE users SET email_status = ? WHERE email = ?';
    con.query(query, [email_status, email], callback);
    console.log(query); 
};

module.exports.findOne = (email, callback) => {
    var query = 'SELECT * FROM users WHERE email = ?';
    con.query(query, [email], callback);
    console.log(query);
};

module.exports.temp = (id, email, token, callback) => {
    var query = 'INSERT INTO temp (id, email, token) VALUES (?, ?, ?)';
    con.query(query, [id, email, token], callback);
    console.log(query);
};

module.exports.add_doctor = (first_name, last_name, email, dob, gender, address, phone, image, department, biography, callback) => {
    var query = 'INSERT INTO doctor (first_name, last_name, email, dob, gender, address, phone, image, department, biography) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    con.query(query, [first_name, last_name, email, dob, gender, address, phone, image, department, biography], callback);
    console.log(query);
};

module.exports.getAllDoc = (callback) => {
    var query = 'SELECT * FROM doctor';
    con.query(query, callback);
    console.log(query);
};

module.exports.getDocbyId = (id, callback) => {
    var query = 'SELECT * FROM doctor WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.editDoc = (id, first_name, last_name, email, dob, gender, address, phone, department, biography, callback) => {
    var query = 'UPDATE doctor SET first_name = ?, last_name = ?, email = ?, dob = ?, gender = ?, address = ?, phone = ?, department = ?, biography = ? WHERE id = ?';
    con.query(query, [first_name, last_name, email, dob, gender, address, phone, department, biography, id], callback);
    console.log(query);
};

module.exports.deleteDoc = (id, callback) => {
    var query = 'DELETE FROM doctor WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.searchDoc = (key, callback) => {
    var query = 'SELECT * FROM doctor WHERE first_name LIKE ?';
    con.query(query, ['%' + key + '%'], callback);
    console.log(query);
};

module.exports.getalldept = (callback) => {
    var query = 'SELECT * FROM departments';
    con.query(query, callback);
    console.log(query);
};

module.exports.getleavebyid = (id, callback) => {
    var query = 'SELECT * FROM leaves WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.getAllleave = (callback) => {
    var query = 'SELECT * FROM leaves';
    con.query(query, callback);
    console.log(query);
};

module.exports.add_leave = (id, name, type, from, to, reason, callback) => {
    var query = 'INSERT INTO leaves (emp_id, employee, leave_type, date_from, date_to, reason) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(query, [id, name, type, from, to, reason], callback);
    console.log(query);
};

module.exports.deleteleave = (id, callback) => {
    var query = 'DELETE FROM leaves WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.getAllemployee = (callback) => {
    var query = 'SELECT * FROM employees';
    con.query(query, callback);
    console.log(query);
};

module.exports.add_employee = (name, email, contact, join_date, role, salary,callback) => {
    var query = 'INSERT INTO employee (name, email, contact, join_date, role, salary) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(query, [name, email, contact, join_date, role, salary], callback);
    console.log(query);
};

module.exports.searchEmp = (key, callback) => {
    var query = 'SELECT * FROM employees WHERE name LIKE ?';
    con.query(query, ['%' + key + '%'], callback);
    console.log(query);
};

module.exports.deleteEmp = (id, callback) => {
    var query = 'DELETE FROM employees WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.editEmp = (id, name, email, contact, join_date, role, salary, callback) => {
    var query = 'UPDATE employees SET name = ?, email = ?, contact = ?, join_date = ?, role = ?, salary = ? WHERE id = ?';
    con.query(query, [name, email, contact, join_date, role, salary, id], callback);
    console.log(query);
};

module.exports. getEmpbyId = (id, callback) => {
    var query = 'SELECT * FROM employees WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.edit_leave = (id, name, type, from, to, reason, callback) => {
    var query = 'UPDATE leaves SET employee = ?, leave_type = ?, date_from = ?, date_to = ?, reason = ? WHERE id = ?';
    con.query(query, [name, type, from, to, reason, id], callback);
    console.log(query);
};

module.exports.add_appointment = (p_name, department, d_name, date, time, email, phone, callback) => {
    var query = 'INSERT INTO appointment (patient_name, department, doctor_name, date, time, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)';
    con.query(query, [p_name, department, d_name, date, time, email, phone], callback);
    console.log(query);
};

module.exports.getallappointment = (callback) => {
    var query = 'SELECT * FROM appointment';
    con.query(query, callback);
    console.log(query);
};

module.exports.getallappointmentbyid = (id, callback) => {
    var query = 'SELECT * FROM appointment WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.editappointment = (id, p_name, department, d_name, date, time, email, phone, callback) => {
    var query = 'UPDATE appointment SET patient_name = ?, department = ?, doctor_name = ?, date = ?, time = ?, email = ?, phone = ? WHERE id = ?';
    con.query(query, [p_name, department, d_name, date, time, email, phone, id], callback);
    console.log(query);
};

module.exports.deleteappointment = (id, callback) => {
    var query = 'DELETE FROM appointment WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.getallmed = (callback) => {
    var query = 'SELECT * FROM store order by id desc';
    con.query(query, callback);
    console.log(query);
};

module.exports.addMed = (name, p_date, expire, e_date, price, quantity, callback) => {
    var query = 'INSERT INTO store (name, p_date, expire, expire_end, price, quantity) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(query, [name, p_date, expire, e_date, price, quantity], callback);
    console.log(query);
};

module.exports.getMedbyId = (id, callback) => {
    var query = 'SELECT * FROM store WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.editmed = (id, name, p_date, expire, e_date, price, quantity, callback) => {
    var query = 'UPDATE store SET name = ?, p_date = ?, expire = ?, expire_end = ?, price = ?, quantity = ? WHERE id = ?';
    con.query(query, [name, p_date, expire, e_date, price, quantity, id], callback);
    console.log(query);
};

module.exports.deletemed = (id, callback) => {
    var query = 'DELETE FROM store WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.searchmed = (key, callback) => {
    var query = 'SELECT * FROM store WHERE name LIKE ?';
    con.query(query, ['%' + key + '%'], callback);
    console.log(query);
};

module.exports.postcomplain = (message, name, email, subject, callback) => {
    var query = 'INSERT INTO complain (message, name, email, subject) VALUES (?, ?, ?, ?)';
    con.query(query, [message, name, email, subject], callback);
    console.log(query);
};

module.exports.getcomplain = (callback) => {
    var query = 'SELECT * FROM complain';
    con.query(query, callback);
    console.log(query);
};

module.exports.getAllPatients = (callback) => {
    var query = 'SELECT * FROM patients';
    con.query(query, callback);
    console.log(query);
}

module.exports.add_patient = (document, name, email, phone, gender, address, callback) => {
    var query = 'INSERT INTO patients (document, name, email, phone, gender, address) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(query, [document, name, email, phone, gender, address], callback);
    console.log(query);
}

module.exports.getPatientByDoc = (document, callback) => {
    var query = 'SELECT * FROM patients WHERE document = ?';
    con.query(query, [document], callback);
    console.log(query);
}

module.exports.editPatient = (document, name, email, phone, gender, address, callback) => {
    var query = 'UPDATE patients SET name = ?, email = ?, phone = ?, gender = ?, address = ? WHERE document = ?';
    con.query(query, [name, email, phone, gender, address, document], callback);
    console.log(query);
}

module.exports.deletePatient = (document, callback) => {
    var query = 'DELETE FROM patients WHERE document = ?';
    con.query(query, [document], callback);
    console.log(query);
}

module.exports.searchPatient = (key, callback) => {
    var query = 'SELECT * FROM patients WHERE name LIKE ?';
    con.query(query, ['%' + key + '%'], callback);
    console.log(query);
}

