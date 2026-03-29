const { User } = require('../models/User');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the base fields if they are provided in the request
        if (req.body.name) user.name = req.body.name;
        if (req.body.bio) user.bio = req.body.bio;
        if (req.body.avatarUrl) user.avatarUrl = req.body.avatarUrl;

        // Handle polymorphic fields based on role
        if (user.role === 'entrepreneur') {
            if (req.body.startupName) user.startupName = req.body.startupName;
            if (req.body.pitchSummary) user.pitchSummary = req.body.pitchSummary;
            if (req.body.fundingNeeded) user.fundingNeeded = req.body.fundingNeeded;
            if (req.body.industry) user.industry = req.body.industry;
        } else if (user.role === 'investor') {
            if (req.body.investmentInterests) user.investmentInterests = req.body.investmentInterests;
            if (req.body.minimumInvestment) user.minimumInvestment = req.body.minimumInvestment;
            if (req.body.maximumInvestment) user.maximumInvestment = req.body.maximumInvestment;
        }

        // Save the updated document back to MongoDB
        const updatedUser = await user.save();

        // Return the updated user (excluding the password)
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile };