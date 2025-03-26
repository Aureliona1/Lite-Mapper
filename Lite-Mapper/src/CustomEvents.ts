import { jsonPrune, copy } from "./Functions.ts";
import { currentDiff } from "./Map.ts";
import { CustomEventJSON, CustomEventName, TrackAnimDataProps, TrackAnimAnimationProps, PathAnimDataProps, PathAnimAnimationProps, TrackParentProps, PlayerObjectTarget, PlayerToTrackProps, ComponentAnimProps } from "./Types.ts";

/**
 * Internal function for Lite-Mapper that converts CE JSON to an instance of a CE class.
 * @param x Input Json.
 */
export function JSONToCE(x: CustomEventJSON) {
	if (x.t == "AnimateComponent") {
		return AnimateComponent.from(x);
	} else if (x.t == "AssignPathAnimation") {
		return AssignPathAnimation.from(x);
	} else if (x.t == "AssignPlayerToTrack") {
		return AssignPlayerToTrack.from(x);
	} else if (x.t == "AssignTrackParent") {
		return AssignTrackParent.from(x);
	} else {
		return AnimateTrack.from(x);
	}
}

/**
 * Convert custom event class into json.
 * @param x Custom Event class.
 */
export function CEToJSON(x: AnimateComponent | AnimateTrack | AssignPathAnimation | AssignPlayerToTrack | AssignTrackParent) {
	return x.return();
}

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
	get time() {
		return this.b;
	}
	get type() {
		return this.t;
	}
	set track(x) {
		this.d.track = x;
	}
	get track() {
		return this.d.track;
	}
	set duration(x) {
		this.d.duration = x;
	}
	get duration() {
		return this.d.duration;
	}
	get animate() {
		return this.d as TrackAnimAnimationProps;
	}
	set animate(x) {
		this.d = { ...this.d, ...x };
		jsonPrune(this.d);
	}
	get easing() {
		return this.d.easing;
	}
	set easing(x) {
		this.d.easing = x;
	}
	get repeat() {
		return this.d.repeat;
	}
	set repeat(x) {
		this.d.repeat = x;
	}
	/**
	 * Return the raw json of the animation.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true) {
		const temp = dupe ? copy(this) : this;
		const out = {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create a new instance of a track animation from valid CustomEvent JSON.
	 * @param x The JSON.
	 * @returns A track animation with converted props from the JSON (or a blank animation if the JSON is invalid).
	 */
	static from(x: CustomEventJSON) {
		const a = new AnimateTrack();
		if (x.t == "AnimateTrack") {
			a.d = x.d as TrackAnimDataProps;
			a.b = x.b;
		}
		return a;
	}
	/**
	 * Push the animation to the current difficulty.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.customEvents.push(dupe ? copy(this) : this);
	}
}

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

	set time(x) {
		this.b = x;
	}
	get time() {
		return this.b;
	}
	set track(x) {
		this.d.track = x;
	}
	get track() {
		return this.d.track;
	}
	get type() {
		return this.t;
	}
	set easing(x) {
		this.d.easing = x;
	}
	get easing() {
		return this.d.easing;
	}
	get animate() {
		return this.d as PathAnimAnimationProps;
	}
	set animate(x) {
		this.d = { ...this.d, ...x };
		jsonPrune(this.d);
	}
	/**
	 * Return the animation as raw json.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true) {
		const temp = dupe ? copy(this) : this;
		const out = {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create a new instance of a path animation from valid CustomEvent JSON.
	 * @param x The JSON.
	 * @returns A path animation, or a blank path animation if the JSON is invalid.
	 */
	static from(x: CustomEventJSON) {
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
		currentDiff.customEvents.push(dupe ? copy(this) : this);
	}
}

export class AssignTrackParent {
	/**
	 * Create a new track parent assignment.
	 * @param childTracks The child tracks to be affected.
	 * @param parentTrack The parent track.
	 * @param time The time of the assignment (leave blank for 0).
	 */
	constructor(childTracks: string[] = [], parentTrack: string = "", time = 0, worldPositionStays?: boolean) {
		this.childTracks = childTracks;
		this.parentTrack = parentTrack;
		this.time = time;
		if (worldPositionStays) {
			this.worldPositionStays = worldPositionStays;
		}
	}
	private b = 0;
	private t: CustomEventName = "AssignTrackParent";
	private d: TrackParentProps = { childrenTracks: [], parentTrack: "" };

	set time(x) {
		this.b = x;
	}
	get time() {
		return this.b;
	}
	get type() {
		return this.t;
	}
	set childTracks(x) {
		this.d.childrenTracks = x;
	}
	get childTracks() {
		return this.d.childrenTracks;
	}
	set parentTrack(x) {
		this.d.parentTrack = x;
	}
	get parentTrack() {
		return this.d.parentTrack;
	}
	get worldPositionStays() {
		return this.d.worldPositionStays;
	}
	set worldPositionStays(x) {
		this.d.worldPositionStays = x;
	}
	/**
	 * Return the parent track as json.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true) {
		const temp = dupe ? copy(this) : this;
		const out = {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create a new instance of a track parent from valid CustomEvent JSON.
	 * @param x The JSON.
	 * @returns A trrack parent, or a blank track parent if the JSON is invalid.
	 */
	static from(x: CustomEventJSON) {
		const a = new AssignTrackParent();
		if (x.t == "AssignTrackParent") {
			a.d = x.d as TrackParentProps;
			a.b = x.b;
		}
		return a;
	}
	/**
	 * Push the assignment to the current difficulty.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.customEvents.push(dupe ? copy(this) : this);
	}
}

export class AssignPlayerToTrack {
	/**
	 * Assign the player to a track.
	 * @param track The target track.
	 * @param time The time of the assignment (leave blank for 0).
	 * @param target The target section of the player to assign.
	 */
	constructor(track: string = "", time = 0, target?: PlayerObjectTarget) {
		this.time = time;
		this.track = track;
		this.target = target;
	}
	private b = 0;
	private t: CustomEventName = "AssignPlayerToTrack";
	private d: PlayerToTrackProps = {};

	set time(x) {
		this.b = x;
	}
	get time() {
		return this.b;
	}
	get type() {
		return this.t;
	}
	set track(x) {
		this.d.track = x;
	}
	get track() {
		return this.d.track;
	}
	set target(x) {
		this.d.target = x;
	}
	get target() {
		return this.d.target;
	}
	/**
	 * Return track assignment as json.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true) {
		const temp = dupe ? copy(this) : this;
		const out = {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create a new instance of a player track from valid CustomEvent JSON.
	 * @param x The JSON.
	 * @returns A player track event, or an empty player track event if the JSON is invalid.
	 */
	static from(x: CustomEventJSON) {
		const a = new AssignPlayerToTrack();
		if (x.t == "AssignPlayerToTrack") {
			a.d = x.d as PlayerToTrackProps;
			a.b = x.b;
		}
		return a;
	}
	/**
	 * Push track assignment to current difficulty.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.customEvents.push(dupe ? copy(this) : this);
	}
}

export class AnimateComponent {
	/**
	 * Animate a component track.
	 * @param track The track to target.
	 * @param time The time of the animation (leave blank for 0).
	 * @param duration The duration of the animation.
	 */
	constructor(track: string = "", time = 0, duration?: number) {
		this.track = track;
		this.time = time;
		this.duration = duration;
	}
	private b = 0;
	private t: CustomEventName = "AnimateComponent";
	private d: ComponentAnimProps = {};

	set time(x) {
		this.b = x;
	}
	get time() {
		return this.b;
	}
	get type() {
		return this.t;
	}
	set track(x) {
		this.d.track = x;
	}
	get track() {
		return this.d.track;
	}
	set duration(x) {
		this.d.duration = x;
	}
	get duration() {
		return this.d.duration;
	}
	set easing(x) {
		this.d.easing = x;
	}
	get easing() {
		return this.d.easing;
	}
	get fog() {
		return this.d.BloomFogEnvironment;
	}
	set fog(x) {
		this.d.BloomFogEnvironment = x;
	}
	get lightBloom() {
		return this.d.TubeBloomPrePassLight;
	}
	set lightBloom(x) {
		this.d.TubeBloomPrePassLight = x;
	}
	/**
	 * Return the animation as json.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true) {
		const temp = dupe ? copy(this) : this;
		const out = {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create a new instance of a component animation from valid CustomEvent JSON.
	 * @param x The JSON.
	 * @returns A component animation, or a blank component animation if the JSON is invalid.
	 */
	static from(x: CustomEventJSON) {
		const a = new AnimateComponent();
		if (x.t == "AnimateComponent") {
			a.d = x.d as ComponentAnimProps;
			a.b = x.b;
		}
		return a;
	}
	/**
	 * Push the animation to the current difficulty.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.customEvents.push(dupe ? copy(this) : this);
	}
}
