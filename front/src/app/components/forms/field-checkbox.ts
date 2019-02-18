import { EControlType } from './field-base';
import { IFieldInput } from './field-input';

export interface IFieldCheckbox extends IFieldInput<boolean> {
	controlType: EControlType.Input;
	type: 'checkbox';
}
