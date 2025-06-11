const { PrismaClient } = require('@prisma/client');  
const prisma = new PrismaClient();  
  
const resolvers = {  
    // Queries  
    findAllDelivery: async () => {  
        return await prisma.delivery.findMany({  
            include: {  
                details: true,  
            },  
        });  
    },  
  
    // Mutations  
    createDelivery: async ({ products, sender }) => {  
        try {  
            const delivery = await prisma.delivery.create({  
                data: {  
                    deliveryId: generateUniqueDeliveryId(),  
                    status: 'IN_PROGRESS',  
                    driver: sender.driver,  
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
            return delivery;  
        } catch (error) {  
            console.error(error);  
            throw new Error('Error creating delivery');  
        }  
    },  
  
    updateDeliveryStatus: async ({ deliveryId, status }) => {  
        try {  
            const newStatus = status ? 'DELIVERED' : 'CANCELLED';  
            const receivedDate = status ? new Date() : null;  
  
            const updatedDelivery = await prisma.delivery.update({  
                where: { deliveryId: deliveryId },  
                data: {  
                    status: newStatus,  
                    receivedDate: receivedDate,  
                },  
            });  
            return updatedDelivery;  
        } catch (error) {  
            console.error(error);  
            throw new Error('Error updating delivery status');  
        }  
    },  
};  
  
const generateUniqueDeliveryId = () => {  
    const prefix = 'bakinv';  
    const timestamp = Date.now();  
    const uniqueId = `${prefix}${timestamp}`;  
    return uniqueId;  
};  
  
module.exports = resolvers;  