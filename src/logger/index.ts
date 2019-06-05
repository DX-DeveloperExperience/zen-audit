import { createLogger, format, transports } from 'winston';

/**
 * To log anything, just import 'logger' from './logger/logger.servie'
 *  and then use : logger.info(), logger.error(), etc
 * Provide methods to log any type of informations: `info()`, `warn()`, `error()`...
 */
export const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(info => `[${info.level}]: ${info.message}`),
  ),
  transports: [new transports.Console()],
});
