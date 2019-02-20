export enum EControlType {
	Input = 'Input',
	Dropdown = 'Dropdown',
	Textarea = 'Textarea',
}

export interface IFieldBase<T> {
	value: T;
	label: string;
	required: boolean;
	order: number;
	controlType: EControlType;
}
