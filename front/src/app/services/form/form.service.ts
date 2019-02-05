import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Dictionary } from 'lodash';

import { IFieldBase } from '~app/components/forms/field-base';

@Injectable( {
	providedIn: 'root',
} )
export class FormService {
	public constructor() { }

	public toFormGroup( fields: Array<IFieldBase<any>> ) {
		console.log( fields );
		return new FormGroup( fields.reduce( ( acc, field ) => {
			acc[field.key] = field.required ? new FormControl( field.value || '', Validators.required )
			: new FormControl( field.value || '' );
			return acc;
		},                                   {} as Dictionary<FormControl | undefined> ) );
	}
}
