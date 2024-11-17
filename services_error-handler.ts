import winston from 'winston';

class ErrorHandler {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple(),
      }));
    }
  }

  logError(error: Error, context?: any) {
    this.logger.error({
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  logInfo(message: string, data?: any) {
    this.logger.info(message, data);
  }

  logWarning(message: string, data?: any) {
    this.logger.warn(message, data);
  }
}

export const errorHandler = new ErrorHandler();