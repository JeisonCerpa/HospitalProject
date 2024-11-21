var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.clearCookie('connect.sid'); // Elimina la cookie de sesión
        res.redirect('/login'); // Redirige a la página de inicio de sesión
    });
});

module.exports = router;