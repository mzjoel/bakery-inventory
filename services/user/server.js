const express = require('express');  
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema'); 
const resolvers = require('./resolvers'); 
  
const app = express();  
const PORT = 4004;  
  
app.use('/graphql', graphqlHTTP({  
    schema: schema,  
    rootValue: resolvers,  
    graphiql: true, 
}));  
  
app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}/graphql`);  
});  