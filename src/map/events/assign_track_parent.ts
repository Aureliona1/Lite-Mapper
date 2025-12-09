import { deepCopy } from "@aurellis/helpers";
import type { CustomEventJSON, CustomEventName, Optional, TrackParentProps } from "../../core/core.ts";
import { jsonPrune } from "../../utility/utility.ts";
import { currentDiff } from "../beatmap.ts";

/**
 * Track parent assignment custom event.
 */
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

	set time(x: number) {
		this.b = x;
	}
	get time(): number {
		return this.b;
	}
	get type(): CustomEventName {
		return this.t;
	}
	set childTracks(x: string[]) {
		this.d.childrenTracks = x;
	}
	get childTracks(): string[] {
		return this.d.childrenTracks;
	}
	set parentTrack(x: string) {
		this.d.parentTrack = x;
	}
	get parentTrack(): string {
		return this.d.parentTrack;
	}
	get worldPositionStays(): Optional<boolean> {
		return this.d.worldPositionStays;
	}
	set worldPositionStays(x: Optional<boolean>) {
		this.d.worldPositionStays = x;
	}
	/**
	 * Return the parent track as json.
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
	 * Create a new instance of a track parent from valid HeckCustomEvent JSON.
	 * @param x The JSON.
	 * @returns A trrack parent, or a blank track parent if the JSON is invalid.
	 */
	static from(x: CustomEventJSON): AssignTrackParent {
		const a = new AssignTrackParent();
		if (x.t == "AssignTrackParent") {
			a.d = x.d as TrackParentProps;
			a.b = x.b;
		}
		return a;
	}
	/**
	 * Push the assignment to the current difficulty.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	push(freeze = true) {
		currentDiff.customEvents.push(freeze ? deepCopy(this) : this);
	}
}
