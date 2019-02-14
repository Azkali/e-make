import nodemailer, { SendMailOptions } from 'nodemailer';
import { toPairs, map, castArray, mapValues, values } from 'lodash';
import { Entity } from '@diaspora/diaspora/dist/types';
import nunjucks from 'nunjucks';

import { logger } from './logger';
import { IQuote } from '../../cross/models';
import { backConfig } from '../../cross/config/local/back';
import { IMailAccountConfig, IMailAddress } from '../../cross/config/utils';
import { join, resolve } from 'path';

nunjucks.configure( resolve( __dirname, '../templates' ),  {
	autoescape: true,
	trimBlocks: true,
	noCache: !backConfig.common.production,
} );

const generateTransport = async ( mailerConfig: IMailAccountConfig ) => nodemailer.createTransport( {
	host: mailerConfig.host,
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

const getEnvTransport = async () => backConfig.common.production ?
	generateTransport( /* backConfig.host */ {} as any ) :
	generateTestTransport();


const generateSenderLine = ( name: string, email: string ) =>
	`"${name}" <${email}>`;
	
const sendMail = async ( transport: nodemailer.Transporter, to: IMailAddress[], templateName: string, templateArgs: any ) => {
	const mailOptions = {
		to: values( mapValues( to, ( { name, email } ) => generateSenderLine( name, email ) ) ),
		from: generateSenderLine( backConfig.mail.mailBot.name, backConfig.mail.mailBot.email ),
		subject: nunjucks.render( join( templateName, 'subject.txt' ), templateArgs ).trim(),
		text: nunjucks.render( join( templateName, 'mail.txt' ), templateArgs ).trim(),
		html: nunjucks.render( join( templateName, 'mail.html' ), templateArgs ).trim(),
	};
	try{
		const resInfos = await new Promise<any>( ( resolve,reject ) =>
			transport.sendMail( mailOptions, ( err, info ) => err ? reject( err ) : resolve( info ) ) );
		const recipients = castArray( mailOptions.to ).join( ', ' );
		const previewUrl = nodemailer.getTestMessageUrl( resInfos );
		logger.debug( `Succesfully sent mail "${mailOptions.subject}" to ${recipients}. Preview url: ${previewUrl}` );
		return resInfos;
	} catch ( e ){
		logger.error( 'An error occured while sending a mail:', e.message );
		throw e;
	}
};

export const sendQuoteMails = async ( quote: IQuote ) => {
	const transport = await getEnvTransport();
	const sentMails = await Promise.all( [
		sendQuoteMail( 'quote-admin', quote, transport ),
		sendQuoteMail( 'quote-user', quote, transport ),
	] );
	transport.close();
};
export const sendQuoteMail = async ( templateName: 'quote-admin' | 'quote-user', quote: IQuote, transport?: nodemailer.Transporter ) => {
	const defaultedTransport = transport ? transport : await getEnvTransport();
	const recipients = map( toPairs( backConfig.mail.quoteRecipients ), ( [name, email] ) => ( {name, email} ) );
	const infos = await sendMail( defaultedTransport, recipients, templateName, {quote} );
	if ( !transport ){
		defaultedTransport.close();
	}
	return infos;
};
