"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHelper = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileHelper {
    /**
     * Hapus file dari public folder
     * @param imageUrl - URL gambar (contoh: /uploads/image.jpg)
     */
    static deleteFile(imageUrl) {
        if (!imageUrl)
            return;
        try {
            const relativePath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
            const filePath = path_1.default.join(process.cwd(), 'public', relativePath);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
                console.log(`File deleted: ${filePath}`);
            }
            else {
                console.log(`File not found: ${filePath}`);
            }
        }
        catch (error) {
            console.error('Error deleting file:', error);
        }
    }
    /**
     * Hapus multiple files
     * @param imageUrls - Array of image URLs
     */
    static deleteFiles(imageUrls) {
        imageUrls.forEach(url => this.deleteFile(url));
    }
}
exports.FileHelper = FileHelper;
