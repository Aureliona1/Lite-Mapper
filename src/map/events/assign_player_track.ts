import { deepCopy } from "@aurellis/helpers";
import type { CustomEventJSON, CustomEventName, Optional, PlayerObjectTarget, PlayerToTrackProps } from "../../core/core.ts";
import { jsonPrune } from "../../utility/utility.ts";
import { currentDiff } from "../beatmap.ts";

/**
 * Player track assignment custom event.
 */
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

	set time(x: number) {
		this.b = x;
	}
	get time(): number {
		return this.b;
	}
	get type(): CustomEventName {
		return this.t;
	}
	set track(x: Optional<string>) {
		this.d.track = x;
	}
	get track(): Optional<string> {
		return this.d.track;
	}
	set target(x: Optional<PlayerObjectTarget>) {
		this.d.target = x;
	}
	get target(): Optional<PlayerObjectTarget> {
		return this.d.target;
	}
	/**
	 * Return track assignment as json.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): CustomEventJSON {
		const temp = dupe ? deepCopy(this) : this;
		const out = {
			b: temp.b,
			t: temp.t,
			d: temp.d
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create a new instance of a player track from valid HeckCustomEvent JSON.
	 * @param x The JSON.
	 * @returns A player track event, or an empty player track event if the JSON is invalid.
	 */
	static from(x: CustomEventJSON): AssignPlayerToTrack {
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
		currentDiff.customEvents.push(dupe ? deepCopy(this) : this);
	}
}
