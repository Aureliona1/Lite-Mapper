// deno-lint-ignore-file no-explicit-any
import { ensureDir } from "https://deno.land/std@0.110.0/fs/ensure_dir.ts";
import { ensureFileSync } from "https://deno.land/std@0.110.0/fs/ensure_file.ts";
import { Seed } from "https://deno.land/x/seed@1.0.0/index.ts";
import * as ease from "./Easings.ts";
import { AnimateComponent, AnimateTrack, Arc, ArrayProcess, AssignPathAnimation, AssignPlayerToTrack, AssignTrackParent, Bomb, Chain, Easing, Environment, GeometryMaterialJSON, LightEvent, LookupMethod, Note, Vec2, Vec3, Vec4, Wall, currentDiff, start, ye3 } from "./LiteMapper.ts";

/**
 * Filter through the notes in your map and make changes based on properties.
 * @param fake Whether to target fake notes.
 * @param condition The condition that notes must pass to be affected.
 * @param action The action to apply to passing notes.
 */
export function filterNotes(fake: boolean, condition: (x: Note) => boolean, action: (x: Note) => void) {
	if (fake) {
		currentDiff.fakeNotes.filter(x => condition(x)).forEach(x => action(x));
	} else {
		currentDiff.notes.filter(x => condition(x)).forEach(x => action(x));
	}
}

/**
 * Filter through the environments in your map and make changes based on properties.
 * @param condition The condition that environments must pass to be affected.
 * @param action The action to apply to passing environment.
 */
export function filterEnvironments(condition: (x: Environment) => boolean, action: (x: Environment) => void) {
	currentDiff.environments.filter(x => condition(x)).forEach(x => action(x));
}

/**
 * Filter through the bombs in your map and make changes based on properties.
 * @param fake Whether to target fake bombs.
 * @param condition The condition that bombs must pass to be affected.
 * @param action The action to apply to passing bombs.
 */
export function filterBombs(fake: boolean, condition: (x: Bomb) => boolean, action: (x: Bomb) => void) {
	if (fake) {
		currentDiff.fakeBombs.filter(x => condition(x)).forEach(x => action(x));
	} else {
		currentDiff.bombs.filter(x => condition(x)).forEach(x => action(x));
	}
}

/**
 * Filter through the arcs in your map and make changes based on properties.
 * @param condition The condition that arcs must pass to be affected.
 * @param action The action to apply to passing arcs.
 */
export function filterArcs(condition: (x: Arc) => boolean, action: (x: Arc) => void) {
	currentDiff.arcs.filter(x => condition(x)).forEach(x => action(x));
}

/**
 * Filter through the chains in your map and make changes based on properties.
 * @param fake Whether to target fake chains.
 * @param condition The condition that chains must pass to be affected.
 * @param action The action to apply to passing chains.
 */
export function filterChains(fake: boolean, condition: (x: Chain) => boolean, action: (x: Chain) => void) {
	if (fake) {
		currentDiff.fakeChains.filter(x => condition(x)).forEach(x => action(x));
	} else {
		currentDiff.chains.filter(x => condition(x)).forEach(x => action(x));
	}
}

/**
 * Filter through the walls in your map and make changes based on properties.
 * @param fake Whether to target fake walls.
 * @param condition The condition that walls must pass to be affected.
 * @param action The action to apply to passing walls.
 */
export function filterWalls(fake: boolean, condition: (x: Wall) => boolean, action: (x: Wall) => void) {
	if (fake) {
		currentDiff.fakeWalls.filter(x => condition(x)).forEach(x => action(x));
	} else {
		currentDiff.walls.filter(x => condition(x)).forEach(x => action(x));
	}
}

/**
 * Filter through the events in your map and make changes based on properties.
 * @param condition The condition that events must pass to be affected.
 * @param action The action to apply to passing events.
 */
export function filterEvents(condition: (x: LightEvent) => boolean, action: (x: LightEvent) => void) {
	currentDiff.events.filter(x => condition(x)).forEach(x => action(x));
}

/**
 * Filter through the track animations in your map and make changes based on properties.
 * @param condition The condition that animations must pass to be affected.
 * @param action The action to apply to passing animations.
 */
export function filterTrackAnimations(condition: (x: AnimateTrack) => boolean, action: (x: AnimateTrack) => void) {
	currentDiff.customEvents?.forEach(e => {
		if (e.type == "AnimateTrack") {
			if (condition(e as AnimateTrack)) {
				action(e as AnimateTrack);
			}
		}
	});
}

/**
 * Filter through the component animations in your map and make changes based on properties.
 * @param condition The condition that animations must pass to be affected.
 * @param action The action to apply to passing animations.
 */
export function filterComponentAnimations(condition: (x: AnimateComponent) => boolean, action: (x: AnimateComponent) => void) {
	currentDiff.customEvents?.forEach(e => {
		if (e.type == "AnimateComponent") {
			if (condition(e as AnimateComponent)) {
				action(e as AnimateComponent);
			}
		}
	});
}

/**
 * Filter through the path animations in your map and make changes based on properties.
 * @param condition The condition that animations must pass to be affected.
 * @param action The action to apply to passing animations.
 */
export function filterPathAnimations(condition: (x: AssignPathAnimation) => boolean, action: (x: AssignPathAnimation) => void) {
	currentDiff.customEvents?.forEach(e => {
		if (e.type == "AssignPathAnimation") {
			if (condition(e as AssignPathAnimation)) {
				action(e as AssignPathAnimation);
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
	const vector = new ArrayProcess(point2).subtract(point1),
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
 * Console log with appended LM message.
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

const duplicateArrsNoOrder = <T extends any[]>(arr1: T, arr2: T) => arr1.sort().toString() == arr2.sort().toString();

function identicalMaterials(mat1: GeometryMaterialJSON | string = { shader: "BTSPillar" }, mat2: GeometryMaterialJSON | string = { shader: "BTSPillar" }) {
	if (typeof mat1 == "string" || typeof mat2 == "string") {
		return mat1 == mat2;
	} else {
		return mat1.shader == mat2.shader && mat1.color?.toString() == mat2.color?.toString() && (mat2.shaderKeywords ? (mat1.shaderKeywords ? duplicateArrsNoOrder(mat2.shaderKeywords, mat1.shaderKeywords) : false) : !mat1.shaderKeywords) && mat1.track == mat2.track;
	}
}

/**
 * Performs several actions on geometry materials across the map.
 * - Merges all duplicate materials.
 * - Renames all materials to numbers.
 * - Moves duplicate materials on geometry into map-wide materials.
 */
export function optimizeMaterials() {
	// Convert all existing mat names into numbers
	let tempMat: Record<any, GeometryMaterialJSON> = {},
		matArr = Object.entries(currentDiff.materials);
	repeat(matArr.length, i => {
		tempMat[i] = matArr[i][1];
		currentDiff.environments.forEach(x => {
			if (x.geometry) {
				if (x.geometry.material == matArr[i][0]) {
					x.geometry.material = i.toString();
				}
			}
		});
	});
	currentDiff.materials = tempMat;

	// Convert all duplicate JSON materials into strings
	let i = matArr.length,
		j = 0,
		k = 0;
	currentDiff.environments.forEach(x => {
		if (x.geometry) {
			let duped = false;
			if (typeof x.geometry.material !== "string") {
				currentDiff.environments.forEach(y => {
					if (y.geometry) {
						if (typeof y.geometry.material !== "string" && identicalMaterials(x.geometry?.material, y.geometry.material) && j !== k) {
							duped = true;
							currentDiff.materials[i] = x.geometry?.material as GeometryMaterialJSON;
							y.geometry.material = i.toString();
						}
						k++;
					}
				});
			}
			if (duped) {
				x.geometry.material = i.toString();
				i++;
			}
			j++;
		}
	});

	// Merge all duplicate materials
	matArr = Object.entries(currentDiff.materials);
	const dupes: number[][] = [];
	repeat(matArr.length, i => {
		const mat = matArr[i][1];
		repeat(matArr.length, j => {
			const xmat = matArr[j][1];
			let proc = true;
			dupes.forEach(x => {
				if (x[0] == j) {
					proc = false;
				}
			});
			if (identicalMaterials(mat, xmat) && i !== j && proc) {
				dupes.push([i, j]);
			}
		});
	});
	dupes.forEach(d => {
		filterEnvironments(
			x => {
				if (x.geometry) {
					return x.geometry.material == matArr[d[1]][0];
				} else {
					return false;
				}
			},
			geo => {
				if (!geo.geometry) {
					geo.geometry = { type: "Cube", material: matArr[d[0]][0] };
				} else {
					geo.geometry.material = matArr[d[0]][0];
				}
			}
		);
		delete currentDiff.materials[matArr[d[1]][0]];
	});
	// Renumber the materials
	tempMat = {};
	matArr = Object.entries(currentDiff.materials);
	repeat(matArr.length, i => {
		tempMat[i] = matArr[i][1];
		currentDiff.environments.forEach(x => {
			if (x.geometry) {
				if (x.geometry.material == matArr[i][0]) {
					x.geometry.material = i.toString();
				}
			}
		});
	});
	currentDiff.materials = tempMat;
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
 * @param process Whether to read the cache or write to it.
 * @param name The name of the entry in the chache to access.
 * @param data The data to write (if write process is specified), if left undefined the property will be removed from the cache.
 */
export function LMCache(process: "Read" | "Write", name: string, data?: any) {
	const fileName = "MK_Cache.json";
	ensureFileSync(fileName);
	if (process == "Read") {
		try {
			const cache: Record<string, any> = JSON.parse(Deno.readTextFileSync(fileName));
			return cache[name];
		} catch (e) {
			LMLog(`LM_Cache suffered from error, invalidating cache: ${e}`, "Error");
			Deno.writeTextFileSync(fileName, JSON.stringify({}));
		}
	} else {
		try {
			const cache: Record<string, any> = JSON.parse(Deno.readTextFileSync(fileName));
			if (typeof data == "undefined") {
				delete cache[name];
			} else {
				cache[name] = data;
			}
			Deno.writeTextFileSync(fileName, JSON.stringify(cache));
		} catch (e) {
			LMLog(`LM_Cache suffered from error, invalidating cache: ${e}`, "Error");
			Deno.writeTextFileSync(fileName, JSON.stringify({}));
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
export function PlayerAnim(time = 0, duration = 1, playerTrack = "player", noteTrack = "notes") {
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

/**
 * Abstraction of hypot function. Finds the distance between 2 vectors.
 * @param vec1 The first vector.
 * @param vec2 The second vector.
 */
export function distance(vec1: Vec3, vec2: Vec3) {
	return Math.hypot(...new ArrayProcess(vec2).subtract(vec1));
}

/**
 * Maps a value from an existing range into another, also works recusrively on arrays or objects.
 * @param val The value.
 * @param from The range from which to map.
 * @param to The range to map to.
 */
export function mapRange(val: any, from: Vec2, to: Vec2, precision = 5) {
	if (typeof val == "number") {
		return Math.floor(Math.pow(10, precision) * (((val - from[0]) / (from[1] - from[0])) * (to[1] - to[0]) + to[0])) / Math.pow(10, precision);
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
 * Clamp a number within a range.
 */
export function clamp(val: any, range: Vec2) {
	range = range[0] > range[1] ? [range[1], range[0]] : range;
	if (typeof val == "number") {
		return val < range[0] ? range[0] : val > range[1] ? range[1] : val;
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
 * @param color The color in hsv format, all values are from 0-1.
 */
export function hsv2rgb(color: Vec4) {
	const [h, s, v, a] = color;
	// I actually have no idea how this works, chatGPT made it ;)
	const f = (n: number, k = (n + h * 6) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
	return [f(5), f(3), f(1), a] as Vec4;
}

/**
 * Convert color from rgb format to hsv.
 * @param color The color in rgb format, all values are from 0-1.
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
export function jsonDecimals(o: any, precision = 5) {
	if (typeof o == "number") {
		return Math.round(o * Math.pow(10, precision)) / Math.pow(10, precision);
	} else if (!(typeof o == "number" || typeof o == "object")) {
		return o;
	} else if (Array.isArray(o)) {
		o = o.map(x => jsonDecimals(x, precision));
	} else {
		Object.keys(o).forEach(key => {
			o[key] = jsonDecimals(o[key], precision);
		});
	}
	return o;
}
