const { User, Entrepreneur, Investor } = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        // 1. Extract data from the incoming request body
        const { name, email, password, role, ...otherData } = req.body;

        // 2. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 3. Cryptography: Secure the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create the correct document based on the role
        if (role === 'entrepreneur') {
            user = new Entrepreneur({
                name, email, password: hashedPassword, role, ...otherData
            });
        } else if (role === 'investor') {
            user = new Investor({
                name, email, password: hashedPassword, role, ...otherData
            });
        } else {
            return res.status(400).json({ message: 'Invalid role provided' });
        }

        // 5. Save to MongoDB
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser };