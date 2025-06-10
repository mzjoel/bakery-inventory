const { PrismaClient } = require('@prisma/client');    
const prisma = new PrismaClient();    
  
const resolvers = {    
    // Queries    
    materials: async () => {    
        return await prisma.material.findMany({    
            include: {    
                category: true,    
                materialDetails: true,    
            },    
        });    
    },    
    material: async ({ id }) => {    
        return await prisma.material.findUnique({    
            where: { id: id },    
            include: {    
                category: true,    
                materialDetails: true,    
            },    
        });    
    },    
    materialLogs: async ({ status }) => {    
        return await prisma.materialLog.findMany({    
            where: status ? { status: status } : {},    
            orderBy: {    
                createdAt: 'desc',    
            },    
        });    
    },    
  
    // Mutations    
    createMaterial: async ({ input }) => {    
        const { name, description, categoryId, details } = input;    
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
    updateMaterial: async ({ id, input }) => {    
        const { name, description, categoryId, details, quantity } = input;    
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
        const material = await prisma.material.findUnique({    
            where: { id: materialId },    
            include: {    
                materialDetails: true,    
            },    
        });    
    
        if (!material) {    
            throw new Error("Material not found");    
        }    
    
        const totalStock = material.materialDetails.reduce((total, detail) => {    
            return total + detail.quantity;    
        }, 0);    
    
        if (requestedQuantity > totalStock) {    
            throw new Error("Requested quantity exceeds available stock");    
        }    
    
        let remainingQuantity = requestedQuantity;    
    
        for (const detail of material.materialDetails) {    
            if (remainingQuantity <= 0) break;    
    
            if (detail.quantity >= remainingQuantity) {    
                await prisma.materialDetail.update({    
                    where: { id: detail.id },    
                    data: { quantity: detail.quantity - remainingQuantity },    
                });    
                remainingQuantity = 0;    
            } else {    
                remainingQuantity -= detail.quantity;    
                await prisma.materialDetail.update({    
                    where: { id: detail.id },    
                    data: { quantity: 0 },    
                });    
            }    
        }    
    
        await prisma.materialLog.create({    
            data: {    
                material_id: materialId,    
                quantity: requestedQuantity,    
                message: "Request Bahan Baku Berhasil",    
                status: "Accepted",    
            },    
        });    
    
        return {    
            MaterialId: material.id,    
            MaterialName: material.name,    
            StokRequest: requestedQuantity,    
            Message: "Request Produk Berhasil",    
        };    
    },    
};    
  
module.exports = resolvers;