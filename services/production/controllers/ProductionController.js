const { PrismaClient } = require('@prisma/client');  

const prisma = new PrismaClient();

const { validationResult } = require("express-validator");

const requestProduction = async(req, res) =>{
    const{productId, productName, requestedQuantity, requestedBy}  = req.body;
    try{

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
      res.status(201).send({
        success:true,
        message: "Request Production Successfully",
        data: production,
      });
    }catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        })
    }
}

  
const processProduction = async (req, res) => {  
  const { batchNumber, startTime, materials } = req.body;  
  
  try {  
    // Mencari produksi berdasarkan batchNumber  
    const production = await prisma.production.findUnique({  
      where: { batchNumber },  
      include: { details: true }, // Mengambil detail produksi  
    });  
  
    if (!production) {  
      return res.status(404).json({ message: 'Produksi tidak ditemukan' });  
    }  
  
    // Mengupdate status produksi menjadi IN_PROGRESS  
    const updatedProduction = await prisma.production.update({  
      where: { batchNumber },  
      data: {  
        status: 'IN_PROGRESS',  
        startTime: new Date(startTime), // Mengatur waktu mulai  
      },  
    });  
  
    // Menambahkan detail material yang digunakan  
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
  
    // Mengambil informasi produksi terbaru  
    const productionWithDetails = await prisma.production.findUnique({  
      where: { batchNumber },  
      include: { details: true },  
    });  
  
    return res.status(200).json(productionWithDetails);  
  } catch (error) {  
    return res.status(500).json({ message: 'Terjadi kesalahan saat memproses produksi', error });  
  }  
};  

const completeProduction = async (req, res) => {  
  const { batchNumber } = req.body;  
  
  try {  

    const production = await prisma.production.findUnique({  
      where: { batchNumber },  
      include: { details: true }, 
    });  
  
    if (!production) {  
      return res.status(404).json({ message: 'Produksi tidak ditemukan' });  
    }  
  
    const updatedProduction = await prisma.production.update({  
      where: { batchNumber },  
      data: {  
        status: 'COMPLETED',  
        endTime: new Date(),
      },  
    });  

    const productionWithDetails = await prisma.production.findUnique({  
      where: { batchNumber },  
      include: { details: true },  
    });  
  
    return res.status(200).json(productionWithDetails);  
  } catch (error) {  
    return res.status(500).json({ message: 'Terjadi kesalahan saat menyelesaikan produksi', error });  
  }  
};

const getAllProductions = async (req, res) => {  
  const { status, batchNumber } = req.query;  
  
  try {  
    const whereClause = {  
      ...(status && { status }),   
      ...(batchNumber && { batchNumber }),  
    };  
  
    const productions = await prisma.production.findMany({  
      where: whereClause,  
      include: { details: true },  
    });  
  
    return res.status(200).json(productions);  
  } catch (error) {  
    console.log(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data produksi', error });  
  }  
}; 


const generateUniqueBatchNumber = () => {  
    const prefix = 'dev';   
    const timestamp = Date.now();  
    const uniqueId = `${prefix}${timestamp}`;
    return uniqueId;  
};  


module.exports = {
    requestProduction,
    processProduction,
    completeProduction,
    getAllProductions
}