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
    function log(args: any): void;
  }

  export default logging;
}
