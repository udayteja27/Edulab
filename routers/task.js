const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const { createTask, getTasks, getTask, updateTask, deleteTask } = require('../controllers/taskController');

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.get('/:id', auth, getTask);
router.patch('/:id', auth, updateTask);
router.delete('/:id', auth, adminOnly, deleteTask);

module.exports = router;