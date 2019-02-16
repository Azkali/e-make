import { IFieldCheckbox } from './field-checkbox';
import { IFieldDropdown } from './field-dropdown';
import { IFieldTextarea } from './field-textarea';
import { IFieldTextual } from './field-textual';

export * from './field-base';
export * from './field-checkbox';
export * from './field-dropdown';
export * from './field-textual';
export * from './field-textarea';

export type AnyInput = IFieldCheckbox | IFieldDropdown | IFieldTextarea | IFieldTextual;
