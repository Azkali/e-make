import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IFieldBase, EControlType } from '~components/forms/field-base';
import { IFieldDropdown } from '~components/forms/field-dropdown';
import { IFieldInput } from '~components/forms/field-input';

@Component( {
	selector: 'app-field',
	templateUrl: './field.component.html',
	styleUrls: ['./field.component.scss'],
} )
export class FieldComponent {
	@Input() public field: IFieldBase<any>;
	@Input() public form: FormGroup;

	public EControlType = EControlType;

	public get isValid() {
		return this.form.controls[this.field.key].valid;
	}

	public get fieldInput() {
		if ( this.field.controlType !== EControlType.Input ) {
			throw new Error( `Can't cast a ${this.field.controlType} as an Input` );
		}
		return this.field as IFieldInput;
	}

	public get fieldDropdown() {
		if ( this.field.controlType !== EControlType.Dropdown ) {
			throw new Error( `Can't cast a ${this.field.controlType} as a Dropbox` );
		}
		return this.field as IFieldDropdown;
	}
}
