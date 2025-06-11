
const { buildSchema } = require('graphql');  
  
const schema = buildSchema(`  
  
type Delivery {  
    id: ID!  
    deliveryId: String!  
    deliveryDate: String!  
    receivedDate: String  
    status: DeliveryStatus!  
    driver: String!  
    createdAt: String!  
    updatedAt: String  
    details: [DeliveryDetail]  
}  
  
type DeliveryDetail {  
    id: ID!  
    deliveryId: ID!  
    productId: String!  
    quantity: Int!  
    notes: String  
    createdAt: String!  
    updatedAt: String  
}  
  
enum DeliveryStatus {  
    PENDING  
    IN_PROGRESS  
    DELIVERED  
    CANCELLED  
}  
  
type Query {  
    findAllDelivery: [Delivery]  
}  
  
type Mutation {  
    createDelivery(products: [ProductInput]!, sender: SenderInput!): Delivery  
    updateDeliveryStatus(deliveryId: String!, status: Boolean!): Delivery  
}  
  
input ProductInput {  
    productId: String!  
    quantity: Int!  
    notes: String  
}  
  
input SenderInput {  
    driver: String!  
}  
`);  
  
module.exports = schema;  