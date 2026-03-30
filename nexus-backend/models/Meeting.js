const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    // 1. The Participants
    entrepreneurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    investorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // 2. The Time Block (Crucial for your "Query Finder")
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },

    // 3. Meeting Details
    purpose: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);