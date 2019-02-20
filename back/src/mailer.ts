import nodemailer, { SendMailOptions } from 'nodemailer';
import { toPairs, map, castArray, mapValues, values, compact, Dictionary } from 'lodash';
import nunjucks from 'nunjucks';
import { join, resolve } from 'path';
import numeral from 'numeral';

import { logger } from './logger';
import { inspect } from 'util';

import { IQuote } from '../cross/models';
import { backConfig } from '../cross/config/environments/loader';
import { makeAbsoluteUrl } from '../cross/config/utils';
import { IBackConfig } from '../cross/config/config-types';

const env = new nunjucks.Environment(
	new nunjucks.FileSystemLoader(
		resolve( __dirname, '../templates' ),
		{ noCache: !backConfig.common.production }
	),
	{ autoescape: true, trimBlocks: true, noCache: !backConfig.common.production }
);

env.addFilter( 'fitPad', ( input: unknown, size: number, {pad = ' ', keepWord = true, ellipsis = '...'} = {} ) => {
	const str = `${input}`;
	if ( str.length + ellipsis.length > size ){
		return ( env.getFilter( 'truncate' ) as any )( str, size, keepWord, ellipsis );
	} else {
		return str + pad.repeat( size - str.length );
	}
} );
const defaultFormat = '$0,0.00';
env.addFilter( 'currency', ( value: number, format?: string ) => {
	if ( !format ){
		format = defaultFormat;
	}
	return numeral( value ).format( format );
} );


const generateTransport = async ( mailerConfig: IBackConfig.IMailConfig.IMailAccountConfig ) => nodemailer.createTransport( {
	host: mailerConfig.host,
	port: mailerConfig.port || 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: mailerConfig.user,
		pass: mailerConfig.password,
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
				secure: false, // true for 465, false for other ports
				auth: {
					user: account.user, // generated ethereal user
					pass: account.pass,  // generated ethereal password
				},
			} ) );
		 } ) );

const getEnvTransport = async () => backConfig.mail.smtpAuth ?
	generateTransport( backConfig.mail.smtpAuth ) :
	generateTestTransport();


const generateSenderLine = ( name: string, email: string ) =>
	`"${name}" <${email}>`;

const sendMail = async ( transport: nodemailer.Transporter, to: IBackConfig.IMailConfig.IMailAddress[], templateName: string, templateArgs: Dictionary<any> ) => {
	const preparedTemplateArgs = assign( {config: backConfig.common.back, makeAbsoluteUrl}, templateArgs ) as Dictionary<any>;
	preparedTemplateArgs.title = env.render( join( templateName, 'subject.txt' ), preparedTemplateArgs ).trim();
	console.log( inspect( preparedTemplateArgs, {colors: true, depth: 15} ) );

	// Render all templates
	const mailOptions = {
		to: values( mapValues( to, ( { name, email } ) => generateSenderLine( name, email ) ) ),
		from: generateSenderLine( backConfig.mail.mailBot.name, backConfig.mail.mailBot.email ),
		subject: preparedTemplateArgs.title,
		text: env.render( join( templateName, 'mail.txt' ), preparedTemplateArgs ).trim(),
		html: env.render( join( templateName, 'mail.html' ), preparedTemplateArgs ).trim(),
	};
	try{
		const resInfos = await new Promise<any>( ( resolve,reject ) =>
			transport.sendMail( mailOptions, ( err, info ) => err ? reject( err ) : resolve( info ) ) );
		const recipients = castArray( mailOptions.to ).join( ', ' );
		const previewUrl = nodemailer.getTestMessageUrl( resInfos );
		logger.debug( `Succesfully sent mail "${mailOptions.subject}" to ${recipients}.` +
			( backConfig.mail.smtpAuth ? '' : ` Preview url: ${previewUrl}` ) );
		return resInfos;
	} catch ( e ){
		logger.error( 'An error occured while sending a mail:', e.message );
		throw e;
	}
};

export const sendQuoteMails = async ( quote: IQuote, copyToUser: boolean ) => {
	const transport = await getEnvTransport();
	await Promise.all( compact( [
		sendQuoteMail( 'quote-admin', quote, transport ),
		copyToUser ? sendQuoteMail( 'quote-user', quote, transport ) : undefined,
	] ) );
	transport.close();
};
export const sendQuoteMail = async ( templateName: 'quote-admin' | 'quote-user', quote: IQuote, transport?: nodemailer.Transporter ) => {
	const defaultedTransport = transport ? transport : await getEnvTransport();
	const infos = await sendMail( defaultedTransport, backConfig.mail.quoteRecipients, templateName, {quote} );
	if ( !transport ){
		defaultedTransport.close();
	}
	return infos;
};
