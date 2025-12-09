import { type Easing, deepCopy } from "@aurellis/lite-mapper";
import type { CustomEventName, PathAnimDataProps, Optional, PathAnimAnimationProps, CustomEventJSON } from "../../core/core.ts";
import { jsonPrune } from "../../utility/utility.ts";
import { currentDiff } from "../beatmap.ts";

/**
 * Path animation custom event.
 */
export class AssignPathAnimation {
	/**
	 * Create a new path animation.
	 * @param track The track to target.
	 * @param time The time of the animation (leave blank for 0).
	 */
	constructor(track: string | string[] = "", time = 0) {
		this.time = time;
		this.track = track;
	}
	private b = 0;
	private t: CustomEventName = "AssignPathAnimation";
	private d: PathAnimDataProps = {};

	set time(x: number) {
		this.b = x;
	}
	get time(): number {
		return this.b;
	}
	set track(x: Optional<string | string[]>) {
		this.d.track = x;
	}
	get track(): Optional<string | string[]> {
		return this.d.track;
	}
	get type(): CustomEventName {
		return this.t;
	}
	set easing(x: Optional<Easing>) {
		this.d.easing = x;
	}
	get easing(): Optional<Easing> {
		return this.d.easing;
	}
	get animate(): PathAnimAnimationProps {
		return this.d as PathAnimAnimationProps;
	}
	set animate(x: PathAnimAnimationProps) {
		this.d = { ...this.d, ...x };
		jsonPrune(this.d);
	}
	/**
	 * Return the animation as raw json.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): CustomEventJSON {
		const temp = dupe ? deepCopy(this) : this;
		const out = {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create a new instance of a path animation from valid HeckCustomEvent JSON.
	 * @param x The JSON.
	 * @returns A path animation, or a blank path animation if the JSON is invalid.
	 */
	static from(x: CustomEventJSON): AssignPathAnimation {
		const a = new AssignPathAnimation();
		if (x.t == "AssignPathAnimation") {
			a.d = x.d as PathAnimDataProps;
			a.b = x.b;
		}
		return a;
	}
	/**
	 * Push the animation to the current difficulty.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.customEvents.push(dupe ? deepCopy(this) : this);
	}
}
