// userRouter.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/User');
const { auth } = require('../middleware/auth');
const { roleBased } = require('../middleware/errorHandler');
const userRouter = express.Router();

// Registration route
userRouter.post("/register", async (req, res) => {
    const saltRound = 10;
    const { name, email, password, role } = req.body; 
    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const hashPassword = await bcrypt.hash(password, saltRound);
        const newUser = new userModel({ name, email, password: hashPassword, role });
        await newUser.save();
        res.status(201).json({ newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "wrong", error: err.message });
    }
});

// Login route
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'secret', { expiresIn: '1h' });
                res.status(200).json({ message: "Login successful", token });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something wen wrong", error: err.message });
    }
});

//admin routes
userRouter.get('/admin', auth, roleBased(['admin']), (req, res) => {
    res.json({ message: 'Hello Adminnnnnn' });
});

module.exports = { userRouter };