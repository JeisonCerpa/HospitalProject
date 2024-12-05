const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const moment = require('moment'); // Añadir esta línea

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
});

module.exports.con = con; // Exportar la conexión

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
module.exports.verify = (id, username, email, token, callback) => {
    var query = 'INSERT INTO verify (id, username, email, token) VALUES (?, ?, ?, ?)';
    con.query(query, [id, username, email, token], callback);
};

module.exports.getuserid = (email, callback) => {
    var query = 'SELECT * FROM verify WHERE email = ?';
    con.query(query, [email], callback);
};

module.exports.matchtoken = (document, token, callback) => {
    var query = 'SELECT * FROM verify WHERE id = ? AND token = ?';
    con.query(query, [document, token], (err, result) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
};

module.exports.updateverify = (email, email_status, callback) => {
    var query = 'UPDATE users SET email_status = ? WHERE email = ?';
    con.query(query, [email_status, email], callback);
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

module.exports.add_doctor = (document, name, email, date_of_birth, gender, address, phone, image, department, biography, callback) => {
    var role = 'doctor';
    var password = 'doctor123';
    var email_status = 'not_verified';
    var password_changed = false; // Añadir este campo

    // Convertir la fecha de nacimiento al formato correcto (YYYY-MM-DD)
    var formattedDateOfBirth = new Date(date_of_birth).toISOString().split('T')[0];

    // Insertar en la tabla users
    var userQuery = 'INSERT INTO users (id, username, email, password, email_status, role, password_changed) VALUES (?, ?, ?, ?, ?, ?, ?)'; // Añadir password_changed
    con.query(userQuery, [document, name, email, password, email_status, role, password_changed], (err) => {
        if (err) return callback(err);

        // Insertar en la tabla doctors
        var doctorQuery = 'INSERT INTO doctors (document, name, email, date_of_birth, gender, address, phone, image, department, biography, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        con.query(doctorQuery, [document, name, email, formattedDateOfBirth, gender, address, phone, image, department, biography, document], callback);
        console.log(doctorQuery);
    });
};

module.exports.getAllDoc = (callback) => {
    var query = 'SELECT * FROM doctors';
    con.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
};

module.exports.getDocByDocument = (document, callback) => {
    var query = 'SELECT * FROM doctors WHERE document = ?';
    con.query(query, [document], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
}

module.exports.editDoc = (document, name, email, date_of_birth, gender, address, phone, department, biography, callback) => {
    var formattedDateOfBirth = new Date(date_of_birth).toISOString().split('T')[0];
    var query = 'UPDATE doctors SET name = ?, email = ?, date_of_birth = ?, gender = ?, address = ?, phone = ?, department = ?, biography = ? WHERE document = ?';
    con.query(query, [name, email, formattedDateOfBirth, gender, address, phone, department, biography, document], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
};

module.exports.deleteDoc = (document, callback) => {
    var query = 'DELETE FROM doctors WHERE document = ?';
    con.query(query, [document], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        // Eliminar de la tabla verify
        var deleteVerifyQuery = 'DELETE FROM verify WHERE id = ?';
        con.query(deleteVerifyQuery, [document], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return callback(err, null);
            }
            callback(null, result);
        });
    });
    console.log(query);
};

module.exports.searchDoc = (key, callback) => {
    var query = 'SELECT * FROM doctors WHERE name LIKE ? or document LIKE ?';
    con.query(query, ['%' + key + '%', '%' + key + '%'], callback);
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
    var query = 'SELECT * FROM employee';
    con.query(query, callback);
    console.log(query);
};

module.exports.add_employee = (document, name, email, contact, date_of_birth, role, user_id, callback) => {
    var query = 'INSERT INTO employee (id, name, email, contact, date_of_birth, role, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    con.query(query, [document, name, email, contact, date_of_birth, role, user_id], callback);
    console.log(query);
};

module.exports.searchEmp = (key, callback) => {
    var query = 'SELECT * FROM employees WHERE name LIKE ?';
    con.query(query, ['%' + key + '%'], callback);
    console.log(query);
};

module.exports.deleteEmp = (id, callback) => {
    var query = 'DELETE FROM employee WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.editEmp = (id, name, email, contact, date_of_birth, role, callback) => {
    var query = 'UPDATE employee SET name = ?, email = ?, contact = ?, date_of_birth = ?, role = ? WHERE id = ?';
    con.query(query, [name, email, contact, date_of_birth, role, id], callback);
    console.log(query);
};

module.exports.getEmpbyId = (id, callback) => {
    var query = 'SELECT * FROM employee WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.edit_leave = (id, name, type, from, to, reason, callback) => {
    var query = 'UPDATE leaves SET employee = ?, leave_type = ?, date_from = ?, date_to = ?, reason = ? WHERE id = ?';
    con.query(query, [name, type, from, to, reason, id], callback);
    console.log(query);
};

module.exports.add_appointment = (patient_document, department, doctor_document, date, time, callback) => {
    var query = 'INSERT INTO appointment (patient_document, department, doctor_document, date, time) VALUES (?, ?, ?, ?, ?)';
    con.query(query, [patient_document, department, doctor_document, date, time], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
};

module.exports.getallappointment = (callback) => {
    var query = `
        SELECT appointment.*, patients.name as patient_name, patients.email as patient_email, patients.phone as patient_phone, doctors.name as doctor_name 
        FROM appointment 
        JOIN patients ON appointment.patient_document = patients.document
        JOIN doctors ON appointment.doctor_document = doctors.document
    `;
    con.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
};

module.exports.getallappointmentbyid = (id, callback) => {
    var query = 'SELECT * FROM appointment WHERE id = ?';
    con.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
};

module.exports.editappointment = (id, patient_document, department, doctor_document, date, time, callback) => {
    var query = 'UPDATE appointment SET patient_document = ?, department = ?, doctor_document = ?, date = ?, time = ? WHERE id = ?';
    con.query(query, [patient_document, department, doctor_document, date, time, id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
};

module.exports.deleteappointment = (id, callback) => {
    var query = 'DELETE FROM appointment WHERE id = ?';
    con.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
};

module.exports.getallmed = (callback) => {
    var query = 'SELECT * FROM store order by id desc';
    con.query(query, callback);
    console.log(query);
};

module.exports.addMed = (name, p_date, e_date, price, quantity, callback) => {
    var query = 'INSERT INTO store (name, p_date, expire_end, price, quantity) VALUES (?, ?, ?, ?, ?)';
    con.query(query, [name, p_date, e_date, price, quantity], callback);
    console.log(query);
};

module.exports.getMedbyId = (id, callback) => {
    var query = 'SELECT * FROM store WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.editMed = (id, name, p_date, expire_end, price, quantity, callback) => {
    var query = 'UPDATE store SET name = ?, p_date = ?, expire_end = ?, price = ?, quantity = ? WHERE id = ?';
    con.query(query, [name, p_date, expire_end, price, quantity, id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            if (typeof callback === 'function') {
                return callback(err);
            }
        }
        if (typeof callback === 'function') {
            callback(null, result);
        }
    });
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

module.exports.add_patient = (document, name, email, date_of_birth, phone, gender, address, callback) => {
    var role = 'patient';
    var password = 'patient123';
    var email_status = 'not_verified';
    var password_changed = false;

    // Verificar si date_of_birth es una fecha válida
    var formattedDateOfBirth = new Date(date_of_birth);
    if (isNaN(formattedDateOfBirth.getTime())) {
        if (typeof callback === 'function') {
            return callback(new Error('Invalid date_of_birth value'));
        }
        return;
    }
    formattedDateOfBirth = formattedDateOfBirth.toISOString().split('T')[0];

    // Insertar en la tabla users
    var userQuery = 'INSERT INTO users (id, username, email, password, email_status, role, password_changed) VALUES (?, ?, ?, ?, ?, ?, ?)';
    con.query(userQuery, [document, name, email, password, email_status, role, password_changed], (err) => {
        if (err) {
            if (typeof callback === 'function') {
                return callback(err);
            }
            return;
        }

        // Insertar en la tabla patients
        var patientQuery = 'INSERT INTO patients (document, name, email, date_of_birth, phone, gender, address, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        con.query(patientQuery, [document, name, email, formattedDateOfBirth, phone, gender, address, document], (err, result) => {
            if (typeof callback === 'function') {
                return callback(err, result);
            }
        });
    });
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
    // Primero obtenemos el user_id del paciente
    var getUserIdQuery = 'SELECT user_id FROM patients WHERE document = ?';
    con.query(getUserIdQuery, [document], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        if (result.length > 0) {
            var userId = result[0].user_id;
            // Eliminamos el paciente
            var deletePatientQuery = 'DELETE FROM patients WHERE document = ?';
            con.query(deletePatientQuery, [document], (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return callback(err, null);
                }
                // Eliminamos el usuario correspondiente
                var deleteUserQuery = 'DELETE FROM users WHERE id = ?';
                con.query(deleteUserQuery, [userId], (err, result) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        return callback(err, null);
                    }
                    callback(null, result);
                });
            });
        } else {
            callback(new Error('Patient not found'), null);
        }
    });
    console.log(getUserIdQuery);
}

module.exports.searchPatient = (key, callback) => {
    var query = 'SELECT * FROM patients WHERE name LIKE ? or document LIKE ? or email LIKE ? or phone LIKE ?';
    con.query(query, ['%' + key + '%', '%' + key + '%', '%' + key + '%', '%' + key + '%'], callback);
    console.log(query);
}

module.exports.getdeptbyId = (id, callback) => {
    var query = 'SELECT * FROM departments WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.edit_dept = (id, department_name, callback) => {
    var query = 'UPDATE departments SET department_name = ? WHERE id = ?';
    con.query(query, [department_name, id], callback);
    console.log(query);
};

module.exports.delete_department = (id, callback) => {
    var query = 'DELETE FROM departments WHERE id = ?';
    con.query(query, [id], callback);
    console.log(query);
};

module.exports.add_dept = (department_name, callback) => {
    var query = 'INSERT INTO departments (department_name) VALUES (?)';
    con.query(query, [department_name], callback);
    console.log(query);
};

module.exports.deleteUser = (userId, callback) => {
    var sql = 'DELETE FROM users WHERE id = ?';
    con.query(sql, [userId], (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

module.exports.getAppointmentsByDepartment = (department, callback) => {
    var query = 'SELECT * FROM appointment WHERE department = ?';
    con.query(query, [department], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
};

module.exports.checkDoctorAvailability = (doctorDocument, date, time, callback) => {
    var query = 'SELECT * FROM appointment WHERE doctor_document = ? AND date = ? AND time = ?';
    con.query(query, [doctorDocument, date, time], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
};

module.exports.getUserPermissions = (userId, callback) => {
    const query = `
        SELECT p.name 
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = ?
    `;
    con.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        const permissions = result.map(row => row.name);
        callback(null, permissions);
    });
};

module.exports.updatePassword = (document, newPassword, callback) => {
    var query = 'UPDATE users SET password = ?, password_changed = ? WHERE id = ?';
    con.query(query, [newPassword, true, document], callback);
    console.log(query);
};

module.exports.addUserRole = (userId, roleId, callback) => {
    var query = 'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)';
    con.query(query, [userId, roleId], callback);
    console.log(query);
};

module.exports.getAllRoles = (callback) => {
    var query = 'SELECT * FROM roles';
    con.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
};

module.exports.deleteUserRole = (userId, callback) => {
    var query = 'DELETE FROM user_roles WHERE user_id = ?';
    con.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
    console.log(query);
};

module.exports.deleteVerify = function (userId, callback) {
    var sql = "DELETE FROM verify WHERE id = ?";
    con.query(sql, [userId], function (err, result) {
        if (err) {
            console.error('Error al eliminar la verificación del usuario:', err);
            return callback(err);
        }
        callback(null, result);
    });
};