import { Response } from 'express';
import { Profile } from '../models/Profile';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'firstName lastName email role');

    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bio, title, company, website, location, socialLinks, preferences, history } = req.body;

    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new Profile({ user: req.user._id });
    }

    profile.bio = bio !== undefined ? bio : profile.bio;
    profile.title = title !== undefined ? title : profile.title;
    profile.company = company !== undefined ? company : profile.company;
    profile.website = website !== undefined ? website : profile.website;
    profile.location = location !== undefined ? location : profile.location;
    if (socialLinks) {
       profile.socialLinks = { ...profile.socialLinks, ...socialLinks };
    }
    if (preferences) profile.preferences = preferences;
    profile.history = history !== undefined ? history : profile.history;

    const updatedProfile = await profile.save();
    
    // send back with populated user
    const populatedProfile = await Profile.findById(updatedProfile._id).populate('user', 'firstName lastName email role');

    res.json(populatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
