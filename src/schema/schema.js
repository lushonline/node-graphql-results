const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList,
  GraphQLFloat,
  GraphQLBoolean,
} = require('graphql');

const { GraphQLDateTime } = require('graphql-iso-date');

const { Op } = require('sequelize');

const model = require('../database/models');

const { results } = model;

const resultType = new GraphQLObjectType({
  name: 'result',
  fields: () => ({
    id: { type: GraphQLInt },
    temperature: { type: GraphQLFloat },
    pressure: { type: GraphQLFloat },
    createdAt: { type: GraphQLDateTime },
  }),
});

const pageInfoType = new GraphQLObjectType({
  name: 'pageInfo',
  fields: () => ({
    hasNextPage: { type: GraphQLBoolean },
    endCursor: { type: GraphQLDateTime },
  }),
});

const resultConnectionType = new GraphQLObjectType({
  name: 'results',
  fields: () => ({
    edges: { type: new GraphQLList(resultType) },
    pageInfo: { type: pageInfoType },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    result: {
      type: resultType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return results.findByPk(args.id);
      },
    },

    results: {
      type: resultConnectionType,
      description:
        'Returns paged results using cursor based pagination, maximum records per request is 50',
      args: {
        cursor: { type: GraphQLDateTime, defaultValue: null },
        limit: { type: GraphQLInt, defaultValue: 500 },
      },
      // eslint-disable-next-line no-unused-vars
      async resolve(parent, { cursor, limit = 500 }) {
        const cursorOptions = cursor
          ? {
              where: {
                createdAt: {
                  [Op.gt]: cursor,
                },
              },
            }
          : {};

        // Limit "limit" to 500
        if (limit > 500) {
          throw new Error('Maximum limit is 500');
        }

        const resultItems = await results.findAll({
          limit: limit + 1,
          order: [['createdAt', 'ASC']],
          ...cursorOptions,
        });

        const hasNextPage = resultItems.length > limit;
        const edges = hasNextPage ? resultItems.slice(0, -1) : resultItems;

        return {
          edges,
          pageInfo: {
            hasNextPage,
            endCursor: edges.length > 1 ? edges[edges.length - 1].createdAt : null,
          },
        };
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addresult: {
      type: resultType,
      args: {
        temperature: { type: new GraphQLNonNull(GraphQLFloat) },
        pressure: { type: new GraphQLNonNull(GraphQLFloat) },
      },
      resolve(parent, args) {
        const result = {
          temperature: args.temperature,
          pressure: args.pressure,
        };
        return results.create(result);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
