const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure the Storage Rules
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'nexus_documents',
        allowed_formats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'],
        resource_type: 'raw'
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = upload;