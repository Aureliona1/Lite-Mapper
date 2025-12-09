import { deepCopy, type Vec2 } from "@aurellis/helpers";
import type { BombJSON, NoteCustomProps, Optional } from "../core/core.ts";
import { GameplayObject } from "./object.ts";
import { jsonPrune } from "../utility/utility.ts";
import { currentDiff } from "../map/map.ts";

/**
 * Bomb gameplay object.
 */
export class Bomb extends GameplayObject {
	/**
	 * Create a new bomb.
	 * @param time The time of the bomb (Default - 0).
	 * @param pos The [x, y] of the bomb (Default - [0, 0]).
	 */
	constructor(public time = 0, public pos: Vec2 = [0, 0]) {
		super();
	}
	override customData: NoteCustomProps = {};

	set disableNoteGravity(x: Optional<boolean>) {
		this.customData.disableNoteGravity = x;
	}
	get disableNoteGravity(): Optional<boolean> {
		return this.customData.disableNoteGravity;
	}

	set disableNoteLook(x: Optional<boolean>) {
		this.customData.disableNoteLook = x;
	}
	get disableNoteLook(): Optional<boolean> {
		return this.customData.disableNoteLook;
	}

	set spawnEffect(x: Optional<boolean>) {
		this.customData.spawnEffect = x;
	}
	get spawnEffect(): Optional<boolean> {
		return this.customData.spawnEffect;
	}

	get x(): number {
		return this.pos[0];
	}
	set x(x: number) {
		this.pos[0] = x;
	}

	get y(): number {
		return this.pos[1];
	}
	set y(x: number) {
		this.pos[1] = x;
	}

	/**
	 * Return the raw Json of the bomb.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	override return(freeze = true): BombJSON {
		const temp = freeze ? deepCopy(this) : this;
		const out: BombJSON = {
			b: temp.time,
			x: temp.x,
			y: temp.y,
			customData: temp.customData
		};
		jsonPrune(out);
		return out;
	}

	/**
	 * Create an instance of a bomb from valid bomb JSON.
	 * @param x The JSON.
	 * @returns A bomb.
	 */
	static from(x: BombJSON): Bomb {
		const b = new Bomb(x.b);
		b.x = x.x ?? 0;
		b.y = x.y ?? 0;
		if (x.customData) {
			b.customData = x.customData;
		}
		return b;
	}
	/**
	 * Push the bomb to the current diff.
	 * @param fake Whether to push to the regular or fake array.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	push(fake?: boolean, freeze = true) {
		const temp = freeze ? deepCopy(this) : this;
		if (fake) {
			currentDiff.fakeBombs?.push(temp);
		} else {
			currentDiff.bombs.push(temp);
		}
	}
}
