const express = require('express');
const router = express.Router();

const auth = require('../auth/auth');
const controller = require('../controllers/controller');

router.post('/login', auth.login);
router.get('/home', auth.authenticateToken, controller.getBooks);
router.post('/addBook', auth.authenticateToken, controller.addBook);
router.delete('/deleteBook', auth.authenticateToken, controller.deleteBook);

module.exports = router;
