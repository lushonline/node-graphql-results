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
const DATABASE_URL = process.env.DATABASE_URL || '';

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Now app is running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Database Connection String: ${DATABASE_URL}`);
});

module.exports = {
  app,
};
