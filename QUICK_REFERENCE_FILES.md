# Image Handling - Quick Reference

## What Changed?

The image and file upload system has been completely overhauled with proper format validation, security, and error handling.

## Key Features

✅ **Format Validation** - Only accepted MIME types can be uploaded
✅ **Size Limits** - Images (5MB), Documents (10MB), Avatars (2MB)
✅ **Organized Storage** - Files sorted by type into subdirectories
✅ **Error Handling** - Clear, user-friendly error messages
✅ **Security** - Secure filenames, no directory traversal possible
✅ **Client-Side Validation** - Files checked before upload
✅ **Caching** - Uploaded files cached for 7 days

## File Locations

```
uploads/
├── images/      # Images from tickets/replies
├── documents/   # PDFs, Word, Excel files
└── avatars/     # User profile pictures
```

## Supported File Types

| Type | Formats | Limit |
|------|---------|-------|
| Images | JPG, PNG, GIF, WebP, BMP, SVG | 5 MB |
| Documents | PDF, Word, Excel, TXT | 10 MB |
| Avatars | JPG, PNG, GIF, WebP, BMP | 2 MB |

## Error Examples

```
❌ File too large (11MB image)
→ "File too large. Maximum file size is 10MB"

❌ Invalid file type (.exe)
→ "Invalid file type: application/x-msdownload. 
   Allowed types: images, documents"

❌ Too many files (6 files)
→ "Maximum 5 files allowed. Extra files were not added."

❌ Avatar must be image
→ "Avatar must be an image file"
```

## API Response Codes

| Code | HTTP | Meaning |
|------|------|---------|
| LIMIT_FILE_SIZE | 413 | File exceeds size limit |
| LIMIT_FILE_COUNT | 400 | Too many files (max 5) |
| INVALID_FILE_TYPE | 400 | Unsupported file type |
| INVALID_AVATAR_TYPE | 400 | Avatar must be image |

## For Developers

### Using FileUtils

```typescript
import { 
  isValidImage, 
  validateFileForUpload, 
  formatFileSize 
} from '@/utils/fileUtils';

// Check if file is valid
const validation = validateFileForUpload(file);
if (!validation.valid) {
  console.error(validation.error);
}

// Format size for display
const size = formatFileSize(file.size); // "2.5 MB"
```

### Handling Upload Errors

```typescript
try {
  const formData = new FormData();
  formData.append('file', selectedFile);
  await api.post('/api/tickets/1/replies', formData);
} catch (error) {
  // Error already caught by multer and formatted
  const message = error.response?.data?.message;
  toast.error(message); // User-friendly message
}
```

## Configuration

Environment variables in `.env`:

```env
# File size limits (in bytes)
MAX_FILE_SIZE=10485760          # 10MB
MAX_IMAGE_SIZE=5242880          # 5MB
MAX_AVATAR_SIZE=2097152         # 2MB

# For cloud storage migration (optional)
UPLOAD_STORAGE=local            # or "s3", "cloudinary", "firebase"
```

## Troubleshooting

**Files not saving?**
- Check `uploads/` directory exists
- Verify write permissions: `chmod 755 uploads/`
- Check available disk space

**Slow uploads?**
- Images are larger than needed
- Network speed issue
- Consider implementing image compression

**CORS errors?**
- Verify `Access-Control-Allow-Origin` header
- Check browser console for specific error
- Test with postman if needed

## Migration to Cloud

When ready for production, migrate uploads to:
- **AWS S3** - Best for scalability
- **Cloudinary** - Best for image optimization
- **Firebase Storage** - Best for serverless

See `IMAGE_HANDLING_GUIDE.md` for detailed migration steps.

## Testing Checklist

- [ ] Upload valid image → Stored in `/uploads/images/`
- [ ] Upload valid document → Stored in `/uploads/documents/`
- [ ] Try invalid file type → Error shown
- [ ] Try oversized file → Error shown
- [ ] Upload 5 files → Success
- [ ] Try 6th file → Error shown
- [ ] View attachments in ticket → Proper display
- [ ] Download attachment → File downloads correctly
