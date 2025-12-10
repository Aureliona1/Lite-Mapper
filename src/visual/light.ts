import { deepCopy, type Easing, lerp, type Vec3, type Vec4 } from "@aurellis/helpers";
import { type KFColorVec4, type LightEventCustomData, type LightEventJSON, LightEventTypesMap, LightEventValuesMap, type LightTypeName, type LightTypeNumber, type LightValueName, type LightValueNumber, type Optional } from "../core/core.ts";
import { currentDiff } from "../map/map.ts";
import { jsonPrune, repeat } from "../utility/helpers.ts";

/**
 * An event that changes the state of one or more light objects.
 */
export class LightEvent {
	/**
	 * Create a new lighting event. Every parameter is optional and can be added later.
	 *
	 * For example:
	 * ```ts
	 * const event = new LightEvent();
	 * event.time = 10;
	 * event.type = "LeftLasers";
	 * event.value = "On";
	 * event.push();
	 * ```
	 * Additionally, you can create an entire light event in a single line using methods.
	 * ```ts
	 * new LightEvent(10, "BackLasers", "On").setColor([1, 0, 0, 1]).setLightID(69).push();
	 * ```
	 * @param time The time of the event (Default - 0).
	 * @param type (string) The event type (Default - "BackLasers").
	 * @param value (string) The event value (Default - "On").
	 * @param customData Custom data to add to the event (you can do this later with methods like `.setColor()`).
	 * @param floatValue This controls the brightness of the light, avoid using this, use alpha on color.
	 */
	constructor(public time = 0, public type: LightTypeName = "BackLasers", public value: LightValueName = "On", public customData: LightEventCustomData = {}, public floatValue = 1) {}

	/**
	 * The light id/s to target with this event.
	 */
	get lightID(): Optional<number | number[]> {
		return this.customData.lightID;
	}
	set lightID(x: Optional<number | number[]>) {
		this.customData.lightID = x;
	}

	/**
	 * The color of the event.
	 */
	get color(): Optional<Vec3 | Vec4> {
		return this.customData.color;
	}
	set color(x: Optional<Vec3 | Vec4>) {
		this.customData.color = x;
	}

	/**
	 * The interpolation method for transition events.
	 */
	get lerpType(): Optional<"HSV" | "RGB"> {
		return this.customData.lerpType;
	}
	set lerpType(x: Optional<"HSV" | "RGB">) {
		this.customData.lerpType = x;
	}

	/**
	 * The easing type to use for transition events.
	 */
	get easing(): Optional<Easing> {
		return this.customData.easing;
	}
	set easing(x: Optional<Easing>) {
		this.customData.easing = x;
	}

	/**
	 * Set the easing of the event (if "in" type).
	 */
	setEasing(ease: Easing): this {
		this.easing = ease;
		return this;
	}
	/**
	 * Set the light id(s) of the event.
	 */
	setLightID(id: number | number[]): this {
		this.lightID = id;
		return this;
	}
	/**
	 * Set the color of the event.
	 */
	setColor(col: Vec3 | Vec4): this {
		this.color = col;
		return this;
	}
	/**
	 * Set the lightType of the event.
	 */
	setType(type: LightTypeName): this {
		this.type = type;
		return this;
	}
	/**
	 * Set the value of the event.
	 */
	setValue(val: LightValueName): this {
		this.value = val;
		return this;
	}
	/**
	 * Return the raw Json of the event.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	return(freeze = true): LightEventJSON {
		const temp = freeze ? deepCopy(this) : this;
		const out: LightEventJSON = {
			b: temp.time,
			et: LightEventTypesMap.get(temp.type),
			i: LightEventValuesMap.get(temp.value),
			f: temp.floatValue,
			customData: temp.customData
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create an instance of a light event from valid light event JSON.
	 * @param x The JSON.
	 * @returns An event.
	 */
	static from(x: LightEventJSON): LightEvent {
		const e = new LightEvent(x.b);
		e.type = LightEventTypesMap.revGet(x.et as LightTypeNumber);
		e.value = LightEventValuesMap.revGet(x.i as LightValueNumber);
		if (x.customData) {
			e.customData = x.customData;
		}
		return e;
	}
	/**
	 * Push the event to the current diff.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	push(freeze = true) {
		const temp = freeze ? deepCopy(this) : this;
		jsonPrune(temp);
		currentDiff().events.push(temp);
	}
}

/**
 * A light transition effect from one color to another.
 */
export class LightGradient {
	/**
	 * Create simple lighting gradients.
	 * @param time The time to start the gradient.
	 * @param duration The duration of the gradient.
	 * @param type The light type to use.
	 * @param colors The colors to include in the gradient.
	 * @param lerpType The color lerp to use.
	 * @param easing The easing to use on each color.
	 */
	constructor(public time = 0, public duration = 1, public colors: (Vec3 | Vec4)[]) {}

	private lightType: LightTypeName = "BackLasers";
	private lightID?: number | number[];
	private lerpType?: "HSV" | "RGB";
	private ease?: Easing;

	/**
	 * Set the lightType
	 * @param type The lightType to run the event on.
	 */
	type(type: LightTypeName): this {
		this.lightType = type;
		return this;
	}
	/**
	 * Set the lightID/s
	 * @param id The light ids to run the event on.
	 */
	ID(id: number | number[]): this {
		this.lightID = id;
		return this;
	}
	/**
	 * Set the lerp type.
	 * @param lerp Either lerp by HSV or RGB.
	 */
	lerp(lerp: "HSV" | "RGB"): this {
		this.lerpType = lerp;
		return this;
	}
	/**
	 * Set the easing for each transition.
	 * @param ease The easing.
	 */
	easing(ease: Easing): this {
		this.ease = ease;
		return this;
	}

	/**Push the gradient to the difficulty */
	push() {
		const ev = new LightEvent(this.time).setType(this.lightType).setValue("On").setColor(this.colors[0]);
		if (this.lightID) {
			ev.lightID = this.lightID;
		}
		ev.push();
		let i = 0;
		this.colors.forEach(color => {
			if (i !== 0) {
				const ev = new LightEvent((i * this.duration) / (this.colors.length - 1) + this.time).setColor(color).setValue("Transition").setType(this.lightType);
				if (this.ease) {
					ev.easing = this.ease;
				}
				if (this.lerpType) {
					ev.lerpType = this.lerpType;
				}
				if (this.lightID) {
					ev.lightID = this.lightID;
				}
				ev.push();
			}
			i++;
		});
	}
}

/**
 * Creates a strobe sequence. With `density` number of events every beat.
 * @param time The time to start the strobe.
 * @param duration The duration of the strobe.
 * @param density How many times per beat to add a strobe event, or one event every 1/density beats.
 * @param type The event type to use.
 * @param color The on color to use, the off color will always be [0,0,0,0]. Can also be a boolean to use vanilla colors.
 * @param ids Specific ids to target.
 * @param ease Whether to use an easing on the strobe. Any special easings like bounce, elastic, etc... will yield very weird results.
 */
export function generateStrobe(time: number, duration: number, density = 1, type: LightTypeName, color: Vec3 | Vec4 = [1, 1, 1, 1], ids?: number | number[], ease?: Easing) {
	repeat(duration * density, i => {
		let t = 0;
		if (ease) {
			t = lerp(time, time + duration, i / (duration * density), ease);
		} else {
			t = time + i / density;
		}
		if (i % 2 == 0) {
			const on = new LightEvent(t).setValue("On").setColor(color);
			if (ids) {
				on.lightID = ids;
			}
			if (type) {
				on.type = type;
			}
			on.push();
		} else {
			const off = new LightEvent(t).setValue("On").setColor([0, 0, 0, 0]);
			if (ids) {
				off.lightID = ids;
			}
			if (type) {
				off.type = type;
			}
			off.push();
		}
	});
}

/**
 * A lighting animation defined by keyframes. This class can replace both the {@link generateStrobe} and {@link LightGradient}.
 */
export class LightAnimation {
	/**
	 * Create a series of lighting events based on a keyframe system.
	 * @param time The time to start the animation.
	 * @param duration The duration of the animation.
	 * @param type The light type to target.
	 * @param ids The light id/s to target.
	 */
	constructor(public time = 0, public duration = 1, public type: LightTypeName = "BackLasers", public ids?: number | number[]) {}
	private animation: KFColorVec4[] = [];

	/**
	 * Get the animation keyframes in sorted order (by time).
	 */
	get keyframes(): KFColorVec4[] {
		return this.animation.sort((a, b) => a[4] - b[4]);
	}
	set keyframes(x: KFColorVec4[]) {
		this.animation = x;
	}

	/**
	 * `false` - Time values are handled as a factor of duration (0 - 1).
	 *
	 * `true` - Time value are handled as beats from the start time (0 - duration).
	 */
	useTimeInBeats = false;

	/**
	 * Add keyframes to your animation.
	 * @param frames The frames to add.
	 */
	addFrames(...frames: KFColorVec4[]): this {
		this.keyframes = [...this.keyframes, ...frames];
		return this;
	}

	/**
	 * Push the keyframes to the active difficulty.
	 * @param freeze Whether to freeze the object properties on push.
	 */
	push(freeze = true) {
		const temp = freeze ? deepCopy(this) : this;
		temp.keyframes.forEach(kf => {
			if (this.useTimeInBeats) kf[4] /= this.duration;
			const time = this.time + kf[4] * this.duration;
			if (kf[4] == 0 || kf[5] == "easeStep") {
				const ev = new LightEvent(time).setType(this.type).setValue("On").setColor([kf[0], kf[1], kf[2], kf[3]]);
				if (this.ids) {
					ev.lightID = this.ids;
				}
				ev.push();
			} else {
				const ev = new LightEvent(time).setType(this.type).setValue("Transition").setColor([kf[0], kf[1], kf[2], kf[3]]);
				if (this.ids) {
					ev.lightID = this.ids;
				}
				ev.easing = kf[5];
				ev.lerpType = kf[6];
				ev.push();
			}
		});
	}
}
