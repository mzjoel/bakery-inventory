const { buildSchema } = require('graphql');  
  
const schema = buildSchema(`  
type ProductDetail {  
    id: ID!  
    batchNumber: String  
    quantity: Int  
    expiredAt: String  
}  
  
type Product {      
    id: ID!      
    name: String!      
    description: String      
    category: Category      
    productDetails: [ProductDetail]      
    createdAt: String      
    updatedAt: String      
}      
  
type Category {      
    id: ID!      
    name: String!      
    description: String      
    createdAt: String      
    updatedAt: String      
    products: [Product]      
}      
  
type Order {      
    id: ID!      
    productId: ID!      
    quantity: Int      
    status: String      
    createdAt: String      
}      
  
type Query {      
    products: [Product]      
    product(id: ID!): Product      
    categories: [Category]      
    category(id: ID!): Category      
    orders: [Order]      
    order(id: ID!): Order      
}      
  
input ProductInput {      
    name: String!      
    description: String      
    categoryId: ID!      
    details: [ProductDetailInput]      
}      
  
input ProductDetailInput {      
    batchNumber: String      
    quantity: Int      
    expiredAt: String      
}      
  
input OrderInput {      
    productId: ID!      
    quantity: Int      
}      
  
type Mutation {      
    createProduct(input: ProductInput): Product      
    updateProduct(id: ID!, input: ProductInput): Product      
    deleteProduct(id: ID!): String      
    createCategory(name: String!, description: String): Category      
    updateCategory(id: ID!, name: String!, description: String): Category      
    deleteCategory(id: ID!): String      
    createOrder(input: OrderInput): Order      
    updateOrder(id: ID!, input: OrderInput): Order      
    deleteOrder(id: ID!): String      
}      
`);  
  
module.exports = schema;  