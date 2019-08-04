import express from 'express';
const SibApiV3Sdk = require( 'sib-api-v3-sdk' );
import { backConfig } from '../../cross/config/environments/loader';
import { IAddress } from '../../cross/models';

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = backConfig.mailingList.apiKey;

const createUser = async ( firstName: string, lastName: string, email: string, phone: string ) => {
	const createContact = {
		listIds: [ backConfig.mailingList.listId ],
		email,
		updateEnabled: true,
		attributes: {
			FIRSTNAME: firstName,
			LASTNAME: lastName,
			EMAIL: email,
			SMS: phone,
		},
	};

	const apiInstance = new SibApiV3Sdk.ContactsApi();

	const returnData = await apiInstance.createContact( createContact );
	console.log( 'API called successfully. Returned data: ', returnData );
};

export const subscribeUserToNewsletter = async ( req: express.Request ) => {
	const address: IAddress = ( req.body.address || req.body.billingAddress );
	await createUser( address.firstname, address.lastname, address.email, address.phone );
};
