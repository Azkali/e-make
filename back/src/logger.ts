import {createLogger, format, transports, Logger} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { resolve } from 'path';
import { Diaspora } from '@diaspora/diaspora';
import { NodeLogger } from '@diaspora/diaspora/dist/types/logger/nodeLogger';

const baseLogDir = process.env.LOG_DIRECTORY || resolve( __dirname, 'logs' );

const diasporaLogger = ( ( Diaspora.logger as any ).logger as Logger );
diasporaLogger.configure( {
	level: 'silly',
	format: format.combine( format.timestamp(), format.json() ),
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log` 
		// - Write all logs error (and below) to `error.log`.
		//
		new DailyRotateFile( {
			filename: resolve( baseLogDir, 'diaspora-%DATE%', 'error.log' ),
			level: 'error',
			zippedArchive: true,
			maxSize: '100m',
			maxFiles: '60d',
		} ),
		new DailyRotateFile( {
			filename: resolve( baseLogDir, 'diaspora-%DATE%', 'combined.log' ),
			zippedArchive: true,
			maxSize: '50m',
			maxFiles: '14d',
		} ),
	],
} );
export const logger = createLogger( {
	level: 'silly',
	format: format.combine( format.timestamp(), format.json() ),
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log` 
		// - Write all logs error (and below) to `error.log`.
		//
		new DailyRotateFile( {
			filename: resolve( baseLogDir, 'app-%DATE%', 'error.log' ),
			level: 'error',
			zippedArchive: true,
			maxSize: '100m',
			maxFiles: '60d',
		} ),
		new DailyRotateFile( {
			filename: resolve( baseLogDir, 'app-%DATE%', 'combined.log' ),
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
	const consoleTransport = new transports.Console( {
		format: format.combine(
			format.colorize(),
			format.simple(),
			format.printf( info => `${info.timestamp} ${info.level}: ${info.message}` )
		),
	} );
	diasporaLogger.add( consoleTransport );
	logger.add( consoleTransport );
}
