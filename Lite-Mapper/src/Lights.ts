// deno-lint-ignore-file no-explicit-any
import { jsonPrune, currentDiff, Vec3, Vec4, Easing, LightEventCustomData, LightEventType, LightEventTypes, LightEventValues, repeat, lerp, copy, LightKeyframeFrameType } from "./LiteMapper.ts";

class TwoWayMap {
	private reverseMap: Record<any, any>;
	constructor(private map: Record<any, any>) {
		this.map = map;
		this.reverseMap = {};
		for (const key in map) {
			const value = map[key];
			this.reverseMap[value] = key;
		}
	}
	get(key: any) {
		return this.map[key];
	}
	revGet(key: any) {
		return this.reverseMap[key];
	}
}

const LightEventTypesMap = new TwoWayMap({
	BackLasers: 0,
	RingLights: 1,
	LeftLasers: 2,
	RightLasers: 3,
	CenterLights: 4,
	BoostColors: 5,
	RingSpin: 8,
	RingZoom: 9,
	LeftLaserSpeed: 12,
	RightLaserSpeed: 13
});

const LightEventValuesMap = new TwoWayMap({
	Off: 0,
	OnBlue: 1,
	FlashBlue: 2,
	FadeBlue: 3,
	Transition: 4,
	TransitionBlue: 4,
	On: 5,
	OnRed: 5,
	FlashRed: 6,
	FadeRed: 7,
	TransitionRed: 8,
	OnWhite: 9,
	FlashWhite: 10,
	FadeWhite: 11,
	TransitionWhite: 12
});

export class LightEvent {
	/**
	 * Create a new lighting event.
	 * @param time The time of the event.
	 */
	constructor(public time = 0) {}
	type: LightEventTypes = "BackLasers";
	value: LightEventValues = "OnRed";
	floatValue = 1;
	customData: LightEventCustomData = {};

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

	setLightID(id: number | number[]) {
		this.lightID = id;
		return this;
	}
	setColor(col: Vec3 | Vec4) {
		this.color = col;
		return this;
	}
	setType(type: LightEventTypes) {
		this.type = type;
		return this;
	}
	setValue(val: LightEventValues) {
		this.value = val;
		return this;
	}
	/**
	 * Return the raw Json of the event.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): LightEventType {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		return {
			b: temp.time,
			et: LightEventTypesMap.get(temp.type),
			i: LightEventValuesMap.get(temp.value),
			f: temp.floatValue,
			customData: temp.customData
		};
	}
	JSONToClass(x: LightEventType) {
		this.time = x.b;
		this.type = LightEventTypesMap.revGet(x.et);
		this.value = LightEventValuesMap.revGet(x.i);
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

	/**push the gradient to the difficulty */
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
 * @param ease Whether to use an easing on the strobe. Any special easings like, bounce, elastic, etc... will yield very weird results.
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
	add(...frames: LightKeyframeFrameType[]) {
		frames.forEach(x => {
			this.keyframes.push(x);
		});
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
