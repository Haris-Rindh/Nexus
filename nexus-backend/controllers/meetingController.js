const Meeting = require('../models/Meeting');

const requestMeeting = async (req, res) => {
    try {
        const { targetUserId, startTime, endTime, purpose } = req.body;

        const newStartTime = new Date(startTime);
        const newEndTime = new Date(endTime);

        const conflict = await Meeting.findOne({
            investorId: targetUserId,

            status: { $in: ['pending', 'accepted'] },

            startTime: { $lt: newEndTime },
            endTime: { $gt: newStartTime }
        });

        if (conflict) {
            return res.status(400).json({
                message: 'Time conflict: The user is already booked during this time block.'
            });
        }

        const meeting = new Meeting({
            entrepreneurId: req.user.id,
            investorId: targetUserId,
            startTime: newStartTime,
            endTime: newEndTime,
            purpose
        });

        await meeting.save();
        res.status(201).json({ message: 'Meeting requested successfully', meeting });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMeetings = async (req, res) => {
    try {
        const query = req.user.role === 'investor'
            ? { investorId: req.user.id }
            : { entrepreneurId: req.user.id };

        const meetings = await Meeting.find(query)
            .populate('entrepreneurId', 'name avatarUrl startupName')
            .populate('investorId', 'name avatarUrl');

        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { requestMeeting, getMeetings };