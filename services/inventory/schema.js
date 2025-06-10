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
  
    type ProductLog {  
        id: ID!  
        product_id: ID!  
        quantity: Int  
        message: String  
        status: String  
        createdAt: String  
    }  
  
    type Query {  
        products: [Product]  
        product(id: ID!): Product  
        categories: [Category]  
        category(id: ID!): Category  
        productLogs(status: String): [ProductLog]  
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
  
    type Mutation {  
        createProduct(input: ProductInput): Product  
        updateProduct(id: ID!, input: ProductInput): Product  
        deleteProduct(id: ID!): String  
        createCategory(name: String!, description: String): Category  
        updateCategory(id: ID!, name: String!, description: String): Category  
        deleteCategory(id: ID!): String  
    }  
`);  

module.exports = schema;  