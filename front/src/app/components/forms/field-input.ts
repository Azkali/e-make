import { IFieldBase, EControlType } from './field-base';

export interface IFieldInput extends IFieldBase<string> {
	controlType: EControlType.Input;
	type: string;
	validations?: {
		minLength?: number;
		maxLength?: number;
		pattern?: string | RegExp;
	};
}
