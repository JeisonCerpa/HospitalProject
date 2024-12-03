var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.clearCookie('connect.sid'); // Elimina la cookie de 
        res.clearCookie('userId'); // Elimina la cookie de ID de usuario
        res.clearCookie('role'); // Elimina la cookie de rol
        res.clearCookie('document'); // Elimina la cookie de documento
        res.clearCookie('userRole'); // Elimina la cookie de rol de usuario
        res.redirect('/login'); // Redirige a la página de inicio de sesión
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('userId');
    res.clearCookie('role');
    res.clearCookie('document');
    res.clearCookie('userRole');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.status(500).send('Error en el servidor');
        }
        res.redirect('/login');
    });
});

module.exports = router;