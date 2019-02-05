import { IFieldBase, EControlType } from './field-base';

export interface IFieldDropdown extends IFieldBase<string> {
	controlType: EControlType.Dropdown;
	options: Array<{label: string; value: string}>;
}
