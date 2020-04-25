const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/update', userCtrl.updateUser)
router.delete('/delete', userCtrl.deleteUser)
router.get('/profile', userCtrl.getUserProfile)

module.exports = router;