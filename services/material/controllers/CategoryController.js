//import PrismaClient
const { PrismaClient } = require('@prisma/client');

//init prisma client
const prisma = new PrismaClient();

// Import validationResult from express-validator
const { validationResult } = require("express-validator");

//function findPosts
const findCategories = async (req, res) => {
    try {

        //get all categories from database
        const category = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: "Get All Categories Successfully",
            data: category,
        });

    } catch (error) {
        console.error(error); // Log the error to the console  
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

//function createCategory
const createCategories = async (req, res) => {

    // Periksa hasil validasi
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Jika ada error, kembalikan error ke pengguna
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    try {

        //insert data
        const category = await prisma.category.create({
            data: {
                name: req.body.name,
                description: req.body.description,
            },
        });

        res.status(201).send({
            success: true,
            message: "Category Created Successfully",
            data: category,
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
const findCategoryById = async (req, res) => {

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

const updateCategory = async (req, res) => {

    //get ID from params
    const { id } = req.params;

    // Periksa hasil validasi
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Jika ada error, kembalikan error ke pengguna
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    try {

        //update post
        const category = await prisma.category.update({
            where: {
                id: id,
            },
            data: {
                name: req.body.name,
                description: req.body.description,
                updatedAt: new Date(),
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: 'Category Updated Successfully',
            data: category,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

//function deletePost
const deleteCategory = async (req, res) => {

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

//export function
module.exports = {
    findCategories,
    createCategories,
    findCategoryById,
    updateCategory,
    deleteCategory,
}