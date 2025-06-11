const express = require('express');  
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema'); // Ensure this path is correct  
const resolvers = require('./resolvers'); // Ensure this path is correct  
  
const app = express();  
const PORT = 4069;  
  
app.use('/graphql', graphqlHTTP({  
    schema: schema,  
    rootValue: resolvers,  
    graphiql: true, // Enable GraphiQL for testing  
}));  
  
app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}/graphql`);  
});  