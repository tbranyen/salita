declare function DistTagErrorback(error: Error, prefix?: never, distTags?: never): void;
declare function DistTagErrorback(error: null, prefix: string, distTags: Record<string, salita.Version>): void;
declare function lookupDistTags(name: string, callback: typeof DistTagErrorback): void;

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

	export type CB = (counts: Promise<[number, number][]>) => void;
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

declare function salita(dir: string, options: salita.Options, callback: salita.CB): void;

export = salita;
