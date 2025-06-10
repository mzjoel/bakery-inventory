const { buildSchema } = require('graphql');  
  
const schema = buildSchema(`  
    type Delivery {  
        id: ID!  
        deliveryId: String!  
        deliveryDate: String!  
        receivedDate: String  
        status: DeliveryStatus!  
        driver: String  
        createdAt: String!  
        updatedAt: String!  
    }  
  
    type DeliveryDetail {  
        id: ID!  
        deliveryId: ID!  
        productId: String!  
        quantity: Int!  
        notes: String  
        createdAt: String!  
        updatedAt: String!  
    }  
  
    enum DeliveryStatus {  
        PENDING  
        IN_PROGRESS  
        DELIVERED  
        CANCELLED  
    }  
  
    type Query {  
        deliveries: [Delivery]  
        delivery(id: ID!): Delivery  
    }  
  
    input DeliveryInput {  
        deliveryId: String!  
        driver: String  
        details: [DeliveryDetailInput]!  
    }  
  
    input DeliveryDetailInput {  
        productId: String!  
        quantity: Int!  
        notes: String  
    }  
  
    type Mutation {  
        createDelivery(input: DeliveryInput): Delivery  
        updateDelivery(id: ID!, input: DeliveryInput): Delivery  
        deleteDelivery(id: ID!): String  
    }  
`);  
  
module.exports = schema;  