const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();
const cors = require('cors');

//Alow cross origin access
app.use(cors());

mongoose.connect('mongodb://localhost:27017/gql-mongo', { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log("connected to db");
    
})
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
    
}));

app.listen(4000, () => {
    console.log("Listening for request");
    
})