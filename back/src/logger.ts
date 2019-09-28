import { assign } from 'lodash';
import { resolve } from 'path';
import { createLogger, format, Logger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const baseLogDir = process.env.LOG_DIRECTORY || resolve( __dirname, 'logs' );

const rotateErrBase = {
	level: 'error',
	maxFiles: '60d',
	maxSize: '100m',
	zippedArchive: true,
};
const rotateCombBase = {
	maxFiles: '14d',
	maxSize: '50m',
	zippedArchive: true,
};
const generateDailyRotateLoggers = ( prefix: string, isErrorHandler = false ) => [
	//
	// - Write to all logs with level `info` and below to `combined.log`
	// - Write all logs error (and below) to `error.log`.
	//
	new DailyRotateFile( assign( { filename: resolve( baseLogDir, `${prefix}-%DATE%`, 'error.log' ), handleExceptions: isErrorHandler }, rotateErrBase ) ),
	new DailyRotateFile( assign( { filename: resolve( baseLogDir, `${prefix}-%DATE%`, 'combined.log' ) }, rotateCombBase ) ),
];

export const logger = createLogger( {
	exitOnError: false,
	format: format.combine( format.timestamp(), format.json() ),
	level: 'silly',
	transports: generateDailyRotateLoggers( 'app', true ),
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
			format.printf( info => `${info.timestamp} ${info.level}: ${info.message}` ),
		),
	} );
	logger.add( consoleTransport );
}
