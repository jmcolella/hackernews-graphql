const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const query  = require('./resolvers/query');
const mutation = require('./resolvers/mutation');


const resolvers = {
  Query: query,
  Mutation: mutation,
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
    author: (parent, args, context) => context.prisma.link({ id: parent.id }).author(),
  },
  User: {
    links: (parent, args, context) => context.prisma.user({ id: parent.id }).posts(),
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (request) => ({
    ...request,
    prisma,
  }),
});

server.start(
  () => console.log('Server is running on http://localhost:4000')
);
