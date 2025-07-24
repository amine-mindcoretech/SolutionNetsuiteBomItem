//authRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.register);
router.get('/:id', userController.getUser);
router.get('/', userController.getUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
