import { Response } from 'express';
import { Document } from '../models/Document';
import { AuthRequest } from '../middleware/authMiddleware';

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const { title } = req.body;
    
    // In a real app we'd upload to S3. Here we mock via a local /uploads path or static URL
    const fileUrl = `/uploads/${req.file.filename}`;
    
    const document = await Document.create({
      uploader: req.user._id,
      title: title || req.file.originalname,
      fileUrl
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const documents = await Document.find({ uploader: req.user._id }).populate('uploader', 'firstName lastName');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const signDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { signatureUrl } = req.body; // base64 or URL

    const document = await Document.findById(id);

    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    document.signatures.push({
      user: req.user._id,
      signatureUrl,
      signedAt: new Date()
    });

    if (document.status === 'draft') {
      document.status = 'review';
    }

    await document.save();
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
