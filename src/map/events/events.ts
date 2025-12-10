import type { CustomEventJSON, CustomEventName } from "../../core/core.ts";
import { AnimateComponent } from "./animate_component.ts";
import { AnimateTrack } from "./animate_track.ts";
import { AssignPathAnimation } from "./assign_path_animation.ts";
import { AssignPlayerToTrack } from "./assign_player_track.ts";
import { AssignTrackParent } from "./assign_track_parent.ts";
import type { HeckCustomEvent } from "./custom_event.ts";

/**
 * Internal function for Lite-Mapper that converts CE JSON to an instance of a CE class.
 * @param x Input Json.
 */
export function JSONToCE(x: CustomEventJSON): HeckCustomEvent {
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
export function CEToJSON(x: HeckCustomEvent): CustomEventJSON {
	return x.return();
}

export * from "./animate_component.ts";
export * from "./animate_track.ts";
export * from "./assign_path_animation.ts";
export * from "./assign_player_track.ts";
export * from "./assign_track_parent.ts";
export * from "./custom_event.ts";
