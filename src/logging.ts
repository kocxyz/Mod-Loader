import winston, { Logger } from 'winston';

const { combine, timestamp, printf } = winston.format;

const customFormat = printf(({ level, message, timestamp, moduleName }) => {
  return `[${moduleName}] ${timestamp} - ${level}: ${message}`;
});

// The base logger
const logger = winston.createLogger({
  format: combine(timestamp(), customFormat),
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: combine(timestamp(), customFormat),
      handleExceptions: true,
    }),
  ],
});

/**
 * Get the Logger for a module.
 *
 * @param name The name of the module
 *
 * @returns The Logger for the module
 */
const getLogger = function (name: string): Logger {
  // Create a child of the base logger with moduleName parameter
  return logger.child({ moduleName: name });
};

export default getLogger;
