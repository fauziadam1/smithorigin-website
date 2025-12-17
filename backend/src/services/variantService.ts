import { prisma } from '../lib/prisma'
import { FileHelper } from '../lib/helper'

export class VariantService {
  static async getByProductId(productId: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new Error('Produk tidak ditemukan')
    }

    const variants = await prisma.productVariant.findMany({
      where: { productId },
      orderBy: { id: 'asc' },
    })

    return variants
  }

  static async create(
    productId: number,
    data: {
      color: string
      imageUrl: string
      price?: number
    }
  ) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new Error('Produk tidak ditemukan')
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        color: data.color,
        imageUrl: data.imageUrl,
        price: data.price,
      },
    })

    return variant
  }

  static async update(
    id: number,
    data: {
      color?: string
      imageUrl?: string
      price?: number
    }
  ) {
    const variant = await prisma.productVariant.findUnique({
      where: { id },
    })

    if (!variant) {
      throw new Error('Varian tidak ditemukan')
    }

    if (variant.imageUrl && data.imageUrl && variant.imageUrl !== data.imageUrl) {
      FileHelper.deleteFile(variant.imageUrl)
    }

    const updatedVariant = await prisma.productVariant.update({
      where: { id },
      data,
    })

    return updatedVariant
  }

  static async delete(id: number) {
    const variant = await prisma.productVariant.findUnique({
      where: { id },
    })

    if (!variant) {
      throw new Error('Varian tidak ditemukan')
    }

    if (variant.imageUrl) {
      FileHelper.deleteFile(variant.imageUrl)
    }

    await prisma.productVariant.delete({
      where: { id },
    })
  }
}