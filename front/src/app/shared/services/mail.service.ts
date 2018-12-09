import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import * as $ from 'jquery';
import { Diaspora, EFieldType } from '@diaspora/diaspora';

(window as any).Diaspora = Diaspora;

@Injectable()
export class MailService {
    private ContactMail: any;

    constructor() {
        console.log(environment);
        const apiUrl = (<any>environment).api.url as string;
        const apiSegments = apiUrl.match(/^(?:(https?):\/\/)?(.+?)(?::(\d+))?(\/.*)$/) as RegExpMatchArray;


        Diaspora.createNamedDataSource(
            'main',
            'wepApi', // =====> webApi <======3
            {
                scheme: apiSegments[1],
                host: apiSegments[2],
                port: apiSegments[3],
                path: apiSegments[4],
            });
        this.ContactMail = Diaspora.declareModel('ContactMailAzkali', {
            sources: 'main',
            attributes: {
                recaptcha: {
                    type: EFieldType.STRING,
                    required: true,
                },
                senderMail: {
                    type: EFieldType.STRING,
                    required: true,
                },
                senderName: {
                    type: EFieldType.STRING,
                    required: true,
                },
                senderCategory: {
                    type: EFieldType.STRING,
                    required: true,
                    enum: ['pro', 'part'],
                },
                message: {
                    type: EFieldType.STRING,
                    required: true,
                },
            },
        });
        console.log(this.ContactMail);
    }

    sendMail(mail: {
        email: string,
        name: string,
        type: string,
        message: string,
    }, recaptcha: string) {
        const remappedMail = {
            senderMail: mail.email,
            senderName: mail.name,
            senderCategory: mail.type,
            message: mail.message,
            recaptcha: recaptcha,
        };
        return this.ContactMail.spawn(remappedMail).persist();
    }
}
