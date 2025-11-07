const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/changePassword', authController.changePassword);
router.get('/verifyEmail', authController.verifyEmail);
router.post('/changePasswordRequest', authController.changePasswordRequest);

module.exports = router;