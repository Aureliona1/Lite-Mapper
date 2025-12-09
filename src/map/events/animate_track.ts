import { deepCopy, type Easing } from "@aurellis/helpers";
import type { CustomEventJSON, CustomEventName, Optional, TrackAnimAnimationProps, TrackAnimDataProps } from "../../core/core.ts";
import { jsonPrune } from "../../utility/utility.ts";
import { currentDiff } from "../beatmap.ts";

/**
 * Track animation custom event.
 */
export class AnimateTrack {
	/**
	 * Create a new track animation.
	 * @param track The track to target.
	 * @param time The time of the animation (leave blank for 0).
	 * @param duration The duration of the animation.
	 */
	constructor(track: string | string[] = "", time = 0, duration?: number) {
		this.track = track;
		this.time = time;
		this.duration = duration;
	}
	private b = 0;
	private t: CustomEventName = "AnimateTrack";
	private d: TrackAnimDataProps = {};

	set time(x: number) {
		this.b = x;
	}
	get time(): number {
		return this.b;
	}
	get type(): CustomEventName {
		return this.t;
	}
	set track(x: Optional<string | string[]>) {
		this.d.track = x;
	}
	get track(): Optional<string | string[]> {
		return this.d.track;
	}
	set duration(x: Optional<number>) {
		this.d.duration = x;
	}
	get duration(): Optional<number> {
		return this.d.duration;
	}
	get animate(): TrackAnimAnimationProps {
		return this.d as TrackAnimAnimationProps;
	}
	set animate(x: TrackAnimAnimationProps) {
		this.d = { ...this.d, ...x };
		jsonPrune(this.d);
	}
	get easing(): Optional<Easing> {
		return this.d.easing;
	}
	set easing(x: Optional<Easing>) {
		this.d.easing = x;
	}
	get repeat(): Optional<number> {
		return this.d.repeat;
	}
	set repeat(x: Optional<number>) {
		this.d.repeat = x;
	}
	/**
	 * Return the raw json of the animation.
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
	 * Create a new instance of a track animation from valid HeckCustomEvent JSON.
	 * @param x The JSON.
	 * @returns A track animation with converted props from the JSON (or a blank animation if the JSON is invalid).
	 */
	static from(x: CustomEventJSON): AnimateTrack {
		const a = new AnimateTrack();
		if (x.t == "AnimateTrack") {
			a.d = x.d as TrackAnimDataProps;
			a.b = x.b;
		}
		return a;
	}
	/**
	 * Push the animation to the current difficulty.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	push(freeze = true) {
		currentDiff.customEvents.push(freeze ? deepCopy(this) : this);
	}
}
