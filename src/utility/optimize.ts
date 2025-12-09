// deno-lint-ignore-file no-explicit-any
import { arrRem, compare, mapRange, type Vec2 } from "@aurellis/helpers";
import { ye3 } from "./utility/consts.ts";
import { AnimateTrack } from "./CustomEvents.ts";
import { Environment } from "./Environment.ts";
import { filterEnvironments, repeat } from "./Functions.ts";
import { currentDiff } from "./Map.ts";
import type { GeometryMaterialJSON, KFVec3 } from "./Types.ts";

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
						if (typeof y.geometry.material !== "string" && compare(x.geometry?.material, y.geometry.material) && j !== k) {
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
			if (compare(mat, xmat) && i !== j && proc) {
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
 * A stack of tracks that correspond to environment or geometry objects.
 * This can be used to "request" available tracks and reuse inactive objects.
 */
export class GeoTrackStack {
	/**
	 * Internal stack of tracks and their usage times.
	 */
	readonly internalStack: [number, Vec2[]][] = [];
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
	 * @param object The generic object to use on the stack.
	 * @param track Track must be defined here, not on the object.
	 */
	constructor(public object: Environment = new Environment().geo("Cube", { shader: "BTSPillar" }), public readonly track: string = Math.random().toString()) {}

	/**
	 * Request an array of available tracks within a time period. If not enough track are available (or none are), new tracks will be created.
	 * @param count The number of tracks to request.
	 * @param time The time that the tracks will be used for.
	 * @param id Whether to return an array of track names, or a numerical "id" of the object (still string although it can be parsed).
	 * @returns An array of available tracks.
	 */
	request(count: number, time: Vec2, id = false): string[] {
		time = time[0] > time[1] ? [time[1], time[0]] : time; // Sort time values
		const out: string[] = [];
		// Get all the indices of available tracks.
		const availableIndices: number[] = [];

		// Filter the internal stack to get tracks that are available over the specified time.
		const available = this.internalStack.filter((x, i) => {
			let free = true;
			x[1].forEach(y => {
				if ((time[0] >= y[0] && time[0] < y[1]) || (time[1] > y[0] && time[1] <= y[1]) || (time[0] <= y[0] && time[1] >= y[1])) {
					free = false;
				}
			});
			if (free) {
				availableIndices.push(i);
			}
			return free;
		});

		// Remove the available indices from the internal stack, we will add them back later.
		arrRem(this.internalStack, availableIndices);

		// Add any available tracks to the output, and add the time to the tracks (they are now unavailable at this time for future calls).
		for (let i = 0; i < available.length && i < count; i++) {
			out.push(id ? available[i][0].toString() : this.track + available[i][0]);
			available[i][1].push(time);
		}

		// If there weren't enough available tracks, we need to make new ones
		while (out.length < count) {
			// Create the new track
			const newTrack = [this.maxCounter, [time]] as [number, Vec2[]];
			this.maxCounter++;

			// Add the track to the arrays
			out.push(id ? newTrack[0].toString() : this.track + newTrack[0]);
			available.push(newTrack);
		}

		// Add the modified available tracks back to the internal array.
		this.internalStack.push(...available);

		// Return this call's available tracks (without time).
		return out;
	}

	/**
	 * Create the geometry objects for each track, and add them to the map.
	 * @param mergeAnims Whether to also search the map for track animations on the stack objects and merge duplicate ones (Default - false).
	 *
	 * #### Important: If you used modifier animations in your track animations, do not set this property to true, it will not work as intended and will cause animation overlap.
	 */
	push(mergeAnims = false) {
		this.object.position = ye3;
		this.internalStack.forEach(x => {
			this.object.track = this.track + x[0];
			this.object.push();
		});

		if (mergeAnims) {
			this.internalStack.forEach(trackID => {
				// Assign values for this geo object
				const removeIndices: number[] = [];
				const track = this.track + trackID[0];
				const geoStartTime = Math.min(...trackID[1].map(x => Math.min(...x)));
				const geoEndTime = Math.max(...trackID[1].map(x => Math.max(...x)));
				const newAnim = new AnimateTrack(track, geoStartTime, geoEndTime - geoStartTime);
				const posAnims: KFVec3[] = [],
					rotAnims: KFVec3[] = [],
					scaleAnims: KFVec3[] = [];

				// Check for animate tracks that use this object
				currentDiff.customEvents.forEach((anim, i) => {
					if (anim.type == "AnimateTrack") {
						anim = anim as AnimateTrack;

						if (anim.track == track) {
							removeIndices.push(i);
							const animDuration = anim.duration ?? 0;

							// Check for animation here
							if (anim.animate.position) {
								// Check for Vec3 animation
								if (anim.animate.position.length == 3 && typeof anim.animate.position[0] == "number") {
									posAnims.push([...anim.animate.position, mapRange(anim.time, [geoStartTime, geoEndTime], [0, 1]), "easeStep"]);
								} else {
									// Assume KFVec3 since modifiers are busted
									anim.animate.position = anim.animate.position as KFVec3[];

									// Rescale time
									anim.animate.position.forEach(x => {
										x[3] = mapRange(
											x[3] * animDuration + anim.time, // Get the absolute time
											[geoStartTime, geoEndTime], // The absolute time will (should) be somewhere between the total time
											[0, 1] // Just scale it to 0-1
										);
									});

									// Make the first kf a step
									if (anim.animate.position[0][4] && posAnims.length) {
										anim.animate.position[0][4] = "easeStep"; // Idk why they would already have an easing here, but just incase
									} else if (posAnims.length) {
										anim.animate.position[0].push("easeStep");
									}

									posAnims.push(...anim.animate.position);
								}
							}

							if (anim.animate.rotation) {
								// Check for Vec3 animation
								if (anim.animate.rotation.length == 3 && typeof anim.animate.rotation[0] == "number") {
									rotAnims.push([...anim.animate.rotation, mapRange(anim.time, [geoStartTime, geoEndTime], [0, 1]), "easeStep"]);
								} else {
									// Assume KFVec3 since modifiers are busted
									anim.animate.rotation = anim.animate.rotation as KFVec3[];

									// Rescale time
									anim.animate.rotation.forEach(x => {
										x[3] = mapRange(
											x[3] * animDuration + anim.time, // Get the absolute time
											[geoStartTime, geoEndTime], // The absolute time will (should) be somewhere between the total time
											[0, 1] // Just scale it to 0-1
										);
									});

									// Make the first kf a step
									if (anim.animate.rotation[0][4] && rotAnims.length) {
										anim.animate.rotation[0][4] = "easeStep"; // Idk why they would already have an easing here, but just incase
									} else if (rotAnims.length) {
										anim.animate.rotation[0].push("easeStep");
									}

									rotAnims.push(...anim.animate.rotation);
								}
							}

							if (anim.animate.scale) {
								// Check for Vec3 animation
								if (anim.animate.scale.length == 3 && typeof anim.animate.scale[0] == "number") {
									scaleAnims.push([...anim.animate.scale, mapRange(anim.time, [geoStartTime, geoEndTime], [0, 1]), "easeStep"]);
								} else {
									// Assume KFVec3 since modifiers are busted
									anim.animate.scale = anim.animate.scale as KFVec3[];

									// Rescale time
									anim.animate.scale.forEach(x => {
										x[3] = mapRange(
											x[3] * animDuration + anim.time, // Get the absolute time
											[geoStartTime, geoEndTime], // The absolute time will (should) be somewhere between the total time
											[0, 1] // Just scale it to 0-1
										);
									});

									// Make the first kf a step
									if (anim.animate.scale[0][4] && scaleAnims.length) {
										anim.animate.scale[0][4] = "easeStep"; // Idk why they would already have an easing here, but just incase
									} else if (scaleAnims.length) {
										anim.animate.scale[0].push("easeStep");
									}

									scaleAnims.push(...anim.animate.scale);
								}
							}
						}
					}
				});

				// This means there were animations
				if (removeIndices.length) {
					arrRem(currentDiff.customEvents, removeIndices);

					newAnim.animate.position = posAnims;
					newAnim.animate.rotation = rotAnims;
					newAnim.animate.scale = scaleAnims;
					newAnim.push();
				}
			});
		}
	}
}
