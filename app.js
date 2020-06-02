const express = require('express');
const graphqlHTTP = require('express-graphql');

const schema = require('./src/schema/schema');

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Now app is running on port ${PORT}`);
});

module.exports = {
  app,
};
