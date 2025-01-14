import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:standard', // Include timestamps
      ignore: 'pid,hostname', // Ignore pid and hostname in logs
    },
  },
});

export {logger};
