const mysql = require('mysql');
const cookieParser = require('cookie-parser');

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

const checkPermissions = (requiredPermission) => {
    return (req, res, next) => {
        const userId = req.cookies.userId; // Asegúrate de que el ID del usuario esté en req.cookies.userId

        const query = `
            SELECT p.name 
            FROM permissions p
            JOIN role_permissions rp ON p.id = rp.permission_id
            JOIN user_roles ur ON rp.role_id = ur.role_id
            WHERE ur.user_id = ? AND p.name = ?
        `;

        con.query(query, [userId, requiredPermission], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (result.length > 0) {
                next();
            } else {
                res.status(403).send('Forbidden');
            }
        });
    };
};

module.exports = checkPermissions;
