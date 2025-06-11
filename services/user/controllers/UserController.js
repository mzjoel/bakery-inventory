const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');   

const generateToken = (userId) => {  
    return jwt.sign({ id: userId }, 'jkfjaojrmmkdmfaokp', { expiresIn: '5h' });
};  

const register = async (req, res) => {  
    const { username, email, firstName, lastName, password } = req.body;  
  
    try {  
 
        const existingUser = await prisma.user.findUnique({  
            where: { email: email },  
        });  
  
        if (existingUser) {  
            return res.status(400).send({  
                success: false,  
                message: "User already exists",  
            });  
        }  
  

        const hashedPassword = await bcrypt.hash(password, 10);  
 
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
  
      
        const token = generateToken(user.id);  
  
        res.status(201).send({  
            success: true,  
            message: "User registered successfully",  
            data: {  
                id: user.id,  
                username: user.username,  
                email: user.email,
                firstName: firstName,
                lastName: lastName,    
                token: token,  
            },  
        });  
  
    } catch (error) {  
        console.error(error);   
        res.status(500).send({  
            success: false,  
            message: "Internal server error",  
        });  
    }  
}; 

const logout = async (req, res) => {  
    const { email, password, token } = req.body;  
  
    try {   
        const decoded = jwt.verify(token, 'jkfjaojrmmkdmfaokp');  
        const userId = decoded.id;  
  
        const user = await prisma.user.findUnique({  
            where: { id: userId },  
        });  
  
        if (!user) {  
            return res.status(401).send({  
                success: false,  
                message: "Invalid token or user not found",  
            });  
        }  
  
        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if (!isPasswordValid) {  
            return res.status(401).send({  
                success: false,  
                message: "Invalid password",  
            });  
        }  
  
        res.status(200).send({  
            success: true,  
            message: "User logged out successfully",  
        });  
  
    } catch (error) {  
        console.error(error);  
        res.status(500).send({  
            success: false,  
            message: "Internal server error",  
        });  
    }  
}; 

const login = async (req, res) => {  
    const { email, password } = req.body;  
  
    try {  
        const user = await prisma.user.findUnique({  
            where: { email: email },  
        });  
  
        if (!user) {  
            return res.status(401).send({  
                success: false,  
                message: "Invalid email or password",  
            });  
        }  
  
    
        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if (!isPasswordValid) {  
            return res.status(401).send({  
                success: false,  
                message: "Invalid email or password",  
            });  
        }  
  
     
        const token = generateToken(user.id);  
  
        res.status(200).send({  
            success: true,  
            message: "Login successful",  
            data: {  
                id: user.id,  
                username: user.username,  
                email: user.email,  
                token: token,  
            },  
        });  
  
    } catch (error) {  
        console.error(error);  
        res.status(500).send({  
            success: false,  
            message: "Internal server error",  
        });  
    }  
};  



module.exports = {
    register,
    logout,
    login
}