// deno-lint-ignore-file no-explicit-any
import { Environment, GeometryMaterialJSON, GeometryObjectTypes, Vec2, arrRem, currentDiff, filterEnvironments, repeat, ye3 } from "./mod.ts";

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

export class GeoTrackStack {
	internalStack: [string, Vec2[]][] = [];
	private maxCounter = 0; // For naming new tracks

	/**
	 * Create a stack of available geometry tracks to reuse, this is meant to be an optimized way of requesting available objects.
	 *
	 * Make sure to only use tracks for less than or exactly the time you specify.
	 *
	 * Otherwise, animations may overlap and you will get unexpected results.
	 * @example
	 * ```ts
	 * const stack = new GeoTrackStack("Cube", { shader: "Standard" }, "geo");
	 * stack.request(10, [0, 10]).forEach((track, i) => {
	 * 		const anim = new AnimateTrack(track, 0, 10); // <-- The animation goes for exactly the amount of time specified.
	 * 		anim.animate.position = [
	 * 			[i - 5, 0, 10, 0],
	 * 			[i - 5, 1, 10, (i + 1) / 10, "easeInOutSine"]
	 * 		];
	 * 		// You will probably need to animate these, because objects are reused (so they may still have old animations on them).
	 * 		anim.animate.rotation = [0, 0, 0];
	 * 		anim.animate.scale = [0, 0, 0];
	 * 		anim.push();
	 * });
	 * stack.push();
	 * ```
	 * @param type The geometry object type.
	 * @param material The geometry object material.
	 * @param track The name of the track to use, the stack will append a number to this.
	 */
	constructor(private type: GeometryObjectTypes, private material: GeometryMaterialJSON, private track = Math.random().toString()) {}

	/**
	 * Request an array of available tracks within a time period. If not enough track are available (or none are), new tracks will be created.
	 * @param count The number of tracks to request.
	 * @param time The time that the tracks will be used for.
	 * @returns An array of available tracks.
	 */
	request(count: number, time: Vec2) {
		time = time[0] > time[1] ? [time[1], time[0]] : time; // Sort time values
		const out: string[] = [];
		// Get all the indices of available tracks.
		const availableIndices: number[] = [];

		// Filter the internal stack to get tracks that are available over the specified time.
		const available = this.internalStack.filter((x, i) => {
			let free = true;
			x[1].forEach(y => {
				if (time.toString() == y.toString() || (time[0] >= y[0] && time[0] < y[1]) || (time[1] > y[0] && time[1] <= y[1])) {
					free = false;
				}
			});
			if (free) {
				availableIndices.push(i);
			}
			return free;
		});

		// Remove the available indices from the internal stack, we will add them back later.
		this.internalStack = arrRem(this.internalStack, availableIndices);

		// Add any available tracks to the output, and add the time to the tracks (they are now unavailable at this time for future calls).
		for (let i = 0; i < available.length && i < count; i++) {
			out.push(available[i][0]);
			available[i][1].push(time);
		}

		// If there weren't enough available tracks, we need to make new ones
		while (out.length < count) {
			// Create the new track
			const newTrack = [this.track + this.maxCounter, [time]] as [string, Vec2[]];
			this.maxCounter++;

			// Add the track to the arrays
			out.push(newTrack[0]);
			available.push(newTrack);
		}

		// Add the modified available tracks back to the internal array.
		this.internalStack.push(...available);

		// Return this call's available tracks (without time).
		return out;
	}

	/**
	 * Create the geometry objects for each track, and add them to the map.
	 */
	push() {
		this.internalStack.forEach(x => {
			const geo = new Environment().geo(this.type, this.material);
			geo.position = ye3;
			geo.track = x[0];
			geo.push();
		});
	}
}
