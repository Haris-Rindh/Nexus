import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadDocument, getDocuments, signDocument } from '../controllers/documentController';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename(req: any, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.route('/')
  .post(protect, upload.single('document'), uploadDocument)
  .get(protect, getDocuments);

router.route('/:id/sign')
  .put(protect, signDocument);

export default router;
