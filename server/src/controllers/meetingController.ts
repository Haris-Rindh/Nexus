import { Response } from 'express';
import { Meeting } from '../models/Meeting';
import { AuthRequest } from '../middleware/authMiddleware';

export const createMeeting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { attendeeId, title, description, startTime, endTime } = req.body;
    
    // Conflict detection
    const overlappingMeetings = await Meeting.find({
      $or: [
         { organizer: req.user._id, status: { $in: ['pending', 'accepted'] } },
         { attendee: req.user._id, status: { $in: ['pending', 'accepted'] } },
         { organizer: attendeeId, status: { $in: ['pending', 'accepted'] } },
         { attendee: attendeeId, status: { $in: ['pending', 'accepted'] } }
      ],
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) }
    });

    if (overlappingMeetings.length > 0) {
      res.status(409).json({ message: 'Meeting conflict detected (Double booking)' });
      return;
    }

    const meeting = await Meeting.create({
      organizer: req.user._id,
      attendee: attendeeId,
      title,
      description,
      startTime,
      endTime
    });

    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMeetings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const meetings = await Meeting.find({
      $or: [{ organizer: req.user._id }, { attendee: req.user._id }]
    }).populate('organizer', 'firstName lastName email').populate('attendee', 'firstName lastName email');
    
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateMeetingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      res.status(404).json({ message: 'Meeting not found' });
      return;
    }

    if (meeting.organizer.toString() !== req.user._id.toString() && meeting.attendee.toString() !== req.user._id.toString()) {
       res.status(403).json({ message: 'Unauthorized' });
       return;
    }

    meeting.status = status;
    await meeting.save();

    res.json(meeting);
  } catch (error) {
     res.status(500).json({ message: 'Server error' });
  }
};
