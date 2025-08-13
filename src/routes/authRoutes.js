const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authApiController = require('../controllers/authApiController');
const authMiddleware = require('../middleware/auth');

// User CRUD
// Protect user CRUD routes

// Profile endpoints (must come before /users/:id routes)
router.get('/users/me', authMiddleware, authController.getMe);
router.put('/users/me', authMiddleware, authController.updateMe);

router.get('/users', authMiddleware, authController.getAllUsers);
router.post('/users', authMiddleware, authController.createUser);
router.put('/users/:id', authMiddleware, authController.updateUser);
router.delete('/users/:id', authMiddleware, authController.deleteUser);

// Auth endpoints
router.post('/register', authApiController.register);
router.post('/login', authApiController.login);

module.exports = router;
