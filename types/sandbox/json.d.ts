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
