const query = {
  info: () => 'This is the API of a Hackernews Clone',
  feed: (root, args, context) => context.prisma.links(),
  link: (_, args) => links.find(
    (link) => link.id === parseInt(args.id, 10)
  ),
  users: (root, args, context) => context.prisma.users(),
};

module.exports = query;