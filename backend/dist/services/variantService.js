"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantService = void 0;
const prisma_1 = require("../lib/prisma");
const helper_1 = require("../lib/helper");
class VariantService {
    static async getByProductId(productId) {
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new Error('Produk tidak ditemukan');
        }
        const variants = await prisma_1.prisma.productVariant.findMany({
            where: { productId },
            orderBy: { id: 'asc' },
        });
        return variants;
    }
    static async create(productId, data) {
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new Error('Produk tidak ditemukan');
        }
        const variant = await prisma_1.prisma.productVariant.create({
            data: {
                productId,
                color: data.color,
                imageUrl: data.imageUrl,
                price: data.price,
            },
        });
        return variant;
    }
    static async update(id, data) {
        const variant = await prisma_1.prisma.productVariant.findUnique({
            where: { id },
        });
        if (!variant) {
            throw new Error('Varian tidak ditemukan');
        }
        if (variant.imageUrl && data.imageUrl && variant.imageUrl !== data.imageUrl) {
            helper_1.FileHelper.deleteFile(variant.imageUrl);
        }
        const updatedVariant = await prisma_1.prisma.productVariant.update({
            where: { id },
            data,
        });
        return updatedVariant;
    }
    static async delete(id) {
        const variant = await prisma_1.prisma.productVariant.findUnique({
            where: { id },
        });
        if (!variant) {
            throw new Error('Varian tidak ditemukan');
        }
        if (variant.imageUrl) {
            helper_1.FileHelper.deleteFile(variant.imageUrl);
        }
        await prisma_1.prisma.productVariant.delete({
            where: { id },
        });
    }
}
exports.VariantService = VariantService;
