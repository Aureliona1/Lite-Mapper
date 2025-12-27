import { deepCopy, type Vec2 } from "@aurellis/helpers";
import type { BombJSON, NoteCustomProps, Optional } from "../core/types.ts";
import { currentDiff } from "../map/beatmap.ts";
import { jsonPrune } from "../utility/helpers.ts";
import { GameplayObject } from "./object.ts";

/**
 * Bomb gameplay object.
 */
export class Bomb extends GameplayObject {
	/**
	 * Create a new bomb.
	 * @param time The time of the bomb (Default - 0).
	 * @param pos The [x, y] of the bomb (Default - [0, 0]).
	 */
	constructor(public time = 0, pos: Vec2 = [0, 0]) {
		super(pos);
	}
	/**
	 * The bomb custom properties.
	 */
	override customData: NoteCustomProps = {};

	/**
	 * Whether to disable the bomb "gravity" spawn effect.
	 */
	get disableBombGravity(): Optional<boolean> {
		return this.customData.disableNoteGravity;
	}
	set disableBombGravity(x: Optional<boolean>) {
		this.customData.disableNoteGravity = x;
	}

	/**
	 * Whether to disable the bomb "looking" effect.
	 */
	get disableBombLook(): Optional<boolean> {
		return this.customData.disableNoteLook;
	}
	set disableBombLook(x: Optional<boolean>) {
		this.customData.disableNoteLook = x;
	}

	/**
	 * Whether to enable the bomb "spawn effect".
	 */
	get spawnEffect(): Optional<boolean> {
		return this.customData.spawnEffect;
	}
	set spawnEffect(x: Optional<boolean>) {
		this.customData.spawnEffect = x;
	}

	/**
	 * Return the raw JSON of the bomb.
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
			currentDiff().fakeBombs?.push(temp);
		} else {
			currentDiff().bombs.push(temp);
		}
	}
}
