declare module 'accessories' {
  namespace accessories {
    /**
     * Add a new Player Icon to the Game.
     *
     * @param guid A new GUID for the Item.
     * @param name The name of the Player Icon.
     * @param rarity The rarity if the Player Icon.
     * @param icon The Icon asset.
     * @param inInitialInventory If the item should be available for everyone.
     */
    function addPlayerIcon(
      guid: `${string}-${string}-${string}-${string}`,
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
    [model in import('.pnpm/@prisma+client@5.4.1_prisma@5.4.1/node_modules/.prisma/client').Prisma.TypeMap['meta']['modelProps']]: import('.pnpm/@prisma+client@5.4.1_prisma@5.4.1/node_modules/.prisma/client').PrismaClient[model];
  };

  export default database;
}

declare module 'json' {
  namespace json {
    /**
     * Converts a value to a JSON string.
     *
     * @param value The value to convert.
     */
    function stringify(value: any): string;
    /**
     * Parses a JSON string.
     *
     * @param value The JSON string to parse.
     */
    function parse(value: string): any;
  }

  export default json;
}

declare module 'permissions' {
  namespace permissions {
    /**
     * Check if a certain permission is granted.
     *
     * @param value The permission name.
     *
     * @returns Wheather the the permission is granted or not.
     */
    function hasPermission(value: import('../src/index').ModPermission): boolean;
  }

  export default permissions;
}

declare module 'config' {
  namespace config {
    /**
     * Create a default configuration if it doesn't exist.
     *
     * @param name The name of the configuration.
     * @param content The content of the configuration.
     *
     * @return If the default configuration was created.
     */
    function createDefault<T extends object>(name: string, content: T): boolean;
    /**
     * Read a configuration.
     *
     * @param name The name of the configuration.
     *
     * @returns The configuration content or `undefined` if configuration doesn't exist.
     */
    function read<T extends object>(name: string): T | undefined;
  }

  export default config;
}

declare module 'logging' {
  namespace logging {
    /**
     * Debug log message.
     *
     * @param message The message to log.
     */
    function debug(message: string): void;
    /**
     * Info log message.
     *
     * @param message The message to log.
     */
    function info(message: string): void;
    /**
     * Warning log message.
     *
     * @param message The message to log.
     */
    function warn(message: string): void;
    /**
     * Error log message.
     *
     * @param message The message to log.
     */
    function error(message: string): void;
  }

  export default logging;
}
