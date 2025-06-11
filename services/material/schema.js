const { buildSchema } = require('graphql');  
  
const schema = buildSchema(`  
type MaterialDetail {  
    id: ID!  
    batchNumber: String  
    quantity: Int  
    expiredAt: String  
}  
  
type Material {      
    id: ID!      
    name: String!      
    description: String      
    category: Category      
    materialDetails: [MaterialDetail]      
    createdAt: String      
    updatedAt: String      
}      
  
type Category {      
    id: ID!      
    name: String!      
    description: String      
    createdAt: String      
    updatedAt: String      
    materials: [Material]      
}      
  
type MaterialLog {      
    id: ID!      
    material_id: ID!      
    quantity: Int      
    message: String      
    status: String      
    createdAt: String      
}      
  
type Query {      
    materials: [Material]      
    material(id: ID!): Material      
    categories: [Category]      
    category(id: ID!): Category      
    materialLogs(status: String): [MaterialLog]      
}      
  
input MaterialInput {      
    name: String!      
    description: String      
    categoryId: ID!      
    details: [MaterialDetailInput]      
}      
  
input MaterialDetailInput {      
    batchNumber: String      
    quantity: Int      
    expiredAt: String      
}      
  
type Mutation {      
    createMaterial(input: MaterialInput): Material      
    updateMaterial(id: ID!, input: MaterialInput): Material      
    deleteMaterial(id: ID!): String      
    createCategory(name: String!, description: String): Category      
    updateCategory(id: ID!, name: String!, description: String): Category      
    deleteCategory(id: ID!): String      
}      
`);  
  
module.exports = schema; 