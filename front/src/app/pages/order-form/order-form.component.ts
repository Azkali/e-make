import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isObject, assign, mapValues, values, omitBy, isNil, isEqual } from 'lodash';
import { Raw } from '@diaspora/diaspora/dist/types/types/modelDescription';

import { EControlType, IFieldBase } from '~app/components/forms/field-base';
import { FormService } from '~app/services/form/form.service';
import { IFieldInput } from '~app/components/forms/field-input';
import { IFieldDropdown } from '~app/components/forms/field-dropdown';

import { address, IAddress } from '~models/address';
import { addressFormExtra } from '~app/models/address-form';

type AddressFields = {[prop in keyof IAddress]: IFieldBase<any>};

@Component( {
	selector: 'app-order-form',
	templateUrl: './order-form.component.html',
	styleUrls: ['./order-form.component.scss'],
} )
export class OrderFormComponent {
	public fieldsBilling: AddressFields;
	public formBilling: FormGroup;

	public fieldsShipping: AddressFields;
	public formShipping: FormGroup;

	public isSync = true;

	public constructor( private formService: FormService ) {
		const remappedFields = omitBy( mapValues( address, ( propType, propName ) => {
			const extras = addressFormExtra[propName];
			if ( !extras ) {
				return;
			}
			const propDesc: Raw.ObjectFieldDescriptor = !isObject( propType ) ?
				{type: propType} as Raw.ObjectFieldDescriptor :
				propType as Raw.ObjectFieldDescriptor;

			if ( propDesc.enum ) {
				return {
					value: '',
					key: propName,
					label: extras.label,
					required: propDesc.required,
					order: 1,
					controlType: EControlType.Dropdown,
					type: extras.controlType,
					options: extras.options,
				} as IFieldDropdown;
			} else {
				return {
					value: '',
					key: propName,
					label: extras.label,
					required: propDesc.required,
					order: 1,
					controlType: EControlType.Input,
					type: extras.controlType,
					validations: extras.validation,
				} as IFieldInput;
			}
		} ),                           isNil ) as any as AddressFields;

		this.fieldsBilling = mapValues( remappedFields, v => assign( {}, v ) ) as AddressFields;
		this.formBilling = this.formService.toFormGroup( values( remappedFields ) );

		this.fieldsShipping = mapValues( remappedFields, v => assign( {}, v ) ) as AddressFields;
		this.formShipping = this.formService.toFormGroup( values( remappedFields ) );

		// Bind inject billing to shipping
		this.formBilling.valueChanges.subscribe( v => {
			if ( this.isSync ) {
				this.formShipping.patchValue( v, {emitEvent: false} );
			}
		} );
		this.formShipping.valueChanges.subscribe( v => {
			this.isSync = isEqual( v, this.formBilling.value );
		} );
	}

	public send() {
		console.log( 'Sending form' );
	}
}
