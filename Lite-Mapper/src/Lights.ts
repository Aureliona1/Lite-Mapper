// deno-lint-ignore-file no-explicit-any
import { jsonPrune, currentDiff } from "./LiteMapper.ts";
import { LightEventTypes, LightEventValues, LightEventCustomData, LightEventType } from "./Types.ts";

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
