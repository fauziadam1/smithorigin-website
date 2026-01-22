"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantController = void 0;
const variantService_1 = require("../services/variantService");
class VariantController {
    static async getByProductId(req, res) {
        try {
            const productId = parseInt(req.params.productId);
            if (isNaN(productId)) {
                return res.status(400).json({ message: 'Product ID tidak valid' });
            }
            const variants = await variantService_1.VariantService.getByProductId(productId);
            res.status(200).json({
                message: 'Berhasil mengambil data varian',
                data: variants,
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async create(req, res) {
        try {
            const productId = parseInt(req.params.productId);
            if (isNaN(productId)) {
                return res.status(400).json({ message: 'Product ID tidak valid' });
            }
            const { color, imageUrl, price } = req.body;
            if (!color || !imageUrl) {
                return res.status(400).json({ message: 'Color dan imageUrl harus diisi' });
            }
            const variant = await variantService_1.VariantService.create(productId, {
                color,
                imageUrl,
                price: price ? parseFloat(price) : undefined,
            });
            res.status(201).json({
                message: 'Varian berhasil dibuat',
                data: variant,
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID tidak valid' });
            }
            const { color, imageUrl, price } = req.body;
            const variant = await variantService_1.VariantService.update(id, {
                color,
                imageUrl,
                price: price ? parseFloat(price) : undefined,
            });
            res.status(200).json({
                message: 'Varian berhasil diupdate',
                data: variant,
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID tidak valid' });
            }
            await variantService_1.VariantService.delete(id);
            res.status(200).json({ message: 'Varian berhasil dihapus' });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.VariantController = VariantController;
