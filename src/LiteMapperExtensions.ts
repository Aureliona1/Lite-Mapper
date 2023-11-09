// deno-lint-ignore-file no-explicit-any
import { Arc, Bomb, Chain, Environment, LightEvent, Note, Vec3, Wall, currentDiff } from "./LiteMapper.ts";
import { ensureDir } from "https://deno.land/std@0.110.0/fs/ensure_dir.ts";
import { Seed } from "https://deno.land/x/seed@1.0.0/index.ts";

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

export function shuffle<T extends number[]>(array: T, seed: number = Math.random()): T {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(seedRNG(0, 1, seed * Math.PI * (i + 1)) * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array as T;
}

/**
 * Random number generator with optional seed for reproducible results.
 * @param min The minimun possible number to generate (inclusive).
 * @param max The maximum possible number to generate (exclusive).
 * @param seed The optional seed to apply to the generator (leave blank for random).
 * @returns Random number.
 */
export function seedRNG(min: number, max: number, seed: number | string = Date.now()) {
	[min, max] = min > max ? [max, min] : [min, max];
	return new Seed(seed.toString()).randomFloat(min, max);
}

/**
 * Generate a random number.
 * @param min The minimum possible number to generate (inclusive).
 * @param max The maximum possible number to generate (exclusive).
 * @returns Random number.
 */
export const pRNG = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Generate a random number.
 * @param min The minimum possible number to generate (inclusive).
 * @param max The maximum possible number to generate (exclusive).
 * @returns Random number.
 */
export const random = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Finds the rotation of an object at point1 so that it faces point2.
 * @param point1 The position of the object.
 * @param point2 Where the object should be facing.
 * @param defaultAngle The angle that determines where "forwards" is for the object, defaults to the +z axis. (i.e., player - [0,0,0], notes - [0,180,0], upwards facing lasers - [-90,0,0] etc.)
 * @returns Vec3 - The rotation for the object at point1.
 */
export function pointRotation(point1: Vec3, point2: Vec3, defaultAngle?: Vec3) {
	const vector = [point2[0] - point1[0], point2[1] - point1[1], point2[2] - point1[2]] as Vec3;
	const angle = [0, (180 * Math.atan2(vector[0], vector[2])) / Math.PI, 0];
	const pitchPoint = rotateVector(vector, [0, -angle[1], 0]);
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
 * Console log with appended LM message.
 * @param message Message to log.
 * @param error Optional error level.
 */
export function LMLog(message: any, error?: "Warning" | "Error") {
	if (error == "Warning") {
		console.log(`\x1b[33m[Warning in LiteMapper] ${message}\x1b[37m`);
	} else if (error == "Error") {
		console.log(`\x1b[33m[Error in LiteMapper] ${message}\x1b[37m`);
	} else {
		console.log(`\x1b[37m[LiteMapper] ${message}\x1b[37m`);
	}
}
