const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadBase64ImageToCloudinary(base64Data) {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
}

module.exports = {uploadBase64ImageToCloudinary}