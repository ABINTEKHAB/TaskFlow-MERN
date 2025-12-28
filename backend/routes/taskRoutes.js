const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// 1. Create a New Task (POST)
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, priority, deadline } = req.body;
        const newTask = new Task({
            title,
            description,
            priority,
            deadline,
            createdBy: req.user.id // Ye auth middleware se aa raha hai
        });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 2. Get All Tasks of Logged-in User (GET)
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 3. Update Task Status/Details (PUT)
router.put('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Check if user owns the task
        if (task.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 4. Delete Task (DELETE)
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        if (task.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;