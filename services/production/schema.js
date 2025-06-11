const { buildSchema } = require('graphql');  
  
const schema = buildSchema(`  
type ProductionDetail {  
    id: ID!  
    productionId: ID!  
    materialId: String!  
    materialName: String!  
    requiredQuantity: Float!  
    usedQuantity: Float!  
    unit: String!  
    createdAt: String!  
}  
  
type Production {  
    id: ID!  
    batchNumber: String!  
    productId: String!  
    productName: String!  
    requestedQuantity: Int!  
    producedQuantity: Int!  
    status: ProductionStatus!  
    requestedBy: String!  
    startTime: String  
    endTime: String  
    createdAt: String!  
    updatedAt: String!  
    details: [ProductionDetail]!  
}  
  
enum ProductionStatus {  
    PENDING  
    MATERIAL_CHECK  
    IN_PROGRESS  
    COMPLETED  
    FAILED  
    CANCELLED  
}  
  
input ProductionDetailInput {  
    materialId: String!  
    materialName: String!  
    requiredQuantity: Float!  
    unit: String!  
}  
  
input RequestProductionInput {  
    batchNumber: String!  
    productId: String!  
    productName: String!  
    requestedQuantity: Int!  
    requestedBy: String!  
    details: [ProductionDetailInput]!  
}  
  
type Query {  
    productions: [Production]  
    production(id: ID!): Production  
}  
  
type Mutation {  
    requestProduction(input: RequestProductionInput): Production  
    updateProductionStatus(id: ID!, status: ProductionStatus!): Production  
}  
`);  
  
module.exports = schema;  