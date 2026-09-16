import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Ensure upload destination folder exists
const uploadDir = path.join(__dirname, '../../uploads/stalls');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  }
});

// Allowed Image Formats: JPG, JPEG, PNG, WebP
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WebP images are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  }
});

// POST /api/upload/stall-image - Upload stall photo (Admin only)
router.post(
  '/stall-image',
  requireAuth,
  requireRole('admin'),
  (req: Request, res: Response) => {
    upload.single('photo')(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size exceeds 5MB limit.'
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Error processing image file.'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an image file with field name "photo".'
        });
      }

      const host = req.get('host') || 'localhost:5000';
      const protocol = req.protocol || 'http';
      const imageUrl = `${protocol}://${host}/uploads/stalls/${req.file.filename}`;

      res.json({
        success: true,
        message: 'Stall photo uploaded successfully.',
        imageUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    });
  }
);

export default router;
