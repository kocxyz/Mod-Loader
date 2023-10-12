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
