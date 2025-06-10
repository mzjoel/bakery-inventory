const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();


const { validationResult } = require("express-validator");


const findMaterials = async (req, res) => {  
    try {    
        const materials = await prisma.material.findMany({  
            include: {  
                category: true,   
                materialDetails: true,  
            },  
        });  
  
        res.status(200).send({  
            success: true,  
            message: "Get All Material Successfully",  
            data: materials,  
        });  
  
    } catch (error) {  
        console.error(error); // Log error untuk debugging  
        res.status(500).send({  
            success: false,  
            message: "Internal server error",  
        });  
    }  
};  

/**
 * Create a new product with product details
 * @param {Object} input
 * @param {string} input.name
 * @param {string} input.description
 * @param {string} input.categoryId
 * @param {Array<{
 *   batchNumber: string,
 *   quantity: number,
 *   expiredAt: string
 * }>} input.details
 */


const createMaterial = async (req, res) => {  
    const { name, description, categoryId, details } = req.body;  

    if (!Array.isArray(details)) {  
        return res.status(400).send({  
            success: false,  
            message: "Details must be an array.",  
        });  
    }  
  
    try {  
        const material = await prisma.material.create({  
            data: {  
                name,  
                description,  
                category: {  
                    connect: { id: categoryId }  
                },  
                materialDetails: {  
                    create: details.map(detail => ({  
                        batchNumber: detail.batchNumber,  
                        quantity: detail.quantity,  
                        expiredAt: detail.expiredAt ? new Date(detail.expiredAt) : null  
                    }))  
                }  
            },  
            include: {  
                category: true,  
                materialDetails: true,  
            }  
        });  
  
        res.status(201).send({  
            success: true,  
            message: "Material Created Successfully",  
            data: material,  
        });  
  
    } catch (error) {  
        console.error(error);    
        res.status(500).send({  
            success: false,  
            message: "Internal server error",  
        });  
    }  
}; 


const findMaterialById = async (req, res) => {

    //get ID from params
    const { id } = req.params;

    try {

        //get post by ID
        const material = await prisma.material.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: `Get Category By ID :${id}`,
            data: material,
        });

    } catch (error) {
        console.error(error); 
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const updateMaterial = async (req, res) => {  
    const { id } = req.params;  
    const { name, description, categoryId, details, quantity } = req.body; 
  
    try {   
        const material = await prisma.material.findUnique({  
            where: { id: id },  
            include: {  
                category: true, 
                materialDetails: true,   
            },  
        });  
    
        if (!material) {  
            return res.status(404).send({  
                success: false,  
                message: "Material not found",  
            });  
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
            await prisma.materialDetail.deleteMany({  
                where: { materialId: id },  
            });  
   
            await prisma.materialDetail.createMany({  
                data: details.map(detail => ({  
                    batchNumber: detail.batchNumber,  
                    quantity: detail.quantity,  
                    expiredAt: detail.expiredAt ? new Date(detail.expiredAt) : null,  
                    materialId: id,  
                })),  
            });  
        }  

        if (quantity !== undefined) {  
            const materialDetail = await prisma.materialDetail.findFirst({  
                where: { materialId: id },  
            });  
  
            if (materialDetail) {  
                await prisma.materialDetail.update({  
                    where: { id: materialDetail.id },  
                    data: { quantity: quantity },  
                });  
            }  
        }  
  
        const finalMaterial = await prisma.material.findUnique({  
            where: { id: id },  
            include: {  
                category: true, 
                materialDetails: true, 
            },  
        });  
 
        res.status(200).send({  
            success: true,  
            message: "Material updated successfully",  
            data: finalMaterial, 
        });  
  
    } catch (error) {  
        console.error(error);
        res.status(500).send({  
            success: false,  
            message: "Internal server error",  
        });  
    }  
};   


const deleteMaterial = async (req, res) => {

    const { id } = req.params;

    try {
        await prisma.material.delete({
            where: {
                id: id,
            },
        });

        res.status(200).send({
            success: true,
            message: 'Material Deleted Successfully',
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }

};


const requestStock = async (req, res) => {  
    const { materialId, requestedQuantity } = req.body; 
  
    try {   
        const material = await prisma.material.findUnique({  
            where: { id: materialId },  
            include: {  
                materialDetails: true, 
            },  
        });  

        if (!material) {  
            const logEntry = await prisma.MaterialLog.create({  
                data: {  
                    material_id: materialId,  
                    quantity: requestedQuantity,  
                    message: "Material not found",  
                    status: "Rejected",  
                },  
            });  
  
            return res.status(404).send({  
                statusCode: 404,  
                data: [  
                    {  
                        MaterialId: materialId,  
                        MaterialName: "Unknown",
                        StokRequest: requestedQuantity,  
                        Message: "Material not found",  
                    },  
                ],  
            });  
        }  
  
        const totalStock = material.materialDetails.reduce((total, detail) => {  
            return total + detail.quantity;  
        }, 0);  

        if (requestedQuantity > totalStock) {  
            const logEntry = await prisma.MaterialLog.create({  
                data: {  
                    material_id: materialId,  
                    quantity: requestedQuantity,  
                    message: "Request ditolak",  
                    status: "Rejected",  
                },  
            });  
  
            return res.status(400).send({  
                statusCode: 400,  
                data: [  
                    {  
                        MaterialId: material.id,  
                        MaterialName: material.name,  
                        StokRequest: requestedQuantity,  
                        Stok: totalStock,  
                        Message: "Request ditolak",  
                    },  
                ],  
            });  
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
 
        await prisma.MaterialLog.create({  
            data: {  
                material_id: materialId,  
                quantity: requestedQuantity,  
                message: "Request Bahan Baku Berhasil",  
                status: "Accepted",  
            },  
        });  
  
        res.status(200).send({  
            statusCode: 200,  
            data: [  
                {  
                    MaterialId: material.id,  
                    MaterialName: material.name,  
                    StokRequest: requestedQuantity,  
                    Message: "Request Produk Berhasil",  
                },  
            ],  
        });  
  
    } catch (error) {  
        console.error(error);  
        res.status(500).send({  
            statusCode: 500,  
            data: [  
                {  
                    MaterialId: materialId,  
                    MaterialName: "Unknown", 
                    StokRequest: requestedQuantity,  
                    Message: "Internal server error",  
                },  
            ],  
        });  
    }  
};

const getMaterialLogs = async (req, res) => {  
    const { status } = req.query; 
  
    try {  
        const logs = await prisma.materialLog.findMany({  
            where: status ? { status: status } : {}, 
            orderBy: {  
                createdAt: 'desc',  
            },  
        });  
  
        res.status(200).send({  
            statusCode: 200,  
            data: logs,  
        });  
  
    } catch (error) {  
        console.error(error); 
        res.status(500).send({  
            statusCode: 500,  
            message: "Internal server error",  
        });  
    }  
};  


module.exports = {
    findMaterials,
    createMaterial,
    findMaterialById,
    updateMaterial,
    deleteMaterial,
    requestStock,
    getMaterialLogs 
}