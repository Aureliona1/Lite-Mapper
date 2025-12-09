import { deepCopy } from "@aurellis/helpers";
import type { CustomEventJSON, CustomEventName, Optional, PlayerObjectTarget, PlayerToTrackProps } from "../../core/core.ts";
import { jsonPrune } from "../../utility/utility.ts";
import { currentDiff } from "../beatmap.ts";
import { HeckCustomEvent } from "./custom_event.ts";

/**
 * Player track assignment custom event.
 */
export class AssignPlayerToTrack extends HeckCustomEvent {
	/**
	 * Assign the player to a track.
	 * @param track The target track.
	 * @param time The time of the assignment (leave blank for 0).
	 * @param target The target section of the player to assign.
	 */
	constructor(track: string = "", time = 0, target?: PlayerObjectTarget) {
		super("AssignPlayerToTrack", time);
		this.track = track;
		this.target = target;
	}

	/**
	 * The data of the event.
	 */
	protected override d: PlayerToTrackProps = {};

	/**
	 * The track to assign the player to.
	 */
	get track(): Optional<string> {
		return this.d.track;
	}
	set track(x: Optional<string>) {
		this.d.track = x;
	}

	/**
	 * The part of the player object to target for track assignment.
	 */
	get target(): Optional<PlayerObjectTarget> {
		return this.d.target;
	}
	set target(x: Optional<PlayerObjectTarget>) {
		this.d.target = x;
	}

	/**
	 * Return track assignment as json.
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
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	push(freeze = true) {
		currentDiff.customEvents.push(freeze ? deepCopy(this) : this);
	}
}
