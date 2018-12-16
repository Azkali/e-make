export interface IEntry {
	path: string;
	type: string;
}

export interface IRepositoryTreeResponse {
	tree: IEntry[];
}
