// deno-lint-ignore-file no-explicit-any
import { ensureDir } from "https://deno.land/std@0.110.0/fs/ensure_dir.ts";
import { ensureFileSync } from "https://deno.land/std@0.110.0/fs/ensure_file.ts";
import { Seed } from "https://deno.land/x/seed@1.0.0/index.ts";
import * as ease from "./Easings.ts";
import { AnimateComponent, AnimateTrack, Arc, NumArr, AssignPathAnimation, AssignPlayerToTrack, AssignTrackParent, Bomb, Chain, Easing, Environment, LightEvent, LookupMethod, Note, Vec2, Vec3, Vec4, Wall, currentDiff, start, ye3 } from "./LiteMapper.ts";

/**
 * Filter through the notes in your map and make changes based on properties.
 * @param fake Whether to target fake notes.
 * @param condition The condition that notes must pass to be affected.
 * @param action The action to apply to passing notes.
 */
export function filterNotes(fake: boolean, condition: (x: Note) => boolean, action: (x: Note, i: number) => void) {
	if (fake) {
		currentDiff.fakeNotes.filter(x => condition(x)).forEach((x, i) => action(x, i));
	} else {
		currentDiff.notes.filter(x => condition(x)).forEach((x, i) => action(x, i));
	}
}

/**
 * Filter through the environments in your map and make changes based on properties.
 * @param condition The condition that environments must pass to be affected.
 * @param action The action to apply to passing environment.
 */
export function filterEnvironments(condition: (x: Environment) => boolean, action: (x: Environment, i: number) => void) {
	currentDiff.environments.filter(x => condition(x)).forEach((x, i) => action(x, i));
}

/**
 * Filter through the bombs in your map and make changes based on properties.
 * @param fake Whether to target fake bombs.
 * @param condition The condition that bombs must pass to be affected.
 * @param action The action to apply to passing bombs.
 */
export function filterBombs(fake: boolean, condition: (x: Bomb) => boolean, action: (x: Bomb, i: number) => void) {
	if (fake) {
		currentDiff.fakeBombs.filter(x => condition(x)).forEach((x, i) => action(x, i));
	} else {
		currentDiff.bombs.filter(x => condition(x)).forEach((x, i) => action(x, i));
	}
}

/**
 * Filter through the arcs in your map and make changes based on properties.
 * @param condition The condition that arcs must pass to be affected.
 * @param action The action to apply to passing arcs.
 */
export function filterArcs(condition: (x: Arc) => boolean, action: (x: Arc, i: number) => void) {
	currentDiff.arcs.filter(x => condition(x)).forEach((x, i) => action(x, i));
}

/**
 * Filter through the chains in your map and make changes based on properties.
 * @param fake Whether to target fake chains.
 * @param condition The condition that chains must pass to be affected.
 * @param action The action to apply to passing chains.
 */
export function filterChains(fake: boolean, condition: (x: Chain) => boolean, action: (x: Chain, i: number) => void) {
	if (fake) {
		currentDiff.fakeChains.filter(x => condition(x)).forEach((x, i) => action(x, i));
	} else {
		currentDiff.chains.filter(x => condition(x)).forEach((x, i) => action(x, i));
	}
}

/**
 * Filter through the walls in your map and make changes based on properties.
 * @param fake Whether to target fake walls.
 * @param condition The condition that walls must pass to be affected.
 * @param action The action to apply to passing walls.
 */
export function filterWalls(fake: boolean, condition: (x: Wall) => boolean, action: (x: Wall, i: number) => void) {
	if (fake) {
		currentDiff.fakeWalls.filter(x => condition(x)).forEach((x, i) => action(x, i));
	} else {
		currentDiff.walls.filter(x => condition(x)).forEach((x, i) => action(x, i));
	}
}

/**
 * Filter through the events in your map and make changes based on properties.
 * @param condition The condition that events must pass to be affected.
 * @param action The action to apply to passing events.
 */
export function filterEvents(condition: (x: LightEvent) => boolean, action: (x: LightEvent, i: number) => void) {
	currentDiff.events.filter(x => condition(x)).forEach((x, i) => action(x, i));
}

/**
 * Filter through the track animations in your map and make changes based on properties.
 * @param condition The condition that animations must pass to be affected.
 * @param action The action to apply to passing animations.
 */
export function filterTrackAnimations(condition: (x: AnimateTrack) => boolean, action: (x: AnimateTrack, i: number) => void) {
	currentDiff.customEvents?.forEach((e, i) => {
		if (e.type == "AnimateTrack") {
			if (condition(e as AnimateTrack)) {
				action(e as AnimateTrack, i);
			}
		}
	});
}

/**
 * Filter through the component animations in your map and make changes based on properties.
 * @param condition The condition that animations must pass to be affected.
 * @param action The action to apply to passing animations.
 */
export function filterComponentAnimations(condition: (x: AnimateComponent) => boolean, action: (x: AnimateComponent, i: number) => void) {
	currentDiff.customEvents?.forEach((e, i) => {
		if (e.type == "AnimateComponent") {
			if (condition(e as AnimateComponent)) {
				action(e as AnimateComponent, i);
			}
		}
	});
}

/**
 * Filter through the path animations in your map and make changes based on properties.
 * @param condition The condition that animations must pass to be affected.
 * @param action The action to apply to passing animations.
 */
export function filterPathAnimations(condition: (x: AssignPathAnimation) => boolean, action: (x: AssignPathAnimation, i: number) => void) {
	currentDiff.customEvents?.forEach((e, i) => {
		if (e.type == "AssignPathAnimation") {
			if (condition(e as AssignPathAnimation)) {
				action(e as AssignPathAnimation, i);
			}
		}
	});
}

/**
 * Multiply two rectangular or square matrices
 * @param mat1 The values for mat one (e.g., [[1,2,3],[4,5,6]])
 * @param mat2 The values for mat two (e.g., [[1,2],[3,4],[5,6]])
 */
function multiplymats(mat1: number[][], mat2: number[][]) {
	const md = [mat1.length, mat1[0].length],
		nd = [mat2.length, mat2[0].length];
	const res = new Array(md);
	for (let i = 0; i < md[0]; i++) res[i] = new Array(nd[1]);

	for (let i = 0; i < md[0]; i++) {
		for (let j = 0; j < nd[1]; j++) {
			res[i][j] = 0;

			for (let x = 0; x < md[1]; x++) {
				res[i][j] += mat1[i][x] * mat2[x][j];
			}
		}
	}
	return res;
}

/**
 * Rotate a vector based on euler rotations.
 * @param start The start position of the vector. The vector will be rotated around this position.
 * @param end The end position of the vecotr.
 * @param rotation The rotation to apply.
 * @returns Vec3
 */
export function rotateVector(start: Vec3, end: Vec3, rotation: Vec3) {
	rotation = rotation.map(x => (x * Math.PI) / 180) as Vec3;
	let pos: number[][] = [[end[0] - start[0]], [end[1] - start[1]], [end[2] - start[2]]];
	const xmat: number[][] = [
		[1, 0, 0],
		[0, Math.cos(rotation[0]), -Math.sin(rotation[0])],
		[0, Math.sin(rotation[0]), Math.cos(rotation[0])]
	];
	const ymat: number[][] = [
		[Math.cos(rotation[1]), 0, Math.sin(rotation[1])],
		[0, 1, 0],
		[-Math.sin(rotation[1]), 0, Math.cos(rotation[1])]
	];
	const zmat: number[][] = [
		[Math.cos(rotation[2]), -Math.sin(rotation[2]), 0],
		[Math.sin(rotation[2]), Math.cos(rotation[2]), 0],
		[0, 0, 1]
	];
	pos = multiplymats(zmat, pos);
	pos = multiplymats(xmat, pos);
	pos = multiplymats(ymat, pos);
	return [pos[0][0] + start[0], pos[1][0] + start[1], pos[2][0] + start[2]] as Vec3;
}

/**
 * Repeat some code a set number of times.
 * @param rep The number of times to repeat.
 * @param code The code to repeat.
 */
export function repeat(rep: number, code: (x: number) => void) {
	for (let i = 0; i < rep; i++) code(i);
}

/**
 * Create a new array from a function of x. e.g arrFromFunction(10, x => x * 2)
 * @param length The length of the array.
 * @param func The function to run through the array.
 */
export const arrFromFunction = (length: number, func: (x: number) => any) => Array.from(Array(length).keys()).map(x => func(x));

/**
 * Generate a random number.
 * @param min The minimun possible number to generate (inclusive).
 * @param max The maximum possible number to generate (exclusive).
 * @param seed The optional seed to apply to the generator (leave blank for random).
 * @param precision (Default - 3) The number of decimals in the random number. This can be negative to round to different values, e.g., -1 will round to the nearest 10, -2 will round to the nearest 100 etc.
 * @returns Random number.
 */
export function random(min: number, max: number, seed: number | string = Math.random(), precision = 3) {
	[min, max] = min > max ? [max, min] : [min, max];
	return Math.round(new Seed(seed.toString()).randomFloat(min, max) * Math.pow(10, precision)) / Math.pow(10, precision);
}

/**
 * Finds the rotation of an object at point1 so that it faces point2.
 * @param point1 The position of the object.
 * @param point2 Where the object should be facing.
 * @param defaultAngle The angle that determines where "forwards" is for the object, defaults to the +z axis. (i.e., player - [0,0,0], notes - [0,180,0], upwards facing lasers - [-90,0,0] etc.)
 * @returns Vec3 - The rotation for the object at point1.
 */
export function pointRotation(point1: Vec3, point2: Vec3, defaultAngle?: Vec3) {
	const vector = new NumArr(point2).subtract(point1),
		angle = [0, (180 * Math.atan2(vector[0], vector[2])) / Math.PI, 0],
		pitchPoint = rotateVector([0, 0, 0], vector, [0, -angle[1], 0]);
	angle[0] = (-180 * Math.atan2(pitchPoint[1], pitchPoint[2])) / Math.PI;
	if (defaultAngle) {
		return [angle[0] - defaultAngle[0], angle[1] - defaultAngle[1], angle[2] - defaultAngle[2]] as Vec3;
	} else {
		return angle as Vec3;
	}
}

/**
 * Copy map directory contents to another directory.
 * @param toDir The target directory to copy to.
 * @param extraFiles Any extra files to copy over.
 */
export async function copyToDir(toDir: string, extraFiles?: string[]) {
	await ensureDir(toDir);
	currentDiff.info.raw._difficultyBeatmapSets.forEach(x => {
		x._difficultyBeatmaps.forEach(y => {
			Deno.copyFileSync(y._beatmapFilename, toDir + "/" + y._beatmapFilename);
		});
	});
	const songName = currentDiff.info.raw._songFilename,
		coverName = currentDiff.info.raw._coverImageFilename;
	Deno.copyFileSync("info.dat", toDir + "/info.dat");
	Deno.copyFileSync(songName, toDir + "/" + songName);
	Deno.copyFileSync(coverName, toDir + "/" + coverName);
	if (extraFiles) {
		extraFiles.forEach(x => {
			Deno.copyFileSync(x, toDir + "/" + x);
		});
	}
	LMLog(`Copied map to ${toDir}...`);
}

/**
 * Calculates the time in ms from map init.
 */
export function runTime() {
	return Date.now() - start;
}

/**
 * Console log with prepended LM message.
 * @param message Message to log.
 * @param error Optional error level.
 */
export function LMLog(message: any, error?: "Warning" | "Error") {
	if (error == "Warning") {
		console.log(`\x1b[33m[Warning in LiteMapper: ${runTime()}ms] ${message}\x1b[37m`);
	} else if (error == "Error") {
		console.log(`\x1b[33m[Error in LiteMapper: ${runTime()}ms] ${message}\x1b[37m`);
	} else {
		console.log(`\x1b[37m[LiteMapper: ${runTime()}ms] ${message}\x1b[37m`);
	}
}

/**
 * Remove several objects from the environment at the same time.
 * @param lookup The lookup method to use.
 * @param ids The ids of the objects to remove.
 * @param hardRemove If true, objects will be removed using the `active` property. If false, objects will be removed using the `position` property.
 */
export function remove(lookup: LookupMethod, ids: string[], hardRemove?: boolean) {
	ids.forEach(i => {
		const env = new Environment().env(i, lookup);
		if (hardRemove) {
			env.active = false;
		} else {
			env.position = ye3;
		}
		env.push();
	});
}

/**
 * Interpolate between two numbers by a fraction, with optional easing.
 * @param start The start point.
 * @param end The end point.
 * @param fraction (0-1) The fraction between the start and end point.
 * @param easing The easing to use on the interpolation.
 */
export function lerp(start: number, end: number, fraction: number, easing: Easing = "easeLinear") {
	return ease[easing](fraction) * (end - start) + start;
}

/**
 * Access and modify the LM_Cache.
 * @param process Whether to read, write to, clear, or get the entries of the cache.
 *
 * * Read - If name is specified, returns the entry in the cache with that name. If name is unspecified, returns the contents of the entire cache.
 * * Write - If data is specified, writes that data to the named entry in the cache. If data is unspecified, deletes the named entry on the cache.
 * * Clear - **Avoid using this!** Completely wipes the contents of the cache.
 * * Entries - Returns an array of the adressable names in the cache.
 * @param name The name of the entry in the cache to access.
 * @param data The data to write (if write process is specified), if left undefined the property will be removed from the cache.
 */

export function LMCache(process: "Read" | "Write" | "Clear" | "Entries", name = "", data?: any) {
	const fileName = "LM_Cache.json";
	ensureFileSync(fileName);
	if (process == "Clear") {
		Deno.writeTextFileSync(fileName, JSON.stringify({}));
	} else {
		try {
			const raw = Deno.readTextFileSync(fileName),
				cache: Record<string, any> = JSON.parse(raw == "" ? "{}" : raw);
			if (process == "Write") {
				if (typeof data == "undefined") {
					delete cache[name];
				} else {
					cache[name] = data;
				}
			} else if (process == "Read") {
				return name == "" ? cache : cache[name];
			} else if (process == "Entries") {
				return Object.getOwnPropertyNames(cache);
			}
			Deno.writeTextFileSync(fileName, JSON.stringify(cache));
		} catch (e) {
			console.log(`Cache suffered from error, invalidating cache: ${e}`);
			LMCache("Clear");
		}
	}
}

/**
 * Creates the basic conditions for animating the player and notes over a period of time.
 * @param time The time to start the animation.
 * @param duration The duration of the animation.
 * @param playerTrack The name of the player track.
 * @param noteTrack The name of the track to assign the notes.
 * @returns Track animation for the player.
 */
export class PlayerAnim {
	constructor(time = 0, duration = 1, playerTrack = "player", noteTrack = "notes") {
		new AssignPlayerToTrack(playerTrack, time).push();
		new AssignTrackParent([noteTrack], playerTrack, time).push();
		filterNotes(
			false,
			x => x.time >= time && x.time < time + duration,
			x => {
				x.track = noteTrack;
			}
		);
		filterBombs(
			false,
			x => x.time >= time && x.time < time + duration,
			x => {
				x.track = noteTrack;
			}
		);
		filterChains(
			false,
			x => x.time >= time && x.time < time + duration,
			x => {
				x.track = noteTrack;
			}
		);
		filterArcs(
			x => x.time >= time && x.time < time + duration,
			x => {
				x.track = noteTrack;
			}
		);
		return new AnimateTrack(playerTrack, time, duration);
	}
}

/**
 * Finds the distance between 2 vectors.
 *
 * Abstraction of hypot function.
 * @param vec1 The first vector.
 * @param vec2 The second vector.
 */
export function distance(vec1: Vec3, vec2: Vec3) {
	return Math.hypot(...new NumArr(vec2).subtract(vec1));
}

/**
 * Maps a value from an existing range into another, also works recursively on arrays or objects.
 * @param val The value, array, or object of values to map.
 * @param from The range from which to map.
 * @param to The range to map to.
 * @param precision The number of decimal points to round to (can be nagative to round to tens, hundreds etc.).
 * @param easing Optional easing to apply to the range.
 */
export function mapRange(val: any, from: Vec2, to: Vec2, precision = 5, easing?: Easing) {
	if (typeof val == "number") {
		return Math.floor(Math.pow(10, precision) * lerp(to[0], to[1], (val - from[0]) / (from[1] - from[0]), easing)) / Math.pow(10, precision);
	} else if (!(typeof val == "number" || typeof val == "object")) {
		return val;
	} else if (Array.isArray(val)) {
		val = val.map(x => mapRange(x, from, to, precision));
	} else {
		Object.keys(val).forEach(key => {
			val[key] = mapRange(val[key], from, to, precision);
		});
	}
	return val;
}

/**
 * Clamp a number within a range, also works recursively on arrays or objects.
 * @param val The value, array, or object of values to clamp.
 * @param range The range (inclusive) to clamp the value within.
 */
export function clamp(val: any, range: Vec2) {
	range = range[0] > range[1] ? [range[1], range[0]] : range;
	if (typeof val == "number") {
		return Math.max(Math.min(...range), Math.min(Math.max(...range), val));
	} else if (!(typeof val == "number" || typeof val == "object")) {
		return val;
	} else if (Array.isArray(val)) {
		val = val.map(x => clamp(x, range));
	} else {
		Object.keys(val).forEach(key => {
			val[key] = clamp(val[key], range);
		});
	}
	return val;
}

/**
 * Convert color from hsv format to rgb.
 * @param color The color in hsv format, all values range from 0-1 (inclusive).
 * @returns Linear rgb (0-1).
 */
export function hsv2rgb(color: Vec4) {
	const [h, s, v, a] = color;
	// I actually have no idea how this works, chatGPT made it ;)
	const f = (n: number, k = (n + h * 6) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
	return [f(5), f(3), f(1), a] as Vec4;
}

/**
 * Convert color from rgb format to hsv.
 * @param color The color in rgb format (linear rgb 0-1 inclusive).
 */
export function rgb2hsv(color: Vec4) {
	const max = Math.max(color[0], color[1], color[2]);
	const min = Math.min(color[0], color[1], color[2]);
	const delta = max - min;
	const h = delta === 0 ? 0 : max === color[0] ? (color[1] - color[2]) / delta + (color[1] < color[2] ? 6 : 0) : max === color[1] ? (color[2] - color[0]) / delta + 2 : (color[0] - color[1]) / delta + 4;
	const s = max === 0 ? 0 : delta / max;
	return [h / 6, s, max, color[3]] as Vec4;
}

/**
 * Recursively sets the precision of numbers in an object, array, or number.
 * @param o The object, or number to set the precision of.
 * @param precision The number of decimals.
 */
export function decimals(o: any, precision = 5) {
	if (typeof o == "number") {
		return Math.round(o * Math.pow(10, precision)) / Math.pow(10, precision);
	} else if (!(typeof o == "number" || typeof o == "object")) {
		return o;
	} else if (Array.isArray(o)) {
		o = o.map(x => decimals(x, precision));
	} else {
		Object.keys(o).forEach(key => {
			o[key] = decimals(o[key], precision);
		});
	}
	return o;
}

export class TwoWayMap {
	private reverseMap: Record<any, any>;
	/**
	 * This is an internal class used by Lite-Mapper, most mapping cases will not require this class.
	 */
	constructor(private map: Record<any, any>) {
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

/**
 * Remove entries from an array and return the modified array. Affects the original array, therefore you do not need to reassign.
 * @param arr The array to remove elements from.
 * @param indexes The indexes of the elements to remove.
 */
export function arrRem<T extends any[]>(arr: T, indexes: number[]) {
	for (let i = indexes.length - 1; i >= 0; i--) {
		arr.splice(indexes[i], 1);
	}
	return arr as T;
}
