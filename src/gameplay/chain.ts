import { type Vec2, deepCopy } from "@aurellis/helpers";
import { ObjectColorsMap, ObjectDirectionsMap, type BurstSliderJSON, type ObjectColorName, type ObjectColorNumber, type ObjectDirectionName, type ObjectDirectionNumber, type Optional, type SliderCustomProps } from "../core/core.ts";
import { currentDiff } from "../map/map.ts";
import { jsonPrune } from "../utility/utility.ts";
import { GameplayObject } from "./object.ts";

/**
 * A beatmap chain object.
 */
export class Chain extends GameplayObject {
	/**
	 * Create a new chain (burstSlider) object.
	 * @param time The time of the chain (Default - 0).
	 * @param pos The [x, y] of the chain (Default - [0, 0]).
	 * @param type (string) The type of the chain (left/right) (Default - "Left").
	 * @param direction (string) The cut direction of the head of the chain (Default - "Down").
	 * @param tailBeat The beat at the end of the chain (Default - 1).
	 * @param tailPos The [x, y] of the end of the chain (Default - [0, 0]).
	 * @param segments The number of segments in the chain (Default - 5).
	 */
	constructor(public time = 0, public pos: Vec2 = [0, 0], public type: ObjectColorName = "Left", public direction: ObjectDirectionName = "Down", public tailBeat = 1, public tailPos: Vec2 = [0, 0], public segments = 5) {
		super();
	}

	/**
	 * The factor to "squish" the segments together by.
	 * Setting this to 0 will crash the game.
	 */
	squishFactor = 1;

	/**
	 * The raw custom data of the chain.
	 */
	override customData: SliderCustomProps = {};

	/**
	 * Whether the chain should have the "gravity" effect.
	 */
	get disableNoteGravity(): Optional<boolean> {
		return this.customData.disableNoteGravity;
	}
	set disableNoteGravity(x: Optional<boolean>) {
		this.customData.disableNoteGravity = x;
	}

	/**
	 * The x position of the head of the chain.
	 */
	get x(): number {
		return this.pos[0];
	}
	set x(x: number) {
		this.pos[0] = x;
	}

	/**
	 * The y position of the head of the chain.
	 */
	get y(): number {
		return this.pos[1];
	}
	set y(x: number) {
		this.pos[1] = x;
	}

	/**
	 * The x position of the tail of the chain.
	 */
	get tx(): number {
		return this.tailPos[0];
	}
	set tx(x: number) {
		this.tailPos[0] = x;
	}

	/**
	 * The y position of the tail of the chain.
	 */
	get ty(): number {
		return this.tailPos[1];
	}
	set ty(x: number) {
		this.tailPos[1] = x;
	}

	/**
	 * Return the raw Json of the chain.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	override return(freeze = true): BurstSliderJSON {
		const temp = freeze ? deepCopy(this) : this;
		const out: BurstSliderJSON = {
			b: temp.time,
			x: temp.x,
			y: temp.y,
			c: ObjectColorsMap.get(temp.type),
			d: ObjectDirectionsMap.get(temp.direction),
			tb: temp.tailBeat,
			tx: temp.tx,
			ty: temp.ty,
			sc: temp.segments,
			s: temp.squishFactor,
			customData: temp.customData
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create an instance of a chain from valid burst slider JSON.
	 * @param x The JSON.
	 * @returns A chain.
	 */
	static from(x: BurstSliderJSON): Chain {
		const n = new Chain(x.b);
		n.x = x.x ?? 0;
		n.y = x.y ?? 0;
		n.type = ObjectColorsMap.revGet((x.c ?? 0) as ObjectColorNumber);
		n.direction = ObjectDirectionsMap.revGet((x.d ?? 0) as ObjectDirectionNumber);
		n.tailBeat = x.tb ?? 0;
		n.tx = x.tx ?? 0;
		n.ty = x.ty ?? 0;
		n.segments = x.sc ?? 0;
		n.squishFactor = x.s ?? 1;
		if (x.customData) {
			n.customData = x.customData;
		}
		return n;
	}
	/**
	 * Push the chain to the current diff.
	 * @param fake Whether to push to the regular or fake array.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	push(fake?: boolean, freeze = true) {
		const temp = freeze ? deepCopy(this) : this;
		if (fake) {
			currentDiff.fakeChains?.push(temp);
		} else {
			currentDiff.chains.push(temp);
		}
	}
}
