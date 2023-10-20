import { Arc, Bomb, Chain, Environment, LightEvent, Note, Vec3, Wall, currentDiff } from "./LiteMapper.ts";

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

export function filterEnvironments(condition: (x: Environment) => boolean, action: (x: Environment) => void) {
	currentDiff.environments.forEach(n => {
		if (condition(n)) {
			action(n);
		}
	});
}

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

export function filterArcs(condition: (x: Arc) => boolean, action: (x: Arc) => void) {
	currentDiff.arcs.forEach(n => {
		if (condition(n)) {
			action(n);
		}
	});
}

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

export function filterWalls(fake: boolean, condition: (x: Wall) => boolean, action: (x: Wall) => void) {
	if (fake) {
		currentDiff.fakeObstacles.forEach(n => {
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

export function repeat(rep: number, code: (x: number) => void) {
	for (let i = 0; i < rep; i++) code(i);
}
