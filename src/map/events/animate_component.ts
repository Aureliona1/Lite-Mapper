import { deepCopy, type Easing } from "@aurellis/helpers";
import type { ComponentAnimProps, CustomEventJSON, CustomEventName, FogAnimationProps, Optional, TubeLightAnimationProps } from "../../core/core.ts";
import { jsonPrune } from "../../utility/utility.ts";
import { currentDiff } from "../beatmap.ts";
import { HeckCustomEvent } from "./custom_event.ts";

/**
 * Component animation custom event.
 */
export class AnimateComponent extends HeckCustomEvent {
	/**
	 * Animate a component track.
	 * @param track The track to target.
	 * @param time The time of the animation (leave blank for 0).
	 * @param duration The duration of the animation.
	 */
	constructor(track: string = "", time = 0, duration?: number) {
		super("AnimateComponent", time);
		this.track = track;
		this.duration = duration;
	}

	/**
	 * The data of the event.
	 */
	protected override d: ComponentAnimProps = {};

	/**
	 * The track to target with this animation.
	 */
	get track(): Optional<string> {
		return this.d.track;
	}
	set track(x: Optional<string>) {
		this.d.track = x;
	}

	/**
	 * The duration of the animation.
	 */
	get duration(): Optional<number> {
		return this.d.duration;
	}
	set duration(x: Optional<number>) {
		this.d.duration = x;
	}

	/**
	 * The easing of the animation.
	 */
	get easing(): Optional<Easing> {
		return this.d.easing;
	}
	set easing(x: Optional<Easing>) {
		this.d.easing = x;
	}

	/**
	 * Animated fog components.
	 */
	get fog(): Optional<FogAnimationProps> {
		return this.d.BloomFogEnvironment;
	}
	set fog(x: Optional<FogAnimationProps>) {
		this.d.BloomFogEnvironment = x;
	}

	/**
	 * Animated light bloom components.
	 */
	get lightBloom(): Optional<TubeLightAnimationProps> {
		return this.d.TubeBloomPrePassLight;
	}
	set lightBloom(x: Optional<TubeLightAnimationProps>) {
		this.d.TubeBloomPrePassLight = x;
	}

	/**
	 * Return the animation as json.
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
	 * Create a new instance of a component animation from valid HeckCustomEvent JSON.
	 * @param x The JSON.
	 * @returns A component animation, or a blank component animation if the JSON is invalid.
	 */
	static from(x: CustomEventJSON): AnimateComponent {
		const a = new AnimateComponent();
		if (x.t == "AnimateComponent") {
			a.d = x.d as ComponentAnimProps;
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
