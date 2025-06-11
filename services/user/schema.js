const { buildSchema } = require('graphql');  
  
const schema = buildSchema(`  
    type User {  
        id: ID!  
        email: String!  
        username: String  
        firstName: String!  
        lastName: String!  
        phone: String  
        role: UserRole!  
        isActive: Boolean!  
        createdAt: String!  
        updatedAt: String!  
    }  
  
    enum UserRole {  
        user  
        admin  
    }  
  
    type AuthPayload {  
        token: String!  
        user: User!  
    }  
  
    type Query {  
        users: [User]  
        user(id: ID!): User  
    }  
  
    input UserInput {  
        email: String!  
        username: String  
        password: String!  
        firstName: String!  
        lastName: String!  
        phone: String  
        role: UserRole  
    }  
  
    type Mutation {  
        createUser(input: UserInput): User  
        updateUser(id: ID!, input: UserInput): User  
        deleteUser(id: ID!): String  
        login(email: String!, password: String!): AuthPayload
        logout(token: String!): String   
    }  
`);  
  
module.exports = schema;  
