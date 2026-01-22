"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const categoryService_1 = require("../services/categoryService");
class CategoryController {
    static async getAll(req, res) {
        try {
            const categories = await categoryService_1.CategoryService.getAll();
            res.status(200).json({
                message: 'Berhasil mengambil data kategori',
                data: categories,
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID tidak valid' });
            }
            const category = await categoryService_1.CategoryService.getById(id);
            res.status(200).json({
                message: 'Berhasil mengambil data kategori',
                data: category,
            });
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    static async create(req, res) {
        try {
            const { name, imageUrl } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'Nama kategori harus diisi' });
            }
            const category = await categoryService_1.CategoryService.create(name, imageUrl);
            res.status(201).json({
                message: 'Kategori berhasil dibuat',
                data: category,
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { name, imageUrl } = req.body;
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID tidak valid' });
            }
            if (!name) {
                return res.status(400).json({ message: 'Nama kategori harus diisi' });
            }
            const category = await categoryService_1.CategoryService.update(id, name, imageUrl);
            res.status(200).json({
                message: 'Kategori berhasil diupdate',
                data: category,
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
            await categoryService_1.CategoryService.delete(id);
            res.status(200).json({
                message: 'Kategori berhasil dihapus',
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.CategoryController = CategoryController;
