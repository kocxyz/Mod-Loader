declare module 'database' {
  let database: {
    [model in import('.pnpm/@prisma+client@5.4.1_prisma@5.4.1/node_modules/.prisma/client').Prisma.TypeMap['meta']['modelProps']]: import('.pnpm/@prisma+client@5.4.1_prisma@5.4.1/node_modules/.prisma/client').PrismaClient[model];
  };

  export default database;
}
