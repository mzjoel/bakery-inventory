const { PrismaClient } = require('@prisma/client');    
const prisma = new PrismaClient();    
  
const generateUniqueBatchNumber = () => {    
    const prefix = 'dev';     
    const timestamp = Date.now();    
    const uniqueId = `${prefix}${timestamp}`;  
    return uniqueId;    
};    
  
const resolvers = {    
    // Queries    
    productions: async () => {    
        return await prisma.production.findMany({    
            include: { details: true },    
        });    
    },    
    production: async ({ id }) => {    
        return await prisma.production.findUnique({    
            where: { id: id },    
            include: { details: true },    
        });    
    },    
  
    // Mutations    
    requestProduction: async ({ input }) => {    
        const { productId, productName, requestedQuantity, requestedBy } = input;    
        try {    
            const production = await prisma.production.create({    
                data: {    
                    batchNumber: generateUniqueBatchNumber(),    
                    productId,    
                    productName,    
                    requestedQuantity,    
                    requestedBy,    
                    status: 'MATERIAL_CHECK',    
                }    
            });    
            return production;    
        } catch (error) {    
            throw new Error("Internal server error");    
        }    
    },    
  
    processProduction: async ({ batchNumber, startTime, materials }) => {    
        try {    
            const production = await prisma.production.findUnique({    
                where: { batchNumber },    
                include: { details: true },    
            });    
    
            if (!production) {    
                throw new Error('Produksi tidak ditemukan');    
            }    
    
            const updatedProduction = await prisma.production.update({    
                where: { batchNumber },    
                data: {    
                    status: 'IN_PROGRESS',    
                    startTime: new Date(startTime),    
                },    
            });    
    
            const productionDetails = materials.map(material => ({    
                productionId: updatedProduction.id,    
                materialId: material.materialId,    
                materialName: material.materialName,    
                requiredQuantity: material.requiredQuantity,    
                unit: material.unit,    
            }));    
    
            await prisma.productionDetail.createMany({    
                data: productionDetails,    
            });    
    
            return await prisma.production.findUnique({    
                where: { batchNumber },    
                include: { details: true },    
            });    
        } catch (error) {    
            throw new Error('Terjadi kesalahan saat memproses produksi');    
        }    
    },    
  
    completeProduction: async ({ batchNumber }) => {    
        try {    
            const production = await prisma.production.findUnique({    
                where: { batchNumber },    
                include: { details: true },    
            });    
    
            if (!production) {    
                throw new Error('Produksi tidak ditemukan');    
            }    
    
            const updatedProduction = await prisma.production.update({    
                where: { batchNumber },    
                data: {    
                    status: 'COMPLETED',    
                    endTime: new Date(),    
                },    
            });    
    
            return await prisma.production.findUnique({    
                where: { batchNumber },    
                include: { details: true },    
            });    
        } catch (error) {    
            throw new Error('Terjadi kesalahan saat menyelesaikan produksi');    
        }    
    },    
  
    getAllProductions: async ({ status, batchNumber }) => {    
        try {    
            const whereClause = {    
                ...(status && { status }),     
                ...(batchNumber && { batchNumber }),    
            };    
    
            return await prisma.production.findMany({    
                where: whereClause,    
                include: { details: true },    
            });    
        } catch (error) {    
            throw new Error('Terjadi kesalahan saat mengambil data produksi');    
        }    
    },    
};    
  
module.exports = resolvers;   