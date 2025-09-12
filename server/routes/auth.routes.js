const { Router } = require('express');
const { register, login, me, logout} = require('../controllers/auth.controller');
const { authRequired } = require('../middlewares/auth');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authRequired, me);
router.post('/logout', authRequired, logout);


module.exports = router;