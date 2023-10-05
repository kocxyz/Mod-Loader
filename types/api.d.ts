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
