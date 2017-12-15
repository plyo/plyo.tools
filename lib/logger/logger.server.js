import winston, { format } from 'winston'; // eslint-disable-line import/no-extraneous-dependencies
import path from 'path';

/**
 * @fileOverview
 *
 * here is the configs for winston, our logging library
 */

const Console = winston.transports.Console;
const File = winston.transports.File;

const logger = winston.createLogger({
  format: format.combine(
    format.splat(),
    format.simple(),
  ),
  transports: [
    new Console({
      level: 'verbose',
      handleExceptions: true,
    }),
  ],
});

export default logger;

/**
 * @param {Object} options
 * @param {Boolean} [options.useFileTransports=false]
 * @param {String} [options.consoleTransportLevel='verbose']
 * @param {String} [options.logstashTransportLevel='verbose']
 */
export function setup(options) {
  if (options.useFileTransports) {
    const dirname = path.resolve(path.dirname(require.main.filename), '../logs');
    logger
      .add(new File({
        name: 'all', // we need to specify names because we have two transports of the same type
        level: 'debug', // default max level is "info", we want to write "verbose" as well
        filename: 'all.log',
        dirname,
        maxsize: 1000000, // 1Mb
        maxFiles: 100,
        tailable: true, // the latest logs are always into `all.log`, older messages go to `all.1.log`, ..., `all.n.log`
        json: false, // it's too hard for human to read json-encoded sql requests
        handleExceptions: true,
      }))
      .add(new File({
        name: 'errors',
        filename: 'errors.log',
        dirname,
        level: 'error', // only errors go here. Useful for quick look on prod env etc.
        maxsize: 1000000, // 1Mb
        maxFiles: 100,
        tailable: true,
        json: false,
        handleExceptions: true,
      }))
      .add(new File({
        name: 'logstash',
        filename: 'logstash.log',
        dirname,
        level: options.logstashTransportLevel || 'verbose',
        maxsize: 1000000, // 1Mb
        maxFiles: 100,
        tailable: true,
        logstash: true,
        handleExceptions: true,
        format: format.logstash(),
      }));
  }

  if (options.consoleTransportLevel) {
    logger.transports[0].level = options.consoleTransportLevel;
  }
}
