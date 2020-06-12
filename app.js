const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');

const schema = require('./src/schema/schema');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.static('public'));

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`GraphQL app is running on port http://localhost:${PORT}/graphql`);
  // eslint-disable-next-line no-console
  console.log(`Database Host: ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Database Name: ${process.env.POSTGRES_DB}`);
});

module.exports = {
  app,
};
