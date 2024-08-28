const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/add', userController.addUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
