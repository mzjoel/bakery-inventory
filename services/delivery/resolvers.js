const { PrismaClient } = require('@prisma/client');  
const prisma = new PrismaClient();  
  
const resolvers = {  
    // Queries  
    deliveries: async () => {  
        return await prisma.delivery.findMany({  
            select: {  
                id: true,  
                deliveryId: true,  
                deliveryDate: true,  
                receivedDate: true,  
                status: true,  
                driver: true,  
                createdAt: true,  
                updatedAt: true,  
            },  
        });  
    },  
    delivery: async ({ id }) => {  
        return await prisma.delivery.findUnique({  
            where: { id: id },  
            include: { details: true },  
        });  
    },  
  
    // Mutations  
    createDelivery: async ({ input }) => {  
    const { details, driver } = input;  
  
    // Validasi input  
    if (!details || !driver) {  
        throw new Error('Informasi produk dan pengirim harus disediakan.');  
    }  
  
    // Membuat entri pengiriman  
    const delivery = await prisma.delivery.create({  
        data: {  
            deliveryId: generateUniqueDeliveryId(),  
            status: 'IN_PROGRESS',  
            driver: driver,  
            details: {  
                create: details.map(detail => ({  
                    productId: detail.productId,  
                    quantity: detail.quantity,  
                    notes: detail.notes,  
                })),  
            },  
        },  
        include: { details: true },  
    });  
  
    return {  
        id: delivery.id,  
        deliveryId: delivery.deliveryId,  
        deliveryDate: delivery.deliveryDate,  
        status: delivery.status,  
        driver: delivery.driver,  
        details: delivery.details,  // Pastikan ini ada  
    };  
},    
    updateDeliveryStatus: async ({ deliveryId, status }) => {  
        if (!status) {  
            throw new Error('Status tidak tersedia');  
        }  
  
        const newStatus = status === 'DELIVERED' ? 'DELIVERED' : 'CANCELLED';  
        const receivedDate = status === 'DELIVERED' ? new Date() : null;  
  
        const updatedDelivery = await prisma.delivery.update({  
            where: { deliveryId: deliveryId },  
            data: {  
                status: newStatus,  
                receivedDate: receivedDate,  
            },  
        });  
  
        return updatedDelivery;  
    },  
};  
  
// Helper function to generate unique delivery ID  
const generateUniqueDeliveryId = () => {  
    const prefix = 'bakinv'; // Prefix tetap  
    const timestamp = Date.now(); // Menggunakan timestamp sebagai bagian dari ID  
    const uniqueId = `${prefix}${timestamp}`; // Menggabungkan prefix dengan timestamp  
    return uniqueId;  
};  
  
module.exports = resolvers; 