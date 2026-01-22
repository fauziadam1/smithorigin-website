"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const productService_1 = require("../services/productService");
class ProductController {
    static async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const categoryId = req.query.categoryId
                ? parseInt(req.query.categoryId)
                : undefined;
            const search = req.query.search;
            const result = await productService_1.ProductService.getAll(page, limit, categoryId, search);
            res.status(200).json({
                message: 'Berhasil mengambil data produk',
                data: result.products,
                pagination: result.pagination,
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
            const product = await productService_1.ProductService.getById(id);
            res.status(200).json({
                message: 'Berhasil mengambil data produk',
                data: product,
            });
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    static async create(req, res) {
        try {
            const { name, description, price, discount, imageUrl, categoryId, isBestSeller, tokopediaUrl, shopeeUrl, } = req.body;
            if (!name || !price) {
                return res
                    .status(400)
                    .json({ message: 'Nama dan harga produk harus diisi' });
            }
            const product = await productService_1.ProductService.create({
                name,
                description,
                price: parseFloat(price),
                discount: discount ? parseFloat(discount) : undefined,
                imageUrl,
                categoryId: categoryId ? parseInt(categoryId) : undefined,
                isBestSeller: Boolean(isBestSeller),
                tokopediaUrl,
                shopeeUrl,
            });
            res.status(201).json({
                message: 'Produk berhasil dibuat',
                data: product,
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
            const { name, description, price, discount, imageUrl, categoryId, isBestSeller, tokopediaUrl, shopeeUrl, } = req.body;
            const product = await productService_1.ProductService.update(id, {
                name,
                description,
                price: price ? parseFloat(price) : undefined,
                discount: discount ? parseFloat(discount) : undefined,
                imageUrl,
                categoryId: categoryId ? parseInt(categoryId) : undefined,
                isBestSeller: Boolean(isBestSeller),
                tokopediaUrl,
                shopeeUrl,
            });
            res.status(200).json({
                message: 'Produk berhasil diupdate',
                data: product,
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
            await productService_1.ProductService.delete(id);
            res.status(200).json({ message: 'Produk berhasil dihapus' });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.ProductController = ProductController;
