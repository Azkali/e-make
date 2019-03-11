import { castArray, compact, Dictionary, mapValues, values } from 'lodash';
import nodemailer from 'nodemailer';
import { assign } from 'nodemailer/lib/shared';
import numeral from 'numeral';
import nunjucks from 'nunjucks';
import { join, resolve as pathResolve } from 'path';

import { inspect } from 'util';
import { logger } from './logger';

import { IBackConfig } from '../cross/config/config-types';
import { backConfig } from '../cross/config/environments/loader';
import { makeAbsoluteUrl } from '../cross/config/utils';
import { IQuote } from '../cross/models';

const env = new nunjucks.Environment(
	new nunjucks.FileSystemLoader(
		pathResolve( __dirname, '../templates' ),
		{ noCache: !backConfig.common.production },
	),
	{ autoescape: true, trimBlocks: true, noCache: !backConfig.common.production },
);

env.addFilter( 'fitPad', ( input: unknown, size: number, { pad = ' ', keepWord = true, ellipsis = '...' } = {} ) => {
	const str = `${input}`;
	if ( str.length + ellipsis.length > size ) {
		return ( env.getFilter( 'truncate' ) as any )( str, size, keepWord, ellipsis );
	} else {
		return str + pad.repeat( size - str.length );
	}
} );
const defaultFormat = '$0,0.00';
env.addFilter( 'currency', ( value: number, format?: string ) => {
	if ( !format ) {
		format = defaultFormat;
	}
	return numeral( value ).format( format );
} );

const generateTransport = async ( mailerConfig: IBackConfig.IMailConfig.IMailAccountConfig ) => nodemailer.createTransport( {
	host: mailerConfig.host,
	port: mailerConfig.port || 587,
	 // true for 465, false for other ports
	secure: false,

	auth: {
		pass: mailerConfig.password,
		user: mailerConfig.user,
	},
	tls: {
		rejectUnauthorized: false,
	},
} );
const generateTestTransport = async () =>
	new Promise<nodemailer.Transporter>( ( resolve, reject ) =>
		nodemailer.createTestAccount( ( err, account ) => {
			if ( err ) {
				return reject( err );
			}

			// create reusable transporter object using the default SMTP transport
			return resolve( nodemailer.createTransport( {
				host: 'smtp.ethereal.email',
				port: 587,
				// true for 465, false for other ports
				secure: false,

				auth: {
					pass: account.pass,  // generated ethereal password
					user: account.user, // generated ethereal user
				},
			} ) );
		 } ) );

const getEnvTransport = async () => backConfig.mail.smtpAuth ?
	generateTransport( backConfig.mail.smtpAuth ) :
	generateTestTransport();

const generateSenderLine = ( name: string, email: string ) =>
	`"${name}" <${email}>`;

const sendMail = async ( transport: nodemailer.Transporter, to: IBackConfig.IMailConfig.IMailAddress[], templateName: string, templateArgs: Dictionary<any> ) => {
	const preparedTemplateArgs = assign( { config: backConfig.common, makeAbsoluteUrl }, templateArgs ) as Dictionary<any>;
	preparedTemplateArgs.title = env.render( join( templateName, 'subject.txt' ), preparedTemplateArgs ).trim();
	// tslint:disable-next-line: no-console
	console.log( inspect( preparedTemplateArgs, { colors: true, depth: 15 } ) );

	// Render all templates
	const mailOptions = {
		from: generateSenderLine( backConfig.mail.mailBot.name, backConfig.mail.mailBot.email ),
		to: values( mapValues( to, ( { name, email } ) => generateSenderLine( name, email ) ) ),

		subject: preparedTemplateArgs.title,

		html: env.render( join( templateName, 'mail.html' ), preparedTemplateArgs ).trim(),
		text: env.render( join( templateName, 'mail.txt' ), preparedTemplateArgs ).trim(),
	};
	try {
		const resInfos = await new Promise<any>( ( resolve, reject ) =>
			transport.sendMail( mailOptions, ( err, info ) => err ? reject( err ) : resolve( info ) ) );
		const recipients = castArray( mailOptions.to ).join( ', ' );
		const previewUrl = nodemailer.getTestMessageUrl( resInfos );
		logger.debug( `Succesfully sent mail "${mailOptions.subject}" to ${recipients}.` +
			( backConfig.mail.smtpAuth ? '' : ` Preview url: ${previewUrl}` ) );
		return resInfos;
	} catch ( e ) {
		logger.error( 'An error occured while sending a mail:', e.message );
		throw e;
	}
};

export const sendQuoteMails = async ( quote: IQuote, copyToUser: boolean ) => {
	const transport = await getEnvTransport();
	await Promise.all( compact( [
		sendQuoteMailToAdmin( quote, transport ),
		copyToUser ? sendQuoteMailToUser( quote, transport ) : undefined,
	] ) );
	transport.close();
};
export const sendQuoteMailToAdmin = async ( quote: IQuote, transport: nodemailer.Transporter ) =>
	sendMail( transport, backConfig.mail.quoteRecipients, 'quote-admin', { quote } );
export const sendQuoteMailToUser = async ( quote: IQuote, transport: nodemailer.Transporter ) =>
	sendMail( transport, [{ email: quote.billing.email, name: `${quote.billing.firstname} ${quote.billing.lastname}` }], 'quote-user', { quote } );
