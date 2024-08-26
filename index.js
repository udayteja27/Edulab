const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();
app.get('/',((req,res)=>{
    res.send("This is a home route")
}))
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));