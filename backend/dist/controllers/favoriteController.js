"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteController = void 0;
const favoriteService_1 = require("../services/favoriteService");
class FavoriteController {
    static async getUserFavorites(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Tidak terautentikasi' });
            }
            const favorites = await favoriteService_1.FavoriteService.getUserFavorites(req.user.id);
            res.status(200).json({
                message: 'Berhasil mengambil data favorit',
                data: favorites,
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async addFavorite(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Tidak terautentikasi' });
            }
            const productId = Number(req.body.productId);
            if (!Number.isInteger(productId)) {
                return res.status(400).json({ message: 'Product ID tidak valid' });
            }
            const favorite = await favoriteService_1.FavoriteService.addFavorite(req.user.id, productId);
            return res.status(200).json({
                message: 'OK',
                data: favorite,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async removeFavorite(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Tidak terautentikasi' });
            }
            const productId = parseInt(req.params.productId);
            if (isNaN(productId)) {
                return res.status(400).json({ message: 'Product ID tidak valid' });
            }
            await favoriteService_1.FavoriteService.removeFavorite(req.user.id, productId);
            res.status(200).json({ message: 'Produk berhasil dihapus dari favorit' });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.FavoriteController = FavoriteController;
