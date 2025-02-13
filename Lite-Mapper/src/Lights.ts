import { LM_CONST } from "./Consts.ts";
import { copy, jsonPrune, lerp, repeat } from "./Functions.ts";
import { currentDiff } from "./Map.ts";
import { Easing, LightEventCustomData, LightEventJSON, LightEventTypes, LightEventValues, LightKeyframeFrameType, LightTypesNumericalValues, LightValueNumericalValues, Vec3, Vec4 } from "./Types.ts";

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
	constructor(public time = 0, public type: LightEventTypes = "BackLasers", public value: LightEventValues = "On", public customData: LightEventCustomData = {}, public floatValue = 1) {}

	set lightID(x) {
		this.customData.lightID = x;
	}
	get lightID() {
		return this.customData.lightID;
	}

	set color(x) {
		this.customData.color = x;
	}
	get color() {
		return this.customData.color;
	}

	set lerpType(x) {
		this.customData.lerpType = x;
	}
	get lerpType() {
		return this.customData.lerpType;
	}

	set easing(x) {
		this.customData.easing = x;
	}
	get easing() {
		return this.customData.easing;
	}
	/**
	 * Set the easing of the event (if "in" type).
	 */
	setEasing(ease: Easing) {
		this.easing = ease;
		return this;
	}
	/**
	 * Set the light id(s) of the event.
	 */
	setLightID(id: number | number[]) {
		this.lightID = id;
		return this;
	}
	/**
	 * Set the color of the event.
	 */
	setColor(col: Vec3 | Vec4) {
		this.color = col;
		return this;
	}
	/**
	 * Set the lightType of the event.
	 */
	setType(type: LightEventTypes) {
		this.type = type;
		return this;
	}
	/**
	 * Set the value of the event.
	 */
	setValue(val: LightEventValues) {
		this.value = val;
		return this;
	}
	/**
	 * Return the raw Json of the event.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true) {
		const temp = dupe ? copy(this) : this;
		const out: LightEventJSON = {
			b: temp.time,
			et: LM_CONST.LightEventTypesMap.get(temp.type),
			i: LM_CONST.LightEventValuesMap.get(temp.value),
			f: temp.floatValue,
			customData: temp.customData
		};
		jsonPrune(out);
		return out;
	}
	JSONToClass(x: LightEventJSON) {
		this.time = x.b;
		this.type = LM_CONST.LightEventTypesMap.revGet(x.et as LightTypesNumericalValues);
		this.value = LM_CONST.LightEventValuesMap.revGet(x.i as LightValueNumericalValues);
		if (x.customData) {
			this.customData = x.customData;
		}
		return this;
	}
	/**
	 * Push the event to the current diff.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		currentDiff.events.push(temp);
	}
}

export class lightGradient {
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

	private lightType: LightEventTypes = "BackLasers";
	private lightID?: number | number[];
	private lerpType?: "HSV" | "RGB";
	private ease?: Easing;

	/**
	 * Set the lightType
	 * @param type The lightType to run the event on.
	 */
	type(type: LightEventTypes) {
		this.lightType = type;
		return this;
	}
	/**
	 * Set the lightID/s
	 * @param id The light ids to run the event on.
	 */
	ID(id: number | number[]) {
		this.lightID = id;
		return this;
	}
	/**
	 * Set the lerp type.
	 * @param lerp Either lerp by HSV or RGB.
	 */
	lerp(lerp: "HSV" | "RGB") {
		this.lerpType = lerp;
		return this;
	}
	/**
	 * Set the easing for each transition.
	 * @param ease The easing.
	 */
	easing(ease: Easing) {
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
export function strobeGenerator(time: number, duration: number, density = 1, type: LightEventTypes, color: Vec3 | Vec4 = [1, 1, 1, 1], ids?: number | number[], ease?: Easing) {
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

export class LightKeyframe {
	/**
	 * Create a series of lighting events based on a keyframe system.
	 * @param time The time to start the animation.
	 * @param duration The duration of the animation.
	 * @param type The light type to target.
	 * @param ids The light id/s to target.
	 */
	constructor(public time = 0, public duration = 1, public type: LightEventTypes = "BackLasers", public ids?: number | number[]) {}
	private animation: LightKeyframeFrameType[] = [];
	get keyframes() {
		return this.animation.sort((a, b) => a[4] - b[4]);
	}
	set keyframes(x) {
		this.animation = x;
	}
	animationLength = 1;
	/**
	 * Add keyframes to your animation.
	 * @param frames The frames to add.
	 */
	addFrames(...frames: LightKeyframeFrameType[]) {
		this.keyframes = [...this.keyframes, ...frames];
		return this;
	}
	push(dupe = true) {
		const temp = dupe ? copy(this) : this;
		temp.keyframes.forEach(kf => {
			kf[4] /= this.animationLength;
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
