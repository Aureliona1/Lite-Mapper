// deno-lint-ignore-file no-explicit-any
import { ArrOp, clamp, mapRange, rgb, rotateVector, type Vec2, type Vec3, type Vec4 } from "jsr:@aurellis/helpers@1.0.1";
import { makeNoise2D, makeNoise3D, makeNoise4D } from "npm:fast-simplex-noise@4.0.0";
import { ye3 } from "./Consts.ts";
import { type AnimateComponent, AnimateTrack, type AssignPathAnimation, AssignPlayerToTrack, AssignTrackParent } from "./CustomEvents.ts";
import { Environment } from "./Environment.ts";
import type { LightEvent } from "./Lights.ts";
import { currentDiff, lMInitTime } from "./Map.ts";
import type { Arc, Bomb, Chain, Note, Wall } from "./Objects.ts";
import type { LookupMethod, RGBAObject } from "./Types.ts";

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
 * Repeat some code a set number of times.
 * @param rep The number of times to repeat.
 * @param code The code to repeat.
 */
export function repeat(rep: number, code: (x: number) => void) {
	for (let i = 0; i < rep; i++) code(i);
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

// Functions stolen from ReMapper >:)

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
