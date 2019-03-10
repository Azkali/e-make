import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Raw } from '@diaspora/diaspora/dist/types/types/modelDescription';
import { assign, isEqual, isNil, isObject, mapValues, omit, omitBy, pick } from 'lodash';

import { IFieldCheckbox, IFieldDropdown, IFieldTextarea, IFieldTextual } from '~app/components/forms';
import { EControlType, IFieldBase } from '~app/components/forms/field-base';
import { FormService } from '~app/services/form/form.service';

import { BehaviorSubject } from 'rxjs';
import { first, retry, switchMap } from 'rxjs/operators';
import { addressFormExtra } from '~app/models/address-form';
import { ShopService } from '~app/services/shop/shop.service';
import { makeAbsoluteUrl } from '~cross/config/utils';
import { ECountryCode } from '~cross/models/countryCodes';
import { environment } from '~environments/environment';
import { address } from '~models/address';

interface IAddressFields {
	firstname: IFieldBase<string>;
	lastname: IFieldBase<string>;
	email: IFieldBase<string>;
	phone: IFieldBase<string>;
	addr1: IFieldBase<string>;
	addr2: IFieldBase<string>;
	city: IFieldBase<string>;
	postalCode: IFieldBase<string>;
	country: IFieldBase<ECountryCode>;
}
interface IExtraFields {
	copyToUser: IFieldCheckbox;
	subscribeNews: IFieldCheckbox;
	message: IFieldTextarea;
}
@Component( {
	selector: 'app-order-form',
	templateUrl: './order-form.component.html',
	styleUrls: ['./order-form.component.scss'],
} )
export class OrderFormComponent {
	public fieldsBilling: IAddressFields;
	public formBilling: FormGroup;

	public fieldsShipping: IAddressFields;
	public formShipping: FormGroup;

	public fieldsExtra: IExtraFields;
	public formExtra: FormGroup;

	public isSync = true;

	private readonly formSendStateSubject = new BehaviorSubject<boolean | undefined>( undefined );
	public formSendState = this.formSendStateSubject.asObservable();

	public copyToUser = true;
	public subscribeNews = false;
	public message = '';

	public readonly maxLength = 255;

	public constructor(
		private readonly formService: FormService,
		private readonly shopService: ShopService,
		private readonly httpClient: HttpClient,
		private readonly ref: ChangeDetectorRef ) {
		const remappedFields = omitBy( mapValues( address, ( propType, propName ) => {
			const extras = addressFormExtra[propName];
			if ( !extras ) {
				return;
			}
			const propDesc: Raw.ObjectFieldDescriptor = !isObject( propType ) ?
				{ type: propType } as Raw.ObjectFieldDescriptor :
				propType as Raw.ObjectFieldDescriptor;

			if ( propDesc.enum ) {
				return {
					value: '',
					label: extras.label,
					required: propDesc.required,
					order: 1,
					controlType: EControlType.Dropdown,
					options: extras.options,
				} as IFieldDropdown;
			} else {
				return {
					value: '',
					label: extras.label,
					required: propDesc.required,
					order: 1,
					controlType: EControlType.Input,
					type: extras.controlType,
					validations: extras.validation,
				} as IFieldTextual;
			}
		} ),                           isNil ) as any as IAddressFields;

		this.fieldsBilling = mapValues( remappedFields, v => assign( {}, v ) ) as IAddressFields;
		this.formBilling = this.formService.toFormGroup( remappedFields );

		this.fieldsShipping = mapValues( remappedFields, v => assign( {}, v ) ) as IAddressFields;
		this.formShipping = this.formService.toFormGroup( remappedFields );

		this.fieldsExtra = {
			copyToUser: {
				value: true,
				label: 'Send me a copy',
				required: false,
				order: 1,
				controlType: EControlType.Input,
				type: 'checkbox',
			} as IFieldCheckbox,
			subscribeNews: {
				value: false,
				label: 'Subscribe to our news !',
				required: false,
				order: 1,
				controlType: EControlType.Input,
				type: 'checkbox',
			} as IFieldCheckbox,
			message: {
				value: '',
				label: 'Leave a message',
				required: false,
				order: 1,
				controlType: EControlType.Textarea,
			} as IFieldTextarea,
		};
		this.formExtra = this.formService.toFormGroup( this.fieldsExtra );

		// Bind inject billing to shipping
		this.formBilling.valueChanges.subscribe( v => {
			if ( this.isSync ) {
				this.formShipping.patchValue( v, { emitEvent: false } );
			}
		} );
		this.formShipping.valueChanges.subscribe( v => {
			this.isSync = isEqual( v, this.formBilling.value );
		} );
		this.formSendState.subscribe( s => console.log( 'formSendState', s ) );
	}

	public send() {
		console.log( 'Sending form' );

		this.formSendStateSubject.next( undefined );
		this.ref.detectChanges();
		this.shopService.currentCart
			.pipe(
				first(),
				switchMap( cart => {
					const filteredCart = assign(
						omit( cart, ['totalCount', 'items'] ),
						{ items: cart.items
								.map( cartItem => assign(
									pick( cartItem, ['unitPrice', 'count'] ),
									{ item: pick( cartItem.item, ['attributeUid', 'productUid', 'attributesUids'] ) } ) ) },
					);

					const sendableData = assign(
						{ cart: filteredCart },
						this.formExtra.value,
						this.isSync ? {
							address: this.formBilling.value,
						} : {
							billingAddress: this.formBilling.value,
							shippingAddress: this.formShipping.value,
						},
					);
					console.log( sendableData );
					return this.httpClient.post<any>( `${makeAbsoluteUrl( environment.common.back )}/quote`, sendableData, { withCredentials: true } )
						.pipe(
							retry( 3 ),
							first() );
				} ),
			).subscribe( async success => {
				console.info( 'Success!', success );
				this.formSendStateSubject.next( true );
				await this.shopService.emptyCart();
				this.ref.detectChanges();
			},           error => {
				console.error( error );
				this.formSendStateSubject.next( false );
				this.ref.detectChanges();
			} );
	}
}
