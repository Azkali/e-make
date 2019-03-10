
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { transform } from 'lodash';

import { isBoolean } from 'util';
import { IFieldBase } from '~app/components/forms/field-base';

@Injectable( {
	providedIn: 'root',
} )
export class FormService {
	public constructor() { }

	public toFormGroup<TKeys extends string>( fields: {[key in TKeys]: IFieldBase<any>} ) {
		return new FormGroup( transform(
			fields,
			( acc, field: IFieldBase<any>, key ) => {
				const fieldVal = isBoolean( field.value ) ? field.value : ( field.value || '' );
				acc[key] = field.required ? new FormControl( fieldVal, Validators.required ) : new FormControl( fieldVal );
				return acc;
			},
			{} ) );
	}
}
