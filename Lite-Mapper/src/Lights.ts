// deno-lint-ignore-file no-explicit-any
import { jsonPrune, currentDiff, Vec3, Vec4, Easing, LightEventCustomData, LightEventType, LightEventTypes, LightEventValues } from "./LiteMapper.ts";

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
	public type: LightEventTypes = "BackLasers";
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
	 */
	return(): LightEventType {
		jsonPrune(this);
		return {
			b: this.time,
			et: LightEventTypesMap.get(this.type),
			i: LightEventValuesMap.get(this.value),
			f: this.floatValue,
			customData: this.customData
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
	 */
	push() {
		jsonPrune(this);
		currentDiff.events.push(this);
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
	type(type: LightEventTypes = "BackLasers") {
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
