const { GraphQLServer } = require('graphql-yoga');

let links = [
  {
    id: 1,
    description: 'Hello world',
    url: 'some-url',
  }
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => 'This is the API of a Hackernews Clone',
    feed: () => links,
    link: (_, args) => links.find(
      (link) => link.id === parseInt(args.id, 10)
    )
  },
  Mutation: {
    feed: () => ({
      add: ({ input }) => {
        const newLink = {
          id: ++idCount,
          description: input.description,
          url: input.url
        };

        links.push(newLink);

        return newLink;
      },
      update: ({ input }) => {
        links = links.map(
          (l) => {
            if (l.id === parseInt(input.id, 10)) {
              const updatedLink = {
                ...l,
                ...input,
                id: l.id
              };

              return updatedLink;
            }

            return l;
          }
        );

        return links.find(
          (l) => l.id === parseInt(input.id, 10)
        );
      },
      delete: ({ input }) => {
        const foundLink = links.find(
          (l) => l.id === parseInt(input.id, 10)
        );

        if (!foundLink) {
          return {};
        }

        links = links.filter(
          (l) => l !== foundLink
        );

        return foundLink;
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
});

server.start(
  () => console.log('Server is running on http://localhost:4000')
);
