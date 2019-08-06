import { createLogger, format, transports } from 'winston';
import * as Transport from 'winston-transport';
import winston = require('winston');
// import { ui } from '../utils/prompt';

/**
 * To log anything, just import 'logger' from './logger/logger.servie'
 *  and then use : logger.info(), logger.error(), etc
 * Provide methods to log any type of informations: `info()`, `warn()`, `error()`, `debug()`...
 */
export const logger = createLogger({
  level: 'info',
  // silent: true,
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(info => {
      let stackTrace = '';
      if (logger.level === 'debug' && info.stack !== undefined) {
        stackTrace = '\n' + info.stack;
      }
      return `\n[${info.level}]: ${info.message} ${stackTrace}\n`;
    }),
  ),
  transports: [new winston.transports.Console()],
});
