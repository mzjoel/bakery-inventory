const { buildSchema } = require('graphql');  
  
const schema = buildSchema(`  
  
type Category {    
    id: ID!    
    name: String!    
    description: String    
    createdAt: String!    
    updatedAt: String    
}    
  
type MaterialDetail {    
    id: ID!    
    batchNumber: String    
    quantity: Int!    
    expiredAt: String    
    materialId: ID!    
}    
  
type Material {    
    id: ID!    
    name: String!    
    description: String    
    categoryId: ID!    
    category: Category    
    materialDetails: [MaterialDetail]    
    createdAt: String!    
    updatedAt: String    
}    
  
type MaterialLog {    
    id: ID!    
    material_id: ID!    
    quantity: Int!    
    message: String!    
    status: String!    
    createdAt: String!    
}    
  
type Query {    
    findCategories: [Category]    
    findCategoryById(id: ID!): Category    
    findMaterials: [Material]    
    findMaterialById(id: ID!): Material    
    getMaterialLogs(status: String): [MaterialLog]    
}    
  
type Mutation {    
    createCategory(name: String!, description: String): Category    
    updateCategory(id: ID!, name: String!, description: String): Category    
    deleteCategory(id: ID!): String    
    createMaterial(name: String!, description: String, categoryId: ID!, details: [MaterialDetailInput]): Material    
    updateMaterial(id: ID!, name: String, description: String, categoryId: ID, details: [MaterialDetailInput]): Material    
    deleteMaterial(id: ID!): String    
    requestStock(materialId: ID!, requestedQuantity: Int!): String    
}    
  
input MaterialDetailInput {    
    batchNumber: String    
    quantity: Int!    
    expiredAt: String    
}    
`);  
  
module.exports = schema;  