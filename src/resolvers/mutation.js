const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, getUserId } = require('../utils');

const feedMutations = {
  feed: (root, args, context) => ({
    add: ({ input }) => {
      const userId = getUserId(context);

      return context.prisma.createLink({
        description: input.description,
        url: input.url,
        author: {
          connect: {
            id: userId
          }
        }
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
};

const userMutations = {
  user: (root, arg, context) => ({
    signup: async ({ input }) => {
      const hashedPassword = bcrypt.hashSync(input.password, 10);

      const user = await context.prisma.createUser({
        name: input.name,
        email: input.email,
        password: hashedPassword,
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      return {
        token,
        user: user,
      };
    },
    login: async ({ input }) => {
      const user = await context.prisma.user({ email: input.email });

      if (!user) {
        throw new Error('Email or password incorrect!');
      }

      const checkPassword = bcrypt.compareSync(input.password, user.password);

      if (!checkPassword) {
        throw new Error('Email or password incorrect!');
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      return {
        token,
        user: user,
      };
    },
  }),
}

const mutation = {
  ...feedMutations,
  ...userMutations,
};

module.exports = mutation;