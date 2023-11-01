const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const { buildSchema } = require("graphql")

const cors = require('cors');
const mongoose = require('mongoose');
const root = require('./graphql/root');

const app = express();

async function createConnection() {
  await mongoose.connect('mongodb://127.0.0.1:27017/xmart');
}
createConnection();

const schema = buildSchema(`
  scalar Date

  type Transaction {
    qrcode : String!
    barcode: String!
    price: Float!
    quantity: Int!
    _id : String
    date: Date!
  }
  type Query {
    postTransaction(qrcode: String!, barcode: String!, price: Float!, quantity: Int!) : Transaction
    mark: String
    getTransactions: [Transaction]
  }
`)

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)
app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql");