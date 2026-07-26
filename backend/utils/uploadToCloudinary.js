const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Uploads a buffer (from multer memoryStorage) to Cloudinary and resolves with the secure URL.
const uploadToCloudinary = (buffer, folder = 'portfolio') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
