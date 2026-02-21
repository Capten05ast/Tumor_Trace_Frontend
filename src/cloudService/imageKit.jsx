

// ATTENTION PLEASE !!!!!!
// NOT IN USE ANYMORE - REPLACED BY BACKEND IMAGEKIT UPLOAD SERVICE


// cloudService/imageKit.js - Simple frontend version
// ⚠️ WARNING: This exposes your private key in the frontend
// Only use for development/testing. Use Option 1 for production.

import ImageKit from 'imagekit-javascript';

// Initialize ImageKit (client-side)
const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload file to ImageKit from browser
 * @param {File} file - The file object from input
 * @returns {Promise<Object>} Upload response with URL
 */
async function uploadFile(file) {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    console.log("📤 Starting ImageKit upload...");

    // For client-side upload, we need authentication parameters
    // In production, get these from your backend
    // For now, we'll use a workaround with public upload
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', `${Date.now()}_${file.name}`);
    formData.append('folder', '/Bone-Tumor-Database');
    formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
    
    // Upload using fetch to ImageKit API
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY + ':')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    const result = await response.json();
    
    console.log("✅ ImageKit upload successful:", result.url);
    
    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      size: result.size,
      filePath: result.filePath,
      thumbnailUrl: result.thumbnailUrl,
      width: result.width,
      height: result.height
    };

  } catch (error) {
    console.error("❌ ImageKit upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

export default uploadFile;




