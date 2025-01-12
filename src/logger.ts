import pino from 'pino';
import {pinoHttp} from 'pino-http';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:standard', // Include timestamps
      ignore: 'pid,hostname', // Ignore pid and hostname in logs
    },
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
    }),
  },
});

const httpLogger = pinoHttp({
  logger,
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
    }),
    res: (res) => ({
      id: res.id,
      method: res.method,
      url: res.url,
    }),
  },
  customSuccessMessage: function (req, res) {
    return `${req.method} - ${req.url} - ${res.statusCode}`;
  },
  customReceivedMessage: function (req, res) {
    return `${req.method} - ${req.url} - ${res.statusCode}`;
  },
  customErrorMessage: function (req, res, err) {
    return `${req.method} - ${req.url} - ${res.statusCode}`;
  },
});

export {logger, httpLogger};
