const { PrismaClient } = require('@prisma/client');  
const prisma = new PrismaClient();  

const resolvers = {  
    // Queries  
    products: async () => {  
        return await prisma.product.findMany({  
            include: {  
                category: true,  
                productDetails: true,  
            },  
        });  
    },  
    product: async ({ id }) => {  
        return await prisma.product.findUnique({  
            where: { id: id },  
            include: {  
                category: true,  
                productDetails: true,  
            },  
        });  
    },  
    categories: async () => {  
        return await prisma.category.findMany();  
    },  
    category: async ({ id }) => {  
        return await prisma.category.findUnique({  
            where: { id: id },  
            include: {  
                products: true,  
            },  
        });  
    },  
    productLogs: async ({ status }) => {  
        return await prisma.productLog.findMany({  
            where: status ? { status: status } : {},  
            orderBy: {  
                createdAt: 'desc',  
            },  
        });  
    },  
  
    // Mutations  
    createProduct: async ({ input }) => {  
        const { name, description, categoryId, details } = input;  
        return await prisma.product.create({  
            data: {  
                name,  
                description,  
                category: { connect: { id: categoryId } },  
                productDetails: {  
                    create: details.map(detail => ({  
                        batchNumber: detail.batchNumber,  
                        quantity: detail.quantity,  
                        expiredAt: detail.expiredAt ? new Date(detail.expiredAt) : null,  
                    })),  
                },  
            },  
            include: {  
                category: true,  
                productDetails: true,  
            },  
        });  
    },  
    updateProduct: async ({ id, input }) => {  
        const { name, description, categoryId, details } = input;  
        const product = await prisma.product.findUnique({ where: { id: id } });  
  
        if (!product) {  
            throw new Error("Product not found");  
        }  
  
        const updateData = {};  
        if (name) updateData.name = name;  
        if (description) updateData.description = description;  
        if (categoryId) updateData.categoryId = categoryId;  
  
        const updatedProduct = await prisma.product.update({  
            where: { id: id },  
            data: updateData,  
            include: {  
                category: true,  
                productDetails: true,  
            },  
        });  
  
        if (details) {  
            await prisma.productDetail.deleteMany({ where: { productId: id } });  
            await prisma.productDetail.createMany({  
                data: details.map(detail => ({  
                    batchNumber: detail.batchNumber,  
                    quantity: detail.quantity,  
                    expiredAt: detail.expiredAt ? new Date(detail.expiredAt) : null,  
                    productId: id,  
                })),  
            });  
        }  
  
        return updatedProduct;  
    },  
    deleteProduct: async ({ id }) => {  
        await prisma.product.delete({ where: { id: id } });  
        return "Product deleted successfully";  
    },  
    createCategory: async ({ name, description }) => {  
        return await prisma.category.create({  
            data: {  
                name,  
                description,  
            },  
        });  
    },  
    updateCategory: async ({ id, name, description }) => {  
        return await prisma.category.update({  
            where: { id: id },  
            data: {  
                name,  
                description,  
            },  
        });  
    },  
    deleteCategory: async ({ id }) => {  
        await prisma.category.delete({ where: { id: id } });  
        return "Category deleted successfully";  
    },  
};  
  

module.exports = resolvers;  