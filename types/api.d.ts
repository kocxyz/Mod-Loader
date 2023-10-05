declare module 'config' {
  class Configuration {
    getProperty<T>(property: string, fallback: T): T;
    hasProperty(property: string): boolean;
  }

  namespace config {
    function createDefault(name: string, content: Object): boolean;
    function read(name: string): Configuration;
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
