// deno-lint-ignore-file no-explicit-any
import { makeNoise2D, makeNoise3D, makeNoise4D } from "npm:fast-simplex-noise@4.0.0";
import mulberry32 from "jsr:@bengineering/mulberry32@0.0.1";
import { ArrOp } from "./Arrays.ts";
import { ye3 } from "./Consts.ts";
import { type AnimateComponent, AnimateTrack, type AssignPathAnimation, AssignPlayerToTrack, AssignTrackParent } from "./CustomEvents.ts";
import * as ease from "./Easings.ts";
import { Environment } from "./Environment.ts";
import type { LightEvent } from "./Lights.ts";
import { currentDiff, lMInitTime } from "./Map.ts";
import type { Arc, Bomb, Chain, Note, Wall } from "./Objects.ts";
import type { Easing, LookupMethod, RGBAObject, Vec2, Vec3, Vec4 } from "./Types.ts";

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
export function rotateVector(start: Vec3, end: Vec3, rotation: Vec3): Vec3 {
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
 * Generates a number based on the character codes in a string.
 */
export function stringCodeToNumber(s: string): number {
	return s
		.split(/./)
		.map(x => x.charCodeAt(0))
		.reduce((x, y) => x + y);
}

/**
 * Generate a random number.
 * @param min The minimun possible number to generate (inclusive).
 * @param max The maximum possible number to generate (exclusive).
 * @param seed The optional seed to apply to the generator (leave blank for random).
 * @param precision (Default - 3) The number of decimals in the random number. This can be negative to round to different values, e.g., -1 will round to the nearest 10, -2 will round to the nearest 100 etc.
 * @returns Random number.
 */
export function random(min: number, max: number, seed: number | string = Math.random(), precision = 3): number {
	[min, max] = min > max ? [max, min] : [min, max];
	return decimals(mulberry32(stringCodeToNumber(seed.toString()))() * (max - min) + min, precision);
}

/**
 * Finds the rotation of an object at point1 so that it faces point2.
 * @param point1 The position of the object.
 * @param point2 Where the object should be facing.
 * @param defaultAngle The angle that determines where "forwards" is for the object, defaults to the +z axis. (i.e., player - [0,0,0], notes - [0,180,0], upwards facing lasers - [-90,0,0] etc.)
 * @returns Vec3 - The rotation for the object at point1.
 */
export function pointRotation(point1: Vec3, point2: Vec3, defaultAngle?: Vec3): Vec3 {
	const vector = ArrOp.subtract(point2, point1),
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
 * Ensures that a dir exists.
 */
function ensureDir(...paths: string[]) {
	paths.forEach(path => {
		path = path.replaceAll("\\", "/");
		const dirs = path.split("/");
		let accumilator = dirs[0];
		for (let i = 1; i <= dirs.length; accumilator += `/${dirs[i++]}`) {
			try {
				Deno.statSync(accumilator);
			} catch (_) {
				try {
					Deno.mkdirSync(accumilator);
				} catch (e) {
					console.error(e);
				}
			}
		}
	});
}

function ensureFile(path: string) {
	try {
		Deno.statSync(path);
	} catch (_) {
		try {
			Deno.writeFileSync(path, new Uint8Array());
		} catch (e) {
			console.error(e);
		}
	}
}

/**
 * Copy map directory contents to another directory.
 * @param toDir The target directory to copy to.
 * @param extraFiles Any extra files to copy over.
 */
export function copyToDir(toDir: string, extraFiles?: string[]) {
	ensureDir(toDir);
	currentDiff.info.raw._difficultyBeatmapSets.forEach(x => {
		x._difficultyBeatmaps.forEach(y => {
			try {
				Deno.copyFileSync(y._beatmapFilename, toDir + "/" + y._beatmapFilename);
			} catch (e) {
				LMLog(e, "Error");
				LMLog("Skipping this beatmap...", "Warning", "copyToDir");
			}
		});
	});
	const songName = currentDiff.info.raw._songFilename,
		coverName = currentDiff.info.raw._coverImageFilename;
	try {
		Deno.copyFileSync("info.dat", toDir + "/info.dat");
	} catch (e) {
		LMLog(e, "Error");
		LMLog("Skipping info file, your map will not load in-game from the destination directory...", "Warning", "copyToDir");
	}
	try {
		Deno.copyFileSync(songName, toDir + "/" + songName);
	} catch (e) {
		LMLog(e, "Error");
		LMLog("Skipping song file, your map will not load in-game from the destination directory...", "Warning", "copyToDir");
	}
	try {
		Deno.copyFileSync(coverName, toDir + "/" + coverName);
	} catch (e) {
		LMLog(e, "Error");
		LMLog("Skipping cover file...", "Warning", "copyToDir");
	}
	if (extraFiles) {
		extraFiles.forEach(x => {
			try {
				Deno.copyFileSync(x, toDir + "/" + x);
			} catch (e) {
				LMLog(e, "Error");
				LMLog(`Skipping ${x}...`, "Warning", "copyToDir");
			}
		});
	}
	LMLog(`Copied map to ${toDir}...`, "Log", "copyToDir");
}

/**
 * Calculates the time in ms from map init.
 */
export function runTime(): number {
	return Date.now() - lMInitTime;
}

/**
 * Console log with prepended LM message.
 * @param message Message to log.
 * @param errorLvl Optional error level.
 */
export function LMLog(message: any, errorLvl: "Warning" | "Error" | "Log" = "Log", logSource = "Lite-Mapper") {
	if (errorLvl == "Warning") {
		console.warn(`${rgb(255, 255, 0)}[!] \x1b[90m[${logSource}: ${runTime()}ms] ${rgb(255, 255, 0)}WARNING: ${message}\x1b[0m`);
	} else if (errorLvl == "Error") {
		console.error(`${rgb(255, 0, 0)}[!] \x1b[90m[${logSource}: ${runTime()}ms] ${rgb(255, 0, 0)}ERROR: ${message}\x1b[0m`);
	} else {
		console.log(`\x1b[34m[*] \x1b[90m[${logSource}: ${runTime()}ms] \x1b[0m${message}\x1b[0m`);
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
export function lerp(start: number, end: number, fraction: number, easing: Easing = "easeLinear"): number {
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
	ensureFile(fileName);
	if (process == "Clear") {
		try {
			Deno.removeSync(fileName);
		} catch (e) {
			LMLog(e, "Error");
		}
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
			LMLog(e, "Error", "CacheHandler");
			LMLog("Invalidating cache...", "Log", "CacheHandler");
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
export class PlayerAnim extends AnimateTrack {
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
		super(playerTrack, time, duration);
	}
}

/**
 * Finds the distance between 2 vectors.
 *
 * Abstraction of hypot function.
 * @param vec1 The first vector.
 * @param vec2 The second vector.
 */
export function distance(vec1: Vec3, vec2: Vec3): number {
	return Math.hypot(...ArrOp.subtract(vec2, vec1));
}

/**
 * Maps a value from an existing range into another, also works recursively on arrays or objects.
 * @param val The value, array, or object of values to map.
 * @param from The range from which to map.
 * @param to The range to map to.
 * @param precision The number of decimal points to round to (can be nagative to round to tens, hundreds etc.).
 * @param easing Optional easing to apply to the range.
 */
export function mapRange<T extends number | string | any[] | Record<string, any>>(val: T, from: Vec2, to: Vec2, precision = 5, easing?: Easing): T {
	if (typeof val == "number") {
		return (Math.floor(Math.pow(10, precision) * lerp(to[0], to[1], (val - from[0]) / (from[1] - from[0]), easing)) / Math.pow(10, precision)) as T;
	} else if (!(typeof val == "number" || typeof val == "object")) {
		return val;
	} else if (Array.isArray(val)) {
		(val as any[]) = val.map(x => mapRange(x, from, to, precision));
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
export function clamp<T extends number | string | any[] | Record<string, any>>(val: T, range: Vec2): T {
	range = range[0] > range[1] ? [range[1], range[0]] : range;
	if (typeof val == "number") {
		return Math.max(Math.min(...range), Math.min(Math.max(...range), val)) as T;
	} else if (!(typeof val == "number" || typeof val == "object")) {
		return val;
	} else if (Array.isArray(val)) {
		(val as any[]) = val.map(x => clamp(x, range));
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
export function hsv2rgb(color: Vec4): Vec4 {
	const [h, s, v, a] = color;
	// I actually have no idea how this works, chatGPT made it ;)
	const f = (n: number, k = (n + h * 6) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
	return [f(5), f(3), f(1), a] as Vec4;
}

/**
 * Convert color from rgb format to hsv.
 * @param color The color in rgb format (linear rgb 0-1 inclusive).
 */
export function rgb2hsv(color: Vec4): Vec4 {
	const max = Math.max(color[0], color[1], color[2]);
	const min = Math.min(color[0], color[1], color[2]);
	const delta = max - min;
	const h = delta === 0 ? 0 : max === color[0] ? (color[1] - color[2]) / delta + (color[1] < color[2] ? 6 : 0) : max === color[1] ? (color[2] - color[0]) / delta + 2 : (color[0] - color[1]) / delta + 4;
	const s = max === 0 ? 0 : delta / max;
	return [h / 6, s, max, color[3]] as Vec4;
}

const HEX_MAP = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

/**
 * Convert linear (0-1) rgb into its corresponding hex value. Since linear rgb is continuous and hex codes are discreet, some rounding errors may occur.
 * @param color The color to convert.
 * @returns Hex string.
 */
export function rgba2Hex(color: Vec4): string {
	color = color.map(x => Math.round(clamp(x, [0, 1]) * 255)) as Vec4;
	const digits: string[] = [];
	color.forEach(x => {
		digits.push(x.toString(16));
	});
	return digits.join("");
}

/**
 * Convert a valid hex code to linear rgba (0-1).
 * @param hex The hex code.
 */
export function hex2Rgba(hex: string): Vec4 {
	if (hex.length !== 8 || !/[0-9A-F]/.test(hex)) {
		return [0, 0, 0, 0];
	} else {
		const digits = new Array(8).fill("").map((_, i) => HEX_MAP.indexOf(hex[i]));
		const rgb = new Array(4).fill(0).map((_, i) => digits[i * 2] * 16 + digits[i * 2 + 1]);
		return rgb.map(x => x / 255) as Vec4;
	}
}

/**
 * Convert vector RGBA to an object with named keys.
 * @param color The Vec4 color.
 */
export function rgba2Obj(color: Vec4): RGBAObject {
	return { r: color[0], g: color[1], b: color[2], a: color[3] };
}

/**
 * Convert parametric RGBA object into vector form.
 */
export function objToRGBA(obj: RGBAObject): Vec4 {
	return [obj.r, obj.g, obj.b, obj.a];
}

/**
 * Recursively sets the precision of numbers in an object, array, or number.
 * @param o The object, or number to set the precision of.
 * @param precision The number of decimals.
 */
export function decimals<T extends string | number | any[] | Record<string, any>>(o: T, precision = 5): T {
	if (typeof o == "number") {
		return (Math.round(o * Math.pow(10, precision)) / Math.pow(10, precision)) as T;
	} else if (!(typeof o == "number" || typeof o == "object")) {
		return o;
	} else if (Array.isArray(o)) {
		(o as any[]) = o.map(x => decimals(x, precision));
	} else {
		Object.keys(o).forEach(key => {
			o[key] = decimals(o[key], precision);
		});
	}
	return o;
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
export function isEmptyObject(o: Record<string, any>): boolean {
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
 * Recursively compare everything on any type of data.
 */
export function compare<Tr extends T, T extends number | string | undefined | Array<Tr> | Record<string, Tr>>(a: T, b: T): boolean {
	if (typeof a !== "object") {
		return a === b;
	} else {
		if (Array.isArray(a) && Array.isArray(b)) {
			if (a.length == b.length) {
				let eq = true;
				a.forEach((x, i) => {
					if (!compare(x, b[i])) {
						eq = false;
					}
				});
				return eq;
			} else {
				return false;
			}
		} else {
			const a2arr = Object.entries(a);
			const b2arr = Object.entries(b as Record<string, Tr>);
			return compare(a2arr, b2arr);
		}
	}
}

export class Noise {
	/**
	 * The seed for the noise generator.
	 */
	public readonly seed: number = Math.random();
	private n2d = makeNoise2D(() => this.seed);
	private n3d = makeNoise3D(() => this.seed);
	private n4d = makeNoise4D(() => this.seed);
	/**
	 * Initialise 1d, 2d, 3d, and 4d noise generators.
	 * @param seed The see for the generator.
	 */
	constructor(seed: number = Math.random()) {
		this.seed = seed;
	}

	/**
	 * Get a 1-dimensional point on the noise map.
	 * @param x The position on the map.
	 * @param range The range to scale the noise values.
	 */
	point1D(x: number, range: Vec2 = [-1, 1]): number {
		return mapRange(this.n2d(x, 0), [-0.9, 0.9], range);
	}
	/**
	 * Get a 2-dimensional point on the map.
	 * @param x The x position on the map.
	 * @param y The y position on the map.
	 * @param range The range to scale the noise values.
	 */
	point2D(x: number, y: number, range: Vec2 = [-1, 1]): number {
		return mapRange(this.n2d(x, y), [-0.9, 0.9], range);
	}
	/**
	 * Get a 3-dimensional point on the map.
	 * @param x The x position on the map.
	 * @param y The y position on the map.
	 * @param z The z position on the map.
	 * @param range The range to scale the noise values.
	 */
	point3D(x: number, y: number, z: number, range: Vec2 = [-1, 1]): number {
		return mapRange(this.n3d(x, y, z), [-0.9, 0.9], range);
	}
	/**
	 * Get a 4-dimensional point on the map.
	 * @param x The x position on the map.
	 * @param y The y position on the map.
	 * @param z The z position on the map.
	 * @param w The w position on the map.
	 * @param range The range to scale the noise values.
	 */
	point4D(x: number, y: number, z: number, w: number, range: Vec2 = [-1, 1]): number {
		return mapRange(this.n4d(x, y, z, w), [-0.9, 0.9], range);
	}
}

/**
 * Recursively freeze all nested objects in an object.
 * @param obj The object to freeze.
 */
export function deepFreeze<T>(obj: T): T {
	if (typeof obj !== "object" || obj === null || Object.isFrozen(obj)) {
		return obj;
	}
	Object.freeze(obj);
	if (Array.isArray(obj)) {
		obj.forEach(deepFreeze);
	} else {
		Object.getOwnPropertyNames(obj).forEach(prop => {
			deepFreeze((obj as Record<string, any>)[prop]);
		});
	}

	return obj;
}

/**
 * Generates an RGB code to color all following text in the console. Reset this with `\x1b[0m`.
 * @param red The red value (0 - 255).
 * @param green The green value (0 - 255).
 * @param blue The blue value (0 - 255).
 * @param bg Whether to affect the foreground color or the background (Default - false).
 */
export const rgb = (r: number, g: number, b: number, bg = false): string => "\x1b[" + (bg ? 48 : 38) + ";2;" + (Math.round(r) % 256) + ";" + (Math.round(g) % 256) + ";" + (Math.round(b) % 256) + "m";
