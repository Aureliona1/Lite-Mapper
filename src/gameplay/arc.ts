import { deepCopy, type Vec2 } from "@aurellis/helpers";
import { GameplayObject } from "./object.ts";
import { ObjectColorsMap, ObjectDirectionsMap, type ObjectColorName, type ObjectColorNumber, type ObjectDirectionName, type ObjectDirectionNumber, type Optional, type SliderCustomProps, type SliderJSON } from "../core/core.ts";
import { jsonPrune } from "../utility/utility.ts";
import { currentDiff } from "../map/map.ts";

/**
 * Beatmap arc object.
 */
export class Arc extends GameplayObject {
	/**
	 * Create a new arc.
	 * @param time The time of the arc (Default - 0).
	 * @param pos The starting position of the arc (Default - [0, 0]).
	 * @param type (string) The color of the arc (left / right) (Default - "Left").
	 * @param headDirection (string) The starting direction of the arc (Default - "Up").
	 * @param tailBeat The final beat of the arc (Default - 1).
	 * @param tailPos The final position of the arc (Default - [0, 0]).
	 * @param tailDirection The direction of the end of the arc (Default - "Down").
	 */
	constructor(public time = 0, pos: Vec2 = [0, 0], public type: ObjectColorName = "Left", public headDirection: ObjectDirectionName = "Up", public tailBeat = 1, public tailPos: Vec2 = [0, 0], public tailDirection: ObjectDirectionName = "Down") {
		super(pos);
	}
	/**
	 * The arc head multiplier (see beatmap v3 spec).
	 */
	headMultiplier = 1;
	/**
	 * The arc tail multiplier (see beatmapp v3 spec).
	 */
	tailMultiplier = 1;
	/**
	 * The arc anchor mode (see beatmap v3 spec).
	 */
	anchorMode = 1;
	/**
	 * The raw custom data of the arc.
	 */
	override customData: SliderCustomProps = {};

	/**
	 * Whether to use the "gravity" spawn effect for this arc.
	 */
	get disableNoteGravity(): Optional<boolean> {
		return this.customData.disableNoteGravity;
	}
	set disableNoteGravity(x: Optional<boolean>) {
		this.customData.disableNoteGravity = x;
	}

	/**
	 * The x position of the tail of the arc.
	 */
	get tx(): number {
		return this.tailPos[0];
	}
	set tx(x: number) {
		this.tailPos[0] = x;
	}

	/**
	 * The y position of the tail of the arc.
	 */
	get ty(): number {
		return this.tailPos[1];
	}
	set ty(x: number) {
		this.tailPos[1] = x;
	}

	/**
	 * Return the raw Json of the arc.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	override return(freeze = true): SliderJSON {
		const temp = freeze ? deepCopy(this) : this;
		const out: SliderJSON = {
			b: temp.time,
			c: ObjectColorsMap.get(temp.type),
			x: temp.x,
			y: temp.y,
			d: ObjectDirectionsMap.get(temp.headDirection),
			mu: temp.headMultiplier,
			tb: temp.tailBeat,
			tx: temp.tx,
			ty: temp.ty,
			tc: ObjectDirectionsMap.get(temp.tailDirection),
			tmu: temp.tailMultiplier,
			m: temp.anchorMode,
			customData: temp.customData
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create an instance of an arc from valid slider JSON.
	 * @param x The JSON.
	 * @returns An arc.
	 */
	static from(x: SliderJSON): Arc {
		const n = new Arc(x.b);
		n.type = ObjectColorsMap.revGet((x.c ?? 0) as ObjectColorNumber);
		n.x = x.x ?? 0;
		n.y = x.y ?? 0;
		n.headDirection = ObjectDirectionsMap.revGet((x.d ?? 0) as ObjectDirectionNumber);
		n.headMultiplier = x.mu ?? 0;
		n.tailBeat = x.tb ?? 0;
		n.tx = x.tx ?? 0;
		n.ty = x.ty ?? 0;
		n.tailDirection = ObjectDirectionsMap.revGet((x.tc ?? 0) as ObjectDirectionNumber);
		n.tailMultiplier = x.tmu ?? 0;
		n.anchorMode = x.m ?? 0;
		if (x.customData) {
			n.customData = x.customData;
		}
		return n;
	}
	/**
	 * Push the arc to the current diff.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	push(freeze = true) {
		currentDiff().arcs.push(freeze ? deepCopy(this) : this);
	}
}
