import {createLogger, format, transports} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { resolve } from 'path';

const baseLogDir = process.env.LOG_DIRECTORY || resolve( __dirname, 'logs' );

export const logger = createLogger( {
	level: 'silly',
	format: format.combine( format.timestamp(), format.json() ),
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log` 
		// - Write all logs error (and below) to `error.log`.
		//
		new DailyRotateFile( {
			filename: resolve( baseLogDir, '%DATE%', 'error.log' ),
			level: 'error',
			zippedArchive: true,
			maxSize: '100m',
			maxFiles: '60d',
		} ),
		new DailyRotateFile( {
			filename: resolve( baseLogDir, '%DATE%', 'combined.log' ),
			zippedArchive: true,
			maxSize: '50m',
			maxFiles: '14d',
		} ),
	],
} );

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if ( process.env.NODE_ENV !== 'production' ) {
	logger.add( new transports.Console( {
		format: format.combine(
			format.colorize(),
			format.simple(),
			format.printf( info => `${info.timestamp} ${info.level}: ${info.message}` )
		),
	} ) );
}
