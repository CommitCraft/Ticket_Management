/**
 * File handling utilities for image and document validation
 */

export const FILE_TYPES = {
  images: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'],
    label: 'Images'
  },
  documents: {
    mimeTypes: ['application/pdf', 'text/plain', 'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    extensions: ['.pdf', '.txt', '.doc', '.docx', '.xls', '.xlsx'],
    label: 'Documents'
  }
};

export const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024,        // 5MB
  document: 10 * 1024 * 1024,    // 10MB
  avatar: 2 * 1024 * 1024,       // 2MB
};

/**
 * Check if a file is a valid image
 */
export const isValidImage = (file: File): boolean => {
  return FILE_TYPES.images.mimeTypes.includes(file.type) ||
         FILE_TYPES.images.extensions.some(ext => file.name.toLowerCase().endsWith(ext));
};

/**
 * Check if a file is a valid document
 */
export const isValidDocument = (file: File): boolean => {
  return FILE_TYPES.documents.mimeTypes.includes(file.type) ||
         FILE_TYPES.documents.extensions.some(ext => file.name.toLowerCase().endsWith(ext));
};

/**
 * Get file type category
 */
export const getFileTypeCategory = (file: File): 'image' | 'document' | 'unknown' => {
  if (isValidImage(file)) return 'image';
  if (isValidDocument(file)) return 'document';
  return 'unknown';
};

/**
 * Validate file size
 */
export const validateFileSize = (file: File, maxSize: number = FILE_SIZE_LIMITS.document): boolean => {
  return file.size <= maxSize;
};

/**
 * Get human readable file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file for upload (all checks)
 */
export const validateFileForUpload = (file: File, isAvatar: boolean = false): { valid: boolean; error?: string } => {
  // Check file type
  if (!isValidImage(file) && !isValidDocument(file)) {
    return {
      valid: false,
      error: `File type not supported. Allowed: Images (${FILE_TYPES.images.extensions.join(', ')}), Documents (${FILE_TYPES.documents.extensions.join(', ')})`
    };
  }

  // Check size
  const maxSize = isAvatar ? FILE_SIZE_LIMITS.avatar : 
                  isValidImage(file) ? FILE_SIZE_LIMITS.image : 
                  FILE_SIZE_LIMITS.document;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Max size: ${formatFileSize(maxSize)}, Actual: ${formatFileSize(file.size)}`
    };
  }

  if (isAvatar && !isValidImage(file)) {
    return {
      valid: false,
      error: 'Avatar must be an image file'
    };
  }

  return { valid: true };
};

/**
 * Create thumbnail preview for image files
 */
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Get file icon based on type
 */
export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('text')) return '📋';
  return '📎';
};
