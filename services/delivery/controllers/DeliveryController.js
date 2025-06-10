const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient();

const findAllDelivery = async (req, res) => {
    try{
        const delivery = await prisma.Delivery.findMany({
            select : {
                id : true,
                deliveryId : true,
                deliveryDate : true,
                receivedDate : true,
                status : true,
                createdAt : true,
                updatedAt : true,
            }
        });

        res.status(200).send({
            success: true,
            message: "Successfully Find All Delivery Records",
            data: delivery,
        });
    }catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
        })
    }
};

const createDelivery = async (req, res) => {  
    try {  
        const { products, sender } = req.body; // Mengambil informasi produk dan pengirim dari request body  
  
        // Validasi input  
        if (!products || !sender) {  
            return res.status(400).json({ message: 'Informasi produk dan pengirim harus disediakan.' });  
        }  
  
        // Membuat entri pengiriman  
        const delivery = await prisma.delivery.create({  
            data: {  
                deliveryId: generateUniqueDeliveryId(), // Menggunakan helper untuk ID unik  
                status: 'IN_PROGRESS',  
                driver: sender.driver, // Menyimpan informasi driver  
                details: {  
                    create: products.map(product => ({  
                        productId: product.productId,  
                        quantity: product.quantity,  
                        notes: product.notes,  
                    })),  
                },  
            },  
            include: {  
                details: true, 
            },  
        });  
  
        // Menghasilkan response  
        return res.status(201).json({  
            delivery: {  
                id: delivery.id,  
                deliveryId: delivery.deliveryId,  
                deliveryDate: delivery.deliveryDate,  
                status: delivery.status,  
                driver: delivery.driver,  
                details: delivery.details,  
            },  
            sender: sender,  
        });  
    } catch (error) {  
        console.error(error);  
        return res.status(500).json({ message: 'Terjadi kesalahan saat membuat pengiriman.' });  
    } finally {  
        await prisma.$disconnect(); // Menutup koneksi Prisma  
    }  
};


const updateDeliveryStatus = async (req, res) => {  
    try {  
        const { deliveryId } = req.params; 
        const { status } = req.body; 
        
        if (!status) {  
            return res.status(400).json({ message: 'Status tidak tersedia' });  
        }  

        const newStatus = status ? 'DELIVERED' : 'CANCELED';  
        const receivedDate = status ? new Date() : null; 

        const updatedDelivery = await prisma.delivery.update({  
            where: { deliveryId: deliveryId },
            data: {  
                status: newStatus,  
                receivedDate: receivedDate,  
            },  
        });   
  
         return res.status(200).json({  
            message: 'Status pengiriman berhasil diupdate.',  
            delivery: updatedDelivery,  
        });  
    } catch (error) {  
        console.error(error);  
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate status pengiriman.' });  
    } finally {  
        await prisma.$disconnect();   
    }  
};  

const generateUniqueDeliveryId = () => {  
    const prefix = 'bakinv'; // Prefix tetap  
    const timestamp = Date.now(); // Menggunakan timestamp sebagai bagian dari ID  
    const uniqueId = `${prefix}${timestamp}`; // Menggabungkan prefix dengan timestamp  
    return uniqueId;  
};  


module.exports = {
    findAllDelivery,
    createDelivery,
    updateDeliveryStatus
}