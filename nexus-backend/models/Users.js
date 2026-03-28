const mongoose = require('mongoose');

// 1. Define the base options, crucially setting the discriminatorKey
const baseOptions = {
    discriminatorKey: 'role', // This tells Mongoose which sub-schema to apply
    timestamps: true,         // Automatically handles createdAt and updatedAt
    collection: 'users'       // Forces all of them into one collection
};

// 2. The Base User Schema (Shared Fields)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // We will hash this in Phase 2
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    isOnline: { type: Boolean, default: false }
}, baseOptions);

// Compile the base model
const User = mongoose.model('User', UserSchema);

// 3. The Entrepreneur Discriminator
const Entrepreneur = User.discriminator('entrepreneur', new mongoose.Schema({
    startupName: { type: String, required: true },
    pitchSummary: { type: String, required: true },
    fundingNeeded: { type: String, required: true },
    industry: { type: String, required: true },
    location: { type: String, required: true },
    foundedYear: { type: Number, required: true },
    teamSize: { type: Number, required: true }
}));

// 4. The Investor Discriminator
const Investor = User.discriminator('investor', new mongoose.Schema({
    investmentInterests: [{ type: String }],
    investmentStage: [{ type: String }],
    portfolioCompanies: [{ type: String }],
    totalInvestments: { type: Number, default: 0 },
    minimumInvestment: { type: String, required: true },
    maximumInvestment: { type: String, required: true }
}));

module.exports = { User, Entrepreneur, Investor };