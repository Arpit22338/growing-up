// Cloudinary helper for uploading PFPs and payment screenshots.
// Free tier: 25GB storage, 25GB/mo bandwidth, 25K transformations/mo.
// https://cloudinary.com/documentation/node_integration
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');

// Prefer the single CLOUDINARY_URL form (recommended by Cloudinary).
// Falls back to individual vars if set.
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

/**
 * Upload an image buffer to Cloudinary.
 *
 * @param {Buffer} buffer     - file buffer from multer
 * @param {string} folder     - logical folder, e.g. 'pfp' or 'payments'
 * @param {string} publicId   - stable id, e.g. userId or 'temp-{sessionId}'
 * @param {object} opts       - optional { transformation }
 * @returns {Promise<{secure_url: string, public_id: string, width: number, height: number}>}
 */
function uploadImage(buffer, folder, publicId, opts = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `growing-up/${folder}`,
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
        transformation: opts.transformation || [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.on('error', reject);
    stream.end(buffer);
  });
}

/**
 * PFP: auto-crop to a 400x400 square (face-aware), store in folder `growing-up/pfp/{userId}`.
 */
function uploadPfp(buffer, userId) {
  return uploadImage(buffer, 'pfp', `user-${userId}`, {
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  });
}

/**
 * Payment proof: keep the full screenshot readable for the admin.
 * Cap at 1600px on the long edge so we don't blow through bandwidth.
 */
function uploadPaymentProof(buffer, paymentId) {
  return uploadImage(buffer, 'payments', `payment-${paymentId}-${Date.now()}`, {
    transformation: [
      { width: 1600, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  });
}

/**
 * Random short id for temp uploads (signup PFP before user exists).
 */
function tempId() {
  return crypto.randomBytes(8).toString('hex');
}

module.exports = {
  cloudinary,
  uploadImage,
  uploadPfp,
  uploadPaymentProof,
  tempId
};
