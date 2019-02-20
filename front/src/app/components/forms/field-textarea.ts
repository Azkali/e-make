import { IFieldBase, EControlType } from './field-base';

export interface IFieldTextarea extends IFieldBase<string> {
	controlType: EControlType.Textarea;
	validations?: {
		minLength?: number;
		maxLength?: number;
		pattern?: string | RegExp;
	};
}
