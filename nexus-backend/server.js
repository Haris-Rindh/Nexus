const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Load environment variables first
dotenv.config();

// 2. Connect to the database
connectDB();

// 3. Initialize the Express application
const app = express();

// 4. Global Middleware
app.use(cors()); // Allows your React frontend to communicate with this backend
app.use(express.json()); // Tells Express to parse incoming JSON data from HTTP body

// 5. Basic Test Route
app.get('/', (req, res) => {
    res.send('Nexus API is running...');
});

// 6. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});