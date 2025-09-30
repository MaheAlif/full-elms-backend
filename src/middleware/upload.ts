import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create subdirectories based on file type
    let subDir = 'general';
    
    if (file.fieldname === 'material') {
      subDir = 'materials';
    } else if (file.fieldname === 'submission') {
      subDir = 'submissions';
    } else if (file.fieldname === 'avatar') {
      subDir = 'avatars';
    }
    
    const fullPath = path.join(uploadDir, subDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    
    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  }
});

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types
  const allowedTypes = {
    'material': ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.zip', '.rar'],
    'submission': ['.pdf', '.doc', '.docx', '.zip', '.rar', '.txt', '.py', '.js', '.java', '.cpp'],
    'avatar': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  };

  const fieldName = file.fieldname as keyof typeof allowedTypes;
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes[fieldName] && allowedTypes[fieldName].includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${fieldName}. Allowed: ${allowedTypes[fieldName]?.join(', ')}`));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
    files: 5, // Maximum 5 files per request
  }
});

// Export different upload configurations
export const uploadMaterial = upload.single('material');
export const uploadSubmission = upload.single('submission');
export const uploadAvatar = upload.single('avatar');
export const uploadMultiple = upload.array('files', 5);

// Error handler for multer errors
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum allowed size is 10MB.'
      });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum allowed is 5 files.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next(error);
};