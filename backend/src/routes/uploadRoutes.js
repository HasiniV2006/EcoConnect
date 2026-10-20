import express from 'express';
import { upload } from '../middleware/upload.js';
import { isCloudinaryConfigured, uploadToCloudinary } from '../config/cloudinary.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const folder = req.body.folder || 'ecoconnect';

    if (isCloudinaryConfigured()) {
      const result = await uploadToCloudinary(req.file.buffer, folder);
      return res.status(200).json({
        success: true,
        message: 'Image uploaded to Cloudinary successfully',
        url: result.url,
        publicId: result.publicId,
      });
    }

    // Graceful fallback for local development without Cloudinary credentials
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    return res.status(200).json({
      success: true,
      message: 'Image processed (Local fallback data URL)',
      url: base64,
      publicId: `local-${Date.now()}`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
