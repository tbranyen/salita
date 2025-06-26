declare function lookupDistTags(name: string): Promise<[prefix: string, distTags: Record<string, salita.Version>]>;

declare namespace salita {
	export type DepKey =
		| 'dependencies'
		| 'devDependencies'
		| 'peerDependencies'
		| 'bundledDependencies'
		| 'optionalDependencies';

	export type Version = `${'v' | ''}${number}.${number}.${number}`;

	export type Options = {
		'dry-run'?: boolean;
		'json'?: boolean;
		'ignore-pegged'?: boolean;
		'ignore-stars'?: boolean;
		'only-changed'?: boolean;
	};

	export type LookupDistTags = typeof lookupDistTags;

	export type Result = {
		after: string;
		before: string;
		error?: Error;
		isChanged: boolean;
		isUpdateable: boolean;
		isStar?: boolean;
		isPegged?: boolean;
		name: string;
	};
}

declare function salita(dir: string, options: salita.Options): Promise<[number, number][]>;

export = salita;
