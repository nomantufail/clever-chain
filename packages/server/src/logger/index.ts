import { createLogger, transports, format } from 'winston';

export default createLogger({
  level: 'debug',
  transports: [
    new transports.File({
      dirname: "src/logger",
      filename: "errors.log",
    }),
  ],
  format: format.combine(format.colorize(), format.timestamp()),
});
