declare module 'accessories' {
  namespace accessories {
    function addPlayerIcon(
      guid: string,
      name: string,
      rarity: string,
      icon: { path: string; extension: string },
      inInitialInventory?: boolean
    ): string;
  }

  export default accessories;
}

declare module 'database' {
  let database: {
    [model in import('../node_modules/.pnpm/@prisma+client@5.4.1_prisma@5.4.1/node_modules/.prisma/client/index').Prisma.TypeMap['meta']['modelProps']]: import('../node_modules/.pnpm/@prisma+client@5.4.1_prisma@5.4.1/node_modules/.prisma/client/index').PrismaClient[model];
  };

  export default database;
}

declare module 'json' {
  namespace json {
    function stringify(value: any): string;
    function parse(value: string): any;
  }

  export default json;
}

declare module 'permissions' {
  namespace permissions {
    function hasPermission(value: string): boolean;
  }

  export default permissions;
}

declare module 'config' {
  namespace config {
    function createDefault<T extends object>(name: string, content: T): boolean;
    function read<T extends object>(name: string): T | undefined;
  }

  export default config;
}

declare module 'logging' {
  namespace logging {
    function debug(message: string): void;
    function info(message: string): void;
    function warn(message: string): void;
    function error(message: string): void;
  }

  export default logging;
}
