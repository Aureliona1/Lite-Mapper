// deno-lint-ignore-file no-explicit-any
import { ensureDir } from "https://deno.land/std@0.110.0/fs/ensure_dir.ts";
import { ensureFileSync } from "https://deno.land/std@0.110.0/fs/ensure_file.ts";
import { Seed } from "https://deno.land/x/seed@1.0.0/index.ts";
import * as ease from "./Easings.ts";
import { AnimateComponent, AnimateTrack, Arc, AssignPathAnimation, Bomb, Chain, Easing, Environment, GeometryMaterialJSON, LightEvent, LookupMethod, Note, Vec3, Wall, copy, currentDiff, start, ye3 } from "./LiteMapper.ts";

/**
 * Filter through the notes in your map and make changes based on properties.
 * @param fake Whether to target fake notes.
 * @param condition The condition that notes must pass to be affected.
 * @param action The action to apply to passing notes.
 */
export function filterNotes(fake: boolean, condition: (x: Note) => boolean, action: (x: Note) => void) {
	if (fake) {
		currentDiff.fakeNotes.forEach(x => {
			if (condition(x)) {
				action(x);
			}
		});
	} else {
		currentDiff.notes.forEach(x => {
			if (condition(x)) {
				action(x);
			}
		});
	}
}

/**
 * Filter through the environments in your map and make changes based on properties.
 * @param condition The condition that environments must pass to be affected.
 * @param action The action to apply to passing environment.
 */
export function filterEnvironments(condition: (x: Environment) => boolean, action: (x: Environment) => void) {
	currentDiff.environments.forEach(n => {
		if (condition(n)) {
			action(n);
		}
	});
}

/**
 * Filter through the bombs in your map and make changes based on properties.
 * @param fake Whether to target fake bombs.
 * @param condition The condition that bombs must pass to be affected.
 * @param action The action to apply to passing bombs.
 */
export function filterBombs(fake: boolean, condition: (x: Bomb) => boolean, action: (x: Bomb) => void) {
	if (fake) {
		currentDiff.fakeBombs.forEach(n => {
			if (condition(n)) {
				action(n);
			}
		});
	} else {
		currentDiff.bombs.forEach(n => {
			if (condition(n)) {
				action(n);
			}
		});
	}
}

/**
 * Filter through the arcs in your map and make changes based on properties.
 * @param condition The condition that arcs must pass to be affected.
 * @param action The action to apply to passing arcs.
 */
export function filterArcs(condition: (x: Arc) => boolean, action: (x: Arc) => void) {
	currentDiff.arcs.forEach(n => {
		if (condition(n)) {
			action(n);
		}
	});
}

/**
 * Filter through the chains in your map and make changes based on properties.
 * @param fake Whether to target fake chains.
 * @param condition The condition that chains must pass to be affected.
 * @param action The action to apply to passing chains.
 */
export function filterChains(fake: boolean, condition: (x: Chain) => boolean, action: (x: Chain) => void) {
	if (fake) {
		currentDiff.fakeChains.forEach(n => {
			if (condition(n)) {
				action(n);
			}
		});
	} else {
		currentDiff.chains.forEach(n => {
			if (condition(n)) {
				action(n);
			}
		});
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
		currentDiff.fakeWalls.forEach(n => {
			if (condition(n)) {
				action(n);
			}
		});
	} else {
		currentDiff.walls.forEach(n => {
			if (condition(n)) {
				action(n);
			}
		});
	}
}

/**
 * Filter through the events in your map and make changes based on properties.
 * @param condition The condition that events must pass to be affected.
 * @param action The action to apply to passing events.
 */
export function filterEvents(condition: (x: LightEvent) => boolean, action: (x: LightEvent) => void) {
	currentDiff.events.forEach(n => {
		if (condition(n)) {
			action(n);
		}
	});
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
 * Rotate a vector around [0, 0, 0].
 * @param position The vector position.
 * @param rotation The rotation to apply.
 * @returns Vec3
 */
export function rotateVector(position: Vec3, rotation: Vec3) {
	rotation = rotation.map(x => (x * Math.PI) / 180) as Vec3;
	let pos: number[][] = [[position[0]], [position[1]], [position[2]]];
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
	const result = [pos[0][0], pos[1][0], pos[2][0]];
	return result as Vec3;
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
 * Create a new array from a function of x. e.g arrFromFunction(10, x => { return 2 * x })
 * @param length The length of the arr.
 * @param func The function to run through the arr.
 * @returns arr
 */
export function arrFromFunction(length: number, func: (x: number) => number) {
	return Array.from(Array(length).keys()).map(x => {
		return func(x);
	});
}

/**
 * Generate a random number.
 * @param min The minimun possible number to generate (inclusive).
 * @param max The maximum possible number to generate (exclusive).
 * @param seed The optional seed to apply to the generator (leave blank for random).
 * @param precision (Default - 3) The number of decimals in the random number. This can be negative to round to different values, e.g., -1 will round to the nearest 10, -2 will round to the nearest 100 etc.
 * @returns Random number.
 */
export function random(min: number, max: number, seed: number | string = Date.now(), precision = 3) {
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
		pitchPoint = rotateVector(vector, [0, -angle[1], 0]);
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
 * Converts a time in ms to years, weeks, days, etc...
 * @param ms Time in ms.
 */
export function msToTime(ms: number) {
	const seconds = Math.floor(ms / 1000),
		minutes = Math.floor(seconds / 60),
		hours = Math.floor(minutes / 60),
		days = Math.floor(hours / 24),
		weeks = Math.floor(days / 7),
		years = Math.floor(weeks / 52);
	return `Years: ${years}, Weeks: ${weeks % 52}, Days: ${days % 7}, Hours: ${hours % 24}, Minutes: ${minutes % 60}, Seconds: ${seconds % 60}, Ms: ${ms % 1000}`;
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

function duplicateArrsNoOrder<T extends any[]>(arr1: T, arr2: T) {
	arr1 = arr1.sort();
	arr2 = arr2.sort();
	return arr1.toString() == arr2.toString();
}

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

export class ArrayProcess<T extends number[]> {
	/**
	 * Run several mathematical operations on an array.
	 * @param array The source array.
	 */
	constructor(public array: T) {}
	/**
	 * Add another array or a single number to the original array. Does not modify the original array.
	 * @param arr The array or number to add to original array.
	 */
	add(arr: T | number) {
		const temp = copy(this.array);
		if (typeof arr == "number") {
			return temp.map(x => x + arr) as T;
		} else {
			repeat(temp.length, i => {
				temp[i] += arr[i];
			});
			return temp as T;
		}
	}
	/**
	 * Subtract another array or a single number from the original array. Does not modify the original array.
	 * @param arr The array or number to add to original array.
	 */
	subtract(arr: T | number) {
		const temp = copy(this.array);
		if (typeof arr == "number") {
			return temp.map(x => x - arr) as T;
		} else {
			repeat(temp.length, i => {
				temp[i] -= arr[i];
			});
			return temp as T;
		}
	}
	/**
	 * Multiply original array by another array or a number. Does not modify the original array.
	 * @param arr The array or number to multiply to original array.
	 */
	multiply(arr: T | number) {
		const temp = copy(this.array);
		if (typeof arr == "number") {
			return temp.map(x => x * arr) as T;
		} else {
			repeat(temp.length, i => {
				temp[i] *= arr[i];
			});
			return temp as T;
		}
	}
	/**
	 * Divide original array by another array or a number. Does not modify the original array.
	 * @param arr The array or number to divide original array by.
	 */
	divide(arr: T | number) {
		const temp = copy(this.array);
		if (typeof arr == "number") {
			return temp.map(x => x / arr) as T;
		} else {
			repeat(temp.length, i => {
				temp[i] /= arr[i];
			});
			return temp as T;
		}
	}
	/**
	 * Interpolate array to another array or a number by a certain fraction. Does not modify the original array.
	 * @param arr The ending arr or number of the interpolation.
	 * @param fraction The fraction, or array of fractions to interpolate by.
	 * @param ease Optional easing.
	 */
	lerp(arr: T | number, fraction: T | number, ease: Easing = "easeLinear") {
		const end: T = typeof arr == "number" ? (new Array(this.array.length).fill(arr) as T) : arr,
			factor: T = typeof fraction == "number" ? (new Array(this.array.length).fill(fraction) as T) : fraction,
			temp = copy(this.array);
		repeat(temp.length, i => {
			temp[i] = lerp(temp[i], end[i], factor[i], ease);
		});
		return temp as T;
	}
	/**
	 * Randomly reorder elements in the array. Does not modify the original array.
	 * @param seed The seed for the random shuffling.
	 */
	shuffle(seed: number = Math.random()) {
		const temp = copy(this.array);
		for (let i = temp.length - 1; i > 0; i--) {
			const j = random(0, 1, seed * Math.PI * (i + 1), 0) * (i + 1);
			[temp[i], temp[j]] = [temp[j], temp[i]];
		}
		return temp as T;
	}
	/**
	 * Sorts the array from lowest to highest.
	 */
	sortNumeric() {
		const temp = copy(this.array);
		return temp.sort((a, b) => {
			if (a > b) return 1;
			if (a < b) return -1;
			return 0;
		}) as T;
	}
	get max() {
		return new ArrayProcess(this.array).sortNumeric()[this.array.length - 1];
	}
	get min() {
		return new ArrayProcess(this.array).sortNumeric()[0];
	}
	get range() {
		return this.max - this.min;
	}
	get mean() {
		let out = 0;
		repeat(this.array.length, i => {
			out += this.array[i];
		});
		return out / this.array.length;
	}
	get median() {
		const temp = new ArrayProcess(this.array).sortNumeric();
		return temp[Math.floor(temp.length / 2)];
	}
	get mode() {
		let arr: number[][] = [];
		const set = [...new Set(this.array)];
		repeat(set.length, i => {
			let instances = 0;
			repeat(this.array.length, j => {
				if (set[i] == this.array[j]) {
					instances++;
				}
			});
			arr.push([set[i], instances]);
		});
		arr = arr.sort((a, b) => {
			if (a[1] > b[1]) return 1;
			if (a[1] < b[1]) return -1;
			return 0;
		});
		return arr[arr.length - 1][0];
	}
}
