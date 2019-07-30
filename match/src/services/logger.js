const _ = require('lodash');
const path = require('path');
const winston = require('winston');

const transports = [];

let logFolder;

const customLevels = {
  levels: {
    error: 0,
    info: 1,
    request: 2,
    sql: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    info: 'yellow',
    request: 'cyan',
    sql: 'magenta',
    debug: 'green'
  }
};

winston.request = _.partial(winston.log, 'request');
winston.sql = _.partial(winston.log, 'sql');

transports.push(new (winston.transports.Console)({
  level: 'debug',
  colorize: true,
  timestamp: true,
  handleExceptions: true,
  humanReadableUnhandledException: true
}));

winston.configure({
  transports,
  levels: customLevels.levels,
  colors: customLevels.colors
});


module.exports = winston;
