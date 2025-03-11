import { createLogger, format, transports } from 'winston';
const {combine,timestamp,json,errors} =format; 

const logger = createLogger({
    level: 'info',
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.Console(),
        new transports.File({ filename: 'combined.log' })
    ]
});

export { logger };