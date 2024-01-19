export interface SourceInfo {
	name: string;
	elements: SourceInfoElement[];
	description?: string;
}

export interface SourceInfoElement {
	type: string;
	name?: string;
	description?: string;
}
