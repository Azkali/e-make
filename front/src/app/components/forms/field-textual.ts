import { EControlType } from './field-base';
import { IFieldInput, StringInputType } from './field-input';

export interface IFieldTextual extends IFieldInput<string> {
	controlType: EControlType.Input;
	type: StringInputType;
	validations?: {
		minLength?: number;
		maxLength?: number;
		pattern?: string | RegExp;
	};
}
