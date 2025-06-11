const { PrismaClient } = require('@prisma/client');  
const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');  
const prisma = new PrismaClient();  
  
const generateToken = (userId) => {  
    return jwt.sign({ id: userId }, 'jkfjaojrmmkdmfaokp', { expiresIn: '5h' });  
};  
  
const resolvers = {  
    // Queries  
    users: async () => {  
        return await prisma.user.findMany({  
            select: {  
                id: true,  
                email: true,  
                username: true,  
                firstName: true,  
                lastName: true,  
                phone: true,  
                role: true,  
                isActive: true,  
                createdAt: true,  
                updatedAt: true,  
            },  
        });  
    },  
    user: async ({ id }) => {  
        return await prisma.user.findUnique({  
            where: { id: id },  
            select: {  
                id: true,  
                email: true,  
                username: true,  
                firstName: true,  
                lastName: true,  
                phone: true,  
                role: true,  
                isActive: true,  
                createdAt: true,  
                updatedAt: true,  
            },  
        });  
    },  
  
    // Mutations  
    createUser: async ({ input }) => {  
    const { username, email, firstName, lastName, password } = input;  
  
    const existingUser = await prisma.user.findUnique({  
        where: { email: email },  
    });  
  
    if (existingUser) {  
        throw new Error("User already exists");  
    }  
  
    const hashedPassword = await bcrypt.hash(password, 10);  
    console.log("Creating user with data:", { username, email, firstName, lastName });  
      
    const user = await prisma.user.create({  
        data: {  
            username: username,  
            email: email,  
            firstName: firstName,  
            lastName: lastName,  
            password: hashedPassword,  
            role: 'user',  
        },  
    });  
  
    console.log("User created:", user);  
  
    const token = generateToken(user.id);  
  
    return {  
        id: user.id,  
        username: user.username,  
        email: user.email,  
        firstName: firstName,  
        lastName: lastName,  
        token: token,  
    };  
},   
  
    login: async ({ email, password }) => {  
        const user = await prisma.user.findUnique({  
            where: { email: email },  
        });  
  
        if (!user) {  
            throw new Error("Invalid email or password");  
        }  
  
        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if (!isPasswordValid) {  
            throw new Error("Invalid email or password");  
        }  
  
        const token = generateToken(user.id);  
  
        return {  
            token: token,  
            user: {  
                id: user.id,  
                username: user.username,  
                email: user.email,  
            },  
        };  
    }, 
    
    logout: async ({ token }) => {  
        try {  
            const decoded = jwt.verify(token, 'jkfjaojrmmkdmfaokp');  
            const userId = decoded.id;  
  
            const user = await prisma.user.findUnique({  
                where: { id: userId },  
            });  
  
            if (!user) {  
                throw new Error("Invalid token or user not found");  
            }  

  
            return "User logged out successfully";  
        } catch (error) {  
            console.error(error);  
            throw new Error("Internal server error");  
        }  
    },  
  
    updateUser: async ({ id, input }) => {  
        const user = await prisma.user.findUnique({ where: { id: id } });  
  
        if (!user) {  
            throw new Error("User not found");  
        }  
  
        const updatedUser = await prisma.user.update({  
            where: { id: id },  
            data: input,  
        });  
  
        return updatedUser;  
    },  
  
    deleteUser: async ({ id }) => {  
        await prisma.user.delete({ where: { id: id } });  
        return "User deleted successfully";  
    },  
};  
  
module.exports = resolvers;  