import { IFieldBase, EControlType } from './field-base';

export type StringInputType = 'text' | 'radio' | 'tel' | 'email';

export interface IFieldInput<T extends string | boolean> extends IFieldBase<T> {
	controlType: EControlType.Input;
	type: StringInputType | 'checkbox';
}
