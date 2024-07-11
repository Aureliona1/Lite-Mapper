// deno-lint-ignore-file no-explicit-any
import { GeometryMaterialJSON, currentDiff, filterEnvironments, repeat } from "./LiteMapper.ts";

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
