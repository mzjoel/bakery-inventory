const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();


const { validationResult } = require("express-validator");


const findProducts = async (req, res) => {  
    try {  
        // Mengambil semua produk dari database  
        const products = await prisma.product.findMany({  
            include: {  
                category: true, // Sertakan informasi kategori  
                productDetails: true, // Sertakan detail produk  
            },  
        });  
  
        // Mengirimkan respons  
        res.status(200).send({  
            success: true,  
            message: "Get All Products Successfully",  
            data: products,  
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

//function createCategory
const createProduct = async (req, res) => {  
    const { name, description, categoryId, details } = req.body;  
  
    // Validate details  
    if (!Array.isArray(details)) {  
        return res.status(400).send({  
            success: false,  
            message: "Details must be an array.",  
        });  
    }  
  
    try {  
        const product = await prisma.product.create({  
            data: {  
                name,  
                description,  
                category: {  
                    connect: { id: categoryId }  
                },  
                productDetails: {  
                    create: details.map(detail => ({  
                        batchNumber: detail.batchNumber,  
                        quantity: detail.quantity,  
                        expiredAt: detail.expiredAt ? new Date(detail.expiredAt) : null  
                    }))  
                }  
            },  
            include: {  
                category: true,  
                productDetails: true,  
            }  
        });  
  
        res.status(201).send({  
            success: true,  
            message: "Product Created Successfully",  
            data: product,  
        });  
  
    } catch (error) {  
        console.error(error); // Log the error to the console    
        res.status(500).send({  
            success: false,  
            message: "Internal server error",  
        });  
    }  
}; 

//function findPostById
const findProductById = async (req, res) => {

    //get ID from params
    const { id } = req.params;

    try {

        //get post by ID
        const category = await prisma.category.findUnique({
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
            data: category,
        });

    } catch (error) {
        console.error(error); 
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const updateProduct = async (req, res) => {  
    const { id } = req.params; // Mengambil ID produk dari parameter URL  
    const { name, description, categoryId, details, quantity } = req.body; // Mengambil data dari body permintaan  
  
    try {  
        // Mencari produk berdasarkan ID  
        const product = await prisma.product.findUnique({  
            where: { id: id },  
            include: {  
                category: true, // Sertakan kategori  
                productDetails: true, // Sertakan detail produk  
            },  
        });  
  
        // Jika produk tidak ditemukan, kirimkan respons 404  
        if (!product) {  
            return res.status(404).send({  
                success: false,  
                message: "Product not found",  
            });  
        }  
  
        // Membuat objek data untuk pembaruan  
        const updateData = {};  
  
        // Memeriksa dan menambahkan kolom yang ingin diperbarui  
        if (name) updateData.name = name;  
        if (description) updateData.description = description;  
        if (categoryId) updateData.categoryId = categoryId;  
  
        // Memperbarui produk  
        const updatedProduct = await prisma.product.update({  
            where: { id: id },  
            data: updateData,  
            include: {  
                category: true, // Sertakan kategori setelah pembaruan  
                productDetails: true, // Sertakan detail produk setelah pembaruan  
            },  
        });  
  
        // Jika ada detail produk yang ingin diperbarui  
        if (details) {  
            // Menghapus detail produk yang ada  
            await prisma.productDetail.deleteMany({  
                where: { productId: id },  
            });  
  
            // Menambahkan detail produk baru  
            await prisma.productDetail.createMany({  
                data: details.map(detail => ({  
                    batchNumber: detail.batchNumber,  
                    quantity: detail.quantity,  
                    expiredAt: detail.expiredAt ? new Date(detail.expiredAt) : null,  
                    productId: id,  
                })),  
            });  
        }  
  
        // Jika quantity ingin diperbarui, cari detail produk yang sesuai  
        if (quantity !== undefined) {  
            // Misalkan Anda ingin memperbarui quantity untuk detail produk pertama  
            const productDetail = await prisma.productDetail.findFirst({  
                where: { productId: id },  
            });  
  
            if (productDetail) {  
                await prisma.productDetail.update({  
                    where: { id: productDetail.id },  
                    data: { quantity: quantity },  
                });  
            }  
        }  
  
        // Mengambil produk yang diperbarui dengan kategori dan detail produk  
        const finalProduct = await prisma.product.findUnique({  
            where: { id: id },  
            include: {  
                category: true, // Sertakan kategori  
                productDetails: true, // Sertakan detail produk  
            },  
        });  
  
        // Mengirimkan respons  
        res.status(200).send({  
            success: true,  
            message: "Product updated successfully",  
            data: finalProduct, // Mengembalikan produk yang diperbarui  
        });  
  
    } catch (error) {  
        console.error(error); // Log error untuk debugging  
        res.status(500).send({  
            success: false,  
            message: "Internal server error",  
        });  
    }  
};   

//function deletePost
const deleteProduct = async (req, res) => {

    //get ID from params
    const { id } = req.params;

    try {

        //delete post
        await prisma.category.delete({
            where: {
                id: id,
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: 'Cetegory Deleted Successfully',
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }

};

// Fungsi untuk mengurangi stok produk  
const requestStock = async (req, res) => {  
    const { productId, requestedQuantity } = req.body; // Mengambil data dari body permintaan  
  
    try {  
        // Mencari produk berdasarkan ID  
        const product = await prisma.product.findUnique({  
            where: { id: productId },  
            include: {  
                productDetails: true, // Sertakan detail produk untuk mendapatkan stok  
            },  
        });  
  
        // Jika produk tidak ditemukan, kirimkan respons 404  
        if (!product) {  
            const logEntry = await prisma.ProductLog.create({  
                data: {  
                    product_id: productId,  
                    quantity: requestedQuantity,  
                    message: "Product not found",  
                    status: "Rejected",  
                },  
            });  
  
            return res.status(404).send({  
                statusCode: 404,  
                data: [  
                    {  
                        ProductID: productId,  
                        ProductName: "Unknown", // Nama produk tidak diketahui  
                        StokRequest: requestedQuantity,  
                        Message: "Product not found",  
                    },  
                ],  
            });  
        }  
  
        // Menghitung total stok yang tersedia  
        const totalStock = product.productDetails.reduce((total, detail) => {  
            return total + detail.quantity; // Menjumlahkan quantity dari semua detail produk  
        }, 0);  
  
        // Memeriksa apakah stok mencukupi  
        if (requestedQuantity > totalStock) {  
            const logEntry = await prisma.ProductLog.create({  
                data: {  
                    product_id: productId,  
                    quantity: requestedQuantity,  
                    message: "Request ditolak",  
                    status: "Rejected",  
                },  
            });  
  
            return res.status(400).send({  
                statusCode: 400,  
                data: [  
                    {  
                        ProductID: product.id,  
                        ProductName: product.name,  
                        StokRequest: requestedQuantity,  
                        Stok: totalStock,  
                        Message: "Request ditolak",  
                    },  
                ],  
            });  
        }  
  
        // Mengurangi stok  
        let remainingQuantity = requestedQuantity;  
  
        for (const detail of product.productDetails) {  
            if (remainingQuantity <= 0) break; // Jika tidak ada lagi yang perlu dikurangi  
  
            if (detail.quantity >= remainingQuantity) {  
                // Jika detail ini cukup untuk memenuhi permintaan  
                await prisma.productDetail.update({  
                    where: { id: detail.id },  
                    data: { quantity: detail.quantity - remainingQuantity },  
                });  
                remainingQuantity = 0; // Semua permintaan telah dipenuhi  
            } else {  
                // Jika detail ini tidak cukup, kurangi semua stok di detail ini  
                remainingQuantity -= detail.quantity;  
                await prisma.productDetail.update({  
                    where: { id: detail.id },  
                    data: { quantity: 0 }, // Set quantity ke 0  
                });  
            }  
        }  
  
        // Mencatat aktivitas ke dalam ProductLog  
        await prisma.ProductLog.create({  
            data: {  
                product_id: productId,  
                quantity: requestedQuantity,  
                message: "Request Produk Berhasil",  
                status: "Accepted",  
            },  
        });  
  
        // Mengirimkan respons sukses  
        res.status(200).send({  
            statusCode: 200,  
            data: [  
                {  
                    ProductID: product.id,  
                    ProductName: product.name,  
                    StokRequest: requestedQuantity,  
                    Message: "Request Produk Berhasil",  
                },  
            ],  
        });  
  
    } catch (error) {  
        console.error(error); // Log error untuk debugging  
        res.status(500).send({  
            statusCode: 500,  
            data: [  
                {  
                    ProductID: productId,  
                    ProductName: "Unknown", // Nama produk tidak diketahui  
                    StokRequest: requestedQuantity,  
                    Message: "Internal server error",  
                },  
            ],  
        });  
    }  
};

const getProductLogs = async (req, res) => {  
    const { status } = req.query; // Mengambil status dari query parameter  
  
    try {  
        // Mencari log berdasarkan status jika ada  
        const logs = await prisma.productLog.findMany({  
            where: status ? { status: status } : {}, // Filter berdasarkan status jika ada  
            orderBy: {  
                createdAt: 'desc', // Mengurutkan berdasarkan waktu pencatatan terbaru  
            },  
        });  
  
        // Mengirimkan respons  
        res.status(200).send({  
            statusCode: 200,  
            data: logs,  
        });  
  
    } catch (error) {  
        console.error(error); // Log error untuk debugging  
        res.status(500).send({  
            statusCode: 500,  
            message: "Internal server error",  
        });  
    }  
};  

//export function
module.exports = {
    findProducts,
    createProduct,
    findProductById,
    updateProduct,
    deleteProduct,
    requestStock,
    getProductLogs 
}