export enum EControlType {
	Input,
	Dropdown,
}

export interface IFieldBase<T> {
	value: T;
	key: string;
	label: string;
	required: boolean;
	order: number;
	controlType: EControlType;
}
