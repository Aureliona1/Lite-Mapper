import { type Easing, deepCopy } from "@aurellis/lite-mapper";
import type { CustomEventName, PathAnimDataProps, Optional, PathAnimAnimationProps, CustomEventJSON } from "../../core/core.ts";
import { jsonPrune } from "../../utility/utility.ts";
import { currentDiff } from "../beatmap.ts";
import { HeckCustomEvent } from "./custom_event.ts";

/**
 * Path animation custom event.
 */
export class AssignPathAnimation extends HeckCustomEvent {
	/**
	 * Create a new path animation.
	 * @param track The track to target.
	 * @param time The time of the animation (leave blank for 0).
	 */
	constructor(track: string | string[] = "", time = 0) {
		super("AssignPathAnimation", time);
		this.track = track;
	}

	/**
	 * The data of the event.
	 */
	protected override d: PathAnimDataProps = {};

	/**
	 * The track/s to target for animation.
	 */
	get track(): Optional<string | string[]> {
		return this.d.track;
	}
	set track(x: Optional<string | string[]>) {
		this.d.track = x;
	}

	/**
	 * An easing to apply over the entire animation.
	 */
	get easing(): Optional<Easing> {
		return this.d.easing;
	}
	set easing(x: Optional<Easing>) {
		this.d.easing = x;
	}

	/**
	 * The properties that can be animated.
	 */
	get animate(): PathAnimAnimationProps {
		return this.d as PathAnimAnimationProps;
	}
	set animate(x: PathAnimAnimationProps) {
		this.d = { ...this.d, ...x };
		jsonPrune(this.d);
	}

	/**
	 * Return the animation as raw json.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	return(freeze = true): CustomEventJSON {
		const temp = freeze ? deepCopy(this) : this;
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
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	push(freeze = true) {
		currentDiff().customEvents.push(freeze ? deepCopy(this) : this);
	}
}
