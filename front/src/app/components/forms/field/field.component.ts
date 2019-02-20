import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AnyInput, EControlType, IFieldDropdown, IFieldTextarea } from '~app/components/forms';
import { IFieldTextual } from '../field-textual';
import { IFieldCheckbox } from '../field-checkbox';

@Component( {
	selector: 'app-field',
	templateUrl: './field.component.html',
	styleUrls: ['./field.component.scss'],
} )
export class FieldComponent {
	@Input() public field: AnyInput;
	@Input() public key: string;
	@Input() public form: FormGroup;

	public EControlType = EControlType;

	public get invertLabelAndInput() {
		return this.field.controlType === EControlType.Input &&
			( this.fieldInput.type === 'checkbox' || this.fieldInput.type === 'radio' );
	}

	public get isValid() {
		return this.form.controls[this.key].valid;
	}

	public get fieldInput() {
		if ( this.field.controlType !== EControlType.Input ) {
			throw new Error( `Can't cast a ${this.field.controlType} as an Input` );
		}
		return this.field as IFieldTextual | IFieldCheckbox;
	}

	public get fieldTextual() {
		const input = this.fieldInput;
		if ( input.type === 'checkbox' ) {
			throw new Error( "Can't cast a checkbox as a textual input" );
		}

		return this.field as IFieldTextual;
	}

	public get fieldDropdown() {
		if ( this.field.controlType !== EControlType.Dropdown ) {
			throw new Error( `Can't cast a ${this.field.controlType} as a Dropbox` );
		}
		return this.field as IFieldDropdown;
	}

	public get fieldTextarea() {
		if ( this.field.controlType !== EControlType.Textarea ) {
			throw new Error( `Can't cast a ${this.field.controlType} as a Textarea` );
		}
		return this.field as IFieldTextarea;
	}
}
