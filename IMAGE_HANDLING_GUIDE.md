# Image Format Handling & File Upload Implementation Guide

## Overview

This document outlines the improved image and file format handling system implemented for the MERN Ticket Management application.

## What Was Fixed

### 1. **Backend Upload Middleware** (`backend/src/middleware/upload.ts`)
- ✅ Added MIME type validation (images, documents)
- ✅ Implemented file type categorization (images, documents)
- ✅ Added file size limits:
  - Images: 5MB max
  - Documents: 10MB max
  - Avatars: 2MB max
- ✅ Secure filename generation (prevents directory traversal)
- ✅ Organized uploads into subdirectories (images/, documents/, avatars/)

### 2. **Supported File Types**

**Images:**
- JPEG/JPG
- PNG
- GIF
- WebP
- BMP
- SVG

**Documents:**
- PDF
- Microsoft Word (.doc, .docx)
- Microsoft Excel (.xls, .xlsx)
- Plain Text (.txt)

### 3. **Error Handling** (`backend/src/middleware/upload-error.ts`)
- ✅ Dedicated error handler for multer upload errors
- ✅ User-friendly error messages
- ✅ Proper HTTP status codes
- ✅ File type validation errors caught early

### 4. **Static File Serving** (`backend/src/app.ts`)
- ✅ Improved caching headers (7 days for uploaded files)
- ✅ Security headers for SVG files (prevents XSS)
- ✅ Proper content-type handling for different file types

### 5. **Frontend File Utilities** (`frontend/src/utils/fileUtils.ts`)
- ✅ File type validation functions
- ✅ File size checking
- ✅ Human-readable file size formatting
- ✅ Image preview creation
- ✅ File icon helpers

### 6. **Frontend Validation**
- ✅ Client-side file validation before upload
- ✅ File count limit enforcement (max 5 files)
- ✅ Real-time error messages with toast notifications
- ✅ Better file input UI with accepted types display

## Directory Structure

```
uploads/
├── images/        # User-uploaded images
├── documents/     # User-uploaded documents
└── avatars/       # User profile avatars
```

## File Size Limits

| File Type | Limit | Use Case |
|-----------|-------|----------|
| Images | 5 MB | Ticket attachments, screenshots |
| Documents | 10 MB | PDF reports, Excel sheets |
| Avatars | 2 MB | User profile pictures |

## API Changes

### Upload Error Responses

The API now returns structured error responses for file uploads:

```json
{
  "success": false,
  "message": "File too large. Maximum file size is 10MB",
  "error": "LIMIT_FILE_SIZE"
}
```

Error codes:
- `LIMIT_FILE_SIZE`: File exceeds size limit
- `LIMIT_FILE_COUNT`: Too many files (max 5)
- `INVALID_FILE_TYPE`: Unsupported file type
- `INVALID_AVATAR_TYPE`: Avatar must be an image

## Migration to Cloud Storage

For production deployment, consider migrating to cloud storage solutions:

### Option 1: AWS S3

```bash
npm install aws-sdk
```

Update `upload.ts` to use S3:

```typescript
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `uploads/${timestamp}-${file.originalname}`);
  }
});
```

### Option 2: Cloudinary

```bash
npm install cloudinary multer-storage-cloudinary
```

### Option 3: Firebase Storage

```bash
npm install firebase-admin
```

## Security Best Practices

1. **Always validate file types** - Both MIME type and extension
2. **Implement file size limits** - Prevent DOS attacks
3. **Use secure filenames** - Current implementation uses crypto for random suffixes
4. **Store files outside web root** - Optional for production
5. **Set proper CORS headers** - Already configured in app.ts
6. **Scan for malware** - Consider adding ClamAV for production
7. **Implement rate limiting** - Already present in app.ts (200 requests per 15 min)

## Environment Variables

Add these to `.env`:

```
# Upload Configuration
MAX_FILE_SIZE=10485760          # 10MB in bytes
MAX_IMAGE_SIZE=5242880          # 5MB in bytes
MAX_AVATAR_SIZE=2097152         # 2MB in bytes
UPLOAD_DIR=./uploads

# For Cloud Storage (optional)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# S3_BUCKET_NAME=
# Or
# CLOUDINARY_NAME=
# CLOUDINARY_KEY=
# CLOUDINARY_SECRET=
```

## Usage Examples

### Frontend - Upload Files

```typescript
import { validateFileForUpload, formatFileSize } from '../utils/fileUtils';

const handleFileSelect = (files: File[]) => {
  for (const file of files) {
    const validation = validateFileForUpload(file);
    if (!validation.valid) {
      toast.error(`${file.name}: ${validation.error}`);
      continue;
    }
    // File is valid, proceed with upload
  }
};
```

### Backend - Handle Uploads

```typescript
import { upload } from '../middleware/upload';
import { handleUploadError } from '../middleware/upload-error';

router.post('/upload', (req, res, next) => {
  upload.array('files', 5)(req, res, (err) => {
    if (err) return handleUploadError(err, req, res, next);
    // Process files in req.files
  });
});
```

## Testing

### Test Valid Image Upload
- ✅ Upload JPEG/PNG/GIF/WebP image
- ✅ Verify stored in `/uploads/images/`
- ✅ Verify correct MIME type recorded

### Test Valid Document Upload
- ✅ Upload PDF/Word/Excel document
- ✅ Verify stored in `/uploads/documents/`
- ✅ Verify correct MIME type recorded

### Test File Validation Errors
- ✅ Try uploading invalid file type → Should be rejected
- ✅ Try uploading file > size limit → Should be rejected
- ✅ Try uploading > 5 files → Should stop at 5
- ✅ Try uploading invalid image as avatar → Should be rejected

### Test Error Messages
- ✅ Client receives proper error toast notifications
- ✅ Server returns structured error responses
- ✅ Error messages are user-friendly

## Cleanup & Maintenance

### Remove Old Uploads

```bash
# Find and delete uploads older than 30 days
find uploads/ -type f -mtime +30 -delete

# Or setup a cron job (Linux/Mac)
0 0 * * * find /path/to/uploads -type f -mtime +30 -delete
```

### Monitor Disk Usage

```bash
# Check upload directory size
du -sh uploads/

# Monitor for large files
find uploads/ -type f -size +10M
```

## Troubleshooting

### Files Not Saving
- Check `uploads/` directory permissions: `chmod 755 uploads/`
- Verify disk space available: `df -h`
- Check server logs for multer errors

### Slow Upload Performance
- Consider compression for images
- Implement chunked uploads for large files
- Move to CDN/cloud storage

### CORS Issues
- Verify CORS configuration in app.ts
- Check `Access-Control-Allow-Origin` header
- Test with browser developer tools

## Future Enhancements

1. **Image Optimization**
   - Auto-resize images to reduce storage
   - Generate thumbnails for previews
   - Convert to WebP for better compression

2. **Virus Scanning**
   - Integrate ClamAV for malware detection
   - Quarantine suspicious files

3. **Advanced Analytics**
   - Track upload patterns
   - Monitor storage usage
   - Alert on unusual activity

4. **Backup & Disaster Recovery**
   - Regular automated backups
   - Sync to secondary storage
   - Recovery procedures

## Support & Documentation

For issues or questions:
1. Check the middleware error logs
2. Verify file upload permissions
3. Test with supported file types
4. Contact development team with error codes
