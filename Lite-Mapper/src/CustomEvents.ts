import { ComponentAnimProps, CustomEventNames, CustomEventType, PathAnimAllProps, PathAnimProps, PlayerObjectControllers, PlayerToTrackProps, TrackAnimAllProps, TrackAnimProps, TrackParentProps, copy, currentDiff, jsonPrune } from "./mod.ts";

/**
 * Convert custom event json into respective class.
 * @param x Input Json.
 */
export function JSONToCE(x: CustomEventType) {
	if (x.t == "AnimateComponent") {
		return new AnimateComponent().JSONToClass(x);
	} else if (x.t == "AssignPathAnimation") {
		return new AssignPathAnimation().JSONToClass(x);
	} else if (x.t == "AssignPlayerToTrack") {
		return new AssignPlayerToTrack().JSONToClass(x);
	} else if (x.t == "AssignTrackParent") {
		return new AssignTrackParent().JSONToClass(x);
	} else {
		return new AnimateTrack().JSONToClass(x);
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
	private t: CustomEventNames = "AnimateTrack";
	private d: TrackAnimAllProps = {};

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
		return this.d as TrackAnimProps;
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
		jsonPrune(temp);
		return {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
	}
	/**
	 * Push the animation to the current difficulty.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.customEvents.push(dupe ? copy(this) : this);
	}
	/**
	 * Convert raw custom event json into a track animation.
	 * @param x Input Json.
	 */
	JSONToClass(x: CustomEventType) {
		if (x.t == "AnimateTrack") {
			this.d = x.d as TrackAnimAllProps;
			this.b = x.b;
			jsonPrune(this);
		}
		return this;
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
	private t: CustomEventNames = "AssignPathAnimation";
	private d: PathAnimAllProps = {};

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
		return this.d as PathAnimProps;
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
		jsonPrune(temp);
		return {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
	}
	/**
	 * Push the animation to the current difficulty.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.customEvents.push(dupe ? copy(this) : this);
	}
	/**
	 * Converts raw custom event json into a path animation.
	 * @param x Input Json.
	 */
	JSONToClass(x: CustomEventType) {
		if (x.t == "AssignPathAnimation") {
			this.d = x.d as PathAnimAllProps;
			this.b = x.b;
			jsonPrune(this);
		}
		return this;
	}
}

export class AssignTrackParent {
	/**
	 * Create a new track parent assignment.
	 * @param childTracks The child tracks to be affected.
	 * @param parentTrack The parent track.
	 * @param time The time of the assignment (leave blank for 0).
	 */
	constructor(childTracks: string[] = [], parentTrack: string = "", time = 0) {
		this.childTracks = childTracks;
		this.parentTrack = parentTrack;
		this.time = time;
	}
	private b = 0;
	private t: CustomEventNames = "AssignTrackParent";
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
		jsonPrune(temp);
		return {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
	}
	/**
	 * Push the assignment to the current difficulty.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.customEvents.push(dupe ? copy(this) : this);
	}
	/**
	 * Convert raw custom event json into a parent track.
	 * @param x Input Json.
	 */
	JSONToClass(x: CustomEventType) {
		if (x.t == "AssignTrackParent") {
			this.d = x.d as TrackParentProps;
			this.b = x.b;
			jsonPrune(this);
		}
		return this;
	}
}

export class AssignPlayerToTrack {
	/**
	 * Assign the player to a track.
	 * @param track The target track.
	 * @param time The time of the assignment (leave blank for 0).
	 * @param target The target section of the player to assign.
	 */
	constructor(track: string = "", time = 0, target?: PlayerObjectControllers) {
		this.time = time;
		this.track = track;
		this.target = target;
	}
	private b = 0;
	private t: CustomEventNames = "AssignPlayerToTrack";
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
		jsonPrune(temp);
		return {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
	}
	/**
	 * Push track assignment to current difficulty.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.customEvents.push(dupe ? copy(this) : this);
	}
	/**
	 * Convert custom event json into player track assignment.
	 * @param x Input Json.
	 */
	JSONToClass(x: CustomEventType) {
		if (x.t == "AssignPlayerToTrack") {
			this.d = x.d as PlayerToTrackProps;
			this.b = x.b;
			jsonPrune(this);
		}
		return this;
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
	private t: CustomEventNames = "AnimateComponent";
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
		jsonPrune(temp);
		return {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
	}
	/**
	 * Push the animation to the current difficulty.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.customEvents.push(dupe ? copy(this) : this);
	}
	/**
	 * Convert custom event json into a component animation.
	 * @param x Input Json.
	 */
	JSONToClass(x: CustomEventType) {
		if (x.t == "AnimateComponent") {
			this.d = x.d as ComponentAnimProps;
			this.b = x.b;
			jsonPrune(this);
		}
		return this;
	}
}
