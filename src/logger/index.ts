import { createLogger, format, transports } from 'winston';

/**
 * To log anything, just import 'logger' from './logger/logger.servie'
 *  and then use : logger.info(), logger.error(), etc
 * Provide methods to log any type of informations: `info()`, `warn()`, `error()`, `debug()`...
 */
export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(info => {
      let stackTrace = '';
      if (logger.level === 'debug') {
        stackTrace = '\n' + info.stack;
      }
      return `[${info.level}]: ${info.message} ${stackTrace}`;
    }),
  ),
  transports: [new transports.Console()],
});
