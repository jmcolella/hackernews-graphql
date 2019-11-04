const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query: {
    info: () => 'This is the API of a Hackernews Clone',
    feed: (root, args, context) => context.prisma.links(),
    link: (_, args) => links.find(
      (link) => link.id === parseInt(args.id, 10)
    )
  },
  Mutation: {
    feed: (root, args, context) => ({
      add: ({ input }) => {
        return context.prisma.createLink({
          description: input.description,
          url: input.url
        });
      },
      update: ({ input }) => {
        return context.prisma.updateLink({
          data: {
            description: input.description,
            url: input.url
          },
          where: {
            id: input.id,
          },
        });
      },
      delete: ({ input }) => {
        return context.prisma.deleteLink({
          id: input.id,
        })
      }
    })
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
});

server.start(
  () => console.log('Server is running on http://localhost:4000')
);
