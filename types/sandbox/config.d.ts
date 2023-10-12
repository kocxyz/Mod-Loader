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
