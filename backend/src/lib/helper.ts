import fs from 'fs';
import path from 'path';

export class FileHelper {
  /**
   * Hapus file dari public folder
   * @param imageUrl - URL gambar (contoh: /uploads/image.jpg)
   */
  static deleteFile(imageUrl: string | null | undefined): void {
    if (!imageUrl) return;

    try {
      const relativePath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
      
      const filePath = path.join(process.cwd(), 'public', relativePath);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`File deleted: ${filePath}`);
      } else {
        console.log(`File not found: ${filePath}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  /**
   * Hapus multiple files
   * @param imageUrls - Array of image URLs
   */
  static deleteFiles(imageUrls: (string | null | undefined)[]): void {
    imageUrls.forEach(url => this.deleteFile(url));
  }
}