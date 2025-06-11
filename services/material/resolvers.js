const { PrismaClient } = require('@prisma/client');    
const prisma = new PrismaClient();    
  
const resolvers = {    
    // Queries    
    findCategories: async () => {    
        return await prisma.category.findMany();    
    },    
    findCategoryById: async ({ id }) => {    
        return await prisma.category.findUnique({    
            where: { id: id },    
            include: { materials: true },    
        });    
    },    
    findMaterials: async () => {    
        return await prisma.material.findMany({    
            include: {    
                category: true,    
                materialDetails: true,    
            },    
        });    
    },    
    findMaterialById: async ({ id }) => {    
        return await prisma.material.findUnique({    
            where: { id: id },    
            include: {    
                category: true,    
                materialDetails: true,    
            },    
        });    
    },    
    getMaterialLogs: async ({ status }) => {    
        return await prisma.materialLog.findMany({    
            where: status ? { status: status } : {},    
            orderBy: {    
                createdAt: 'desc',    
            },    
        });    
    },    
  
    // Mutations    
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
    createMaterial: async ({ name, description, categoryId, details }) => {    
        return await prisma.material.create({    
            data: {    
                name,    
                description,    
                category: { connect: { id: categoryId } },    
                materialDetails: {    
                    create: details.map(detail => ({    
                        batchNumber: detail.batchNumber,    
                        quantity: detail.quantity,    
                        expiredAt: detail.expiredAt ? new Date(detail.expiredAt) : null,    
                    })),    
                },    
            },    
            include: {    
                category: true,    
                materialDetails: true,    
            },    
        });    
    },    
    updateMaterial: async ({ id, name, description, categoryId, details }) => {    
        const material = await prisma.material.findUnique({ where: { id: id } });    
  
        if (!material) {    
            throw new Error("Material not found");    
        }    
  
        const updateData = {};    
        if (name) updateData.name = name;    
        if (description) updateData.description = description;    
        if (categoryId) updateData.categoryId = categoryId;    
  
        const updatedMaterial = await prisma.material.update({    
            where: { id: id },    
            data: updateData,    
            include: {    
                category: true,    
                materialDetails: true,    
            },    
        });    
  
        if (details) {    
            await prisma.materialDetail.deleteMany({ where: { materialId: id } });    
            await prisma.materialDetail.createMany({    
                data: details.map(detail => ({    
                    batchNumber: detail.batchNumber,    
                    quantity: detail.quantity,    
                    expiredAt: detail.expiredAt ? new Date(detail.expiredAt) : null,    
                    materialId: id,    
                })),    
            });    
        }    
  
        return updatedMaterial;    
    },    
    deleteMaterial: async ({ id }) => {    
        await prisma.material.delete({ where: { id: id } });    
        return "Material deleted successfully";    
    },    
    requestStock: async ({ materialId, requestedQuantity }) => {    
        // Implementation of stock request logic here    
        return "Stock request processed";    
    },    
};    
  
module.exports = resolvers;  