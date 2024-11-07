// deno-lint-ignore-file no-explicit-any
export * from "./ArrayProcess.ts";
export * from "./Consts.ts";
export * from "./CustomEvents.ts";
export * from "./Environment.ts";
export * from "./Functions.ts";
export * from "./Lights.ts";
export * from "./Map.ts";
export * from "./Objects.ts";
export * from "./Optimizers.ts";
export * from "./Types.ts";

// Functions stolen from ReMapper >:)

export function copy<T>(obj: T): T {
	if (obj === null || typeof obj !== "object") {
		return obj;
	}

	const newObj = Array.isArray(obj) ? [] : {};
	const keys = Object.getOwnPropertyNames(obj);

	keys.forEach(x => {
		const value = copy((obj as any)[x]);
		(newObj as any)[x] = value;
	});

	Object.setPrototypeOf(newObj, obj as any);
	return newObj as T;
}

/**
 * Checks if an object is empty.
 * @param o Object to check.
 */
export function isEmptyObject(o: Record<string, any>) {
	if (typeof o !== "object") return false;
	return Object.keys(o).length === 0;
}

/**
 * Delete empty objects/arrays from an object recursively.
 * @param obj Object to prune.
 */
export function jsonPrune(obj: Record<string, any>) {
	Object.keys(obj).forEach(prop => {
		if (obj[prop] == null) {
			delete obj[prop];
			return;
		}
		const type = typeof obj[prop];
		if (type === "object") {
			if (Array.isArray(obj[prop])) {
				if (obj[prop].length === 0) {
					delete obj[prop];
				}
			} else {
				jsonPrune(obj[prop]);
				if (isEmptyObject(obj[prop])) {
					delete obj[prop];
				}
			}
		} else if (type === "string" && obj[prop].length === 0) {
			delete obj[prop];
		}
	});
}

export class TwoWayMap {
	private reverseMap: Record<any, any>;
	/**
	 * This is an internal class used by Lite-Mapper, most mapping cases will not require this class.
	 */
	constructor(private map: Record<any, any>) {
		this.map = map;
		this.reverseMap = {};
		for (const key in map) {
			const value = map[key];
			this.reverseMap[value] = key;
		}
	}
	get(key: any) {
		return this.map[key];
	}
	revGet(key: any) {
		return this.reverseMap[key];
	}
}
