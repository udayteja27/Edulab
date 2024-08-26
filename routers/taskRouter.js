const express = require('express');
const { taskModel } = require('../models/Task');
const { auth } = require('../middleware/auth');
const { roleBased } = require('../middleware/errorHandler');
const taskRouter = express.Router();

taskRouter.post('/tasks', auth, roleBased(['admin']), async (req, res) => {
    const { title, description, status, priority } = req.body;
    try {
        const newTask = new taskModel({
            title,
            description,
            status,
            priority,
            userId: req.user.id,
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
});

taskRouter.get('/tasks', auth, roleBased(['admin']), async (req, res) => {
    const { status, priority, userId } = req.query;
    try {
        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (userId) filter.userId = userId;

        const tasks = await taskModel.find(filter);
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
});

taskRouter.put('/tasks/:id', auth, roleBased(['admin']), async (req, res) => {
    const { title, description, status, priority } = req.body;
    try {
        const updatedTask = await taskModel.findByIdAndUpdate(
            req.params.id,
            { title, description, status, priority },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
});

taskRouter.delete('/tasks/:id', auth, roleBased(['admin']), async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await taskModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
});

module.exports = { taskRouter };