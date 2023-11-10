import { currentDiff } from "./map.ts";
import { TrackAnimProps, CustomEventType, PathAnimProps, TrackParentProps, PlayerObjectControllers, PlayerToTrackProps, ComponentAnimProps } from "./types.ts";

export class CustomEvent {
	constructor(public time = 0) {}
	AnimateTrack(track: string | string[], duration?: number): { time: number; data: TrackAnimProps; return: () => CustomEventType; push: () => void } {
		const animation: TrackAnimProps = {
			track: track
		};
		if (duration) {
			animation.duration = duration;
		}
		return {
			time: this.time,
			data: animation,
			return() {
				return {
					b: this.time,
					t: "AnimateTrack",
					d: this.data
				};
			},
			push() {
				currentDiff.customEvents?.push(this.return());
			}
		};
	}
	AssignPathAnimation(track: string | string[]): { time: number; data: PathAnimProps; return: () => CustomEventType; push: () => void } {
		const data: PathAnimProps = {
			track: track
		};
		return {
			time: this.time,
			data: data,
			return() {
				return {
					b: this.time,
					t: "AssignPathAnimation",
					d: data
				};
			},
			push() {
				currentDiff.customEvents?.push(this.return());
			}
		};
	}
	AssignTrackParent(childTracks: string[], parentTrack: string, worldPositionStays?: boolean): { time: number; data: TrackParentProps; return: () => CustomEventType; push: () => void } {
		const data: TrackParentProps = {
			childrenTracks: childTracks,
			parentTrack: parentTrack
		};
		if (typeof worldPositionStays !== "undefined") {
			data.worldPositionStays = worldPositionStays;
		}
		return {
			time: this.time,
			data: data,
			return() {
				return {
					b: this.time,
					t: "AssignTrackParent",
					d: data
				};
			},
			push() {
				currentDiff.customEvents?.push(this.return());
			}
		};
	}
	AssignPlayerToTrack(track: string, target?: PlayerObjectControllers): { time: number; data: PlayerToTrackProps; return: () => CustomEventType; push: () => void } {
		const data: PlayerToTrackProps = {
			track: track
		};
		if (target) {
			data.target = target;
		}
		return {
			time: this.time,
			data: data,
			return() {
				return {
					b: this.time,
					t: "AssignPlayerToTrack",
					d: data
				};
			},
			push() {
				currentDiff.customEvents?.push(this.return());
			}
		};
	}
	AnimateComponent(track: string): { time: number; data: ComponentAnimProps; return: () => CustomEventType; push: () => void } {
		const data: ComponentAnimProps = {
			track: track
		};
		return {
			time: this.time,
			data: data,
			return() {
				return {
					b: this.time,
					t: "AnimateComponent",
					d: data
				};
			},
			push() {
				currentDiff.customEvents?.push(this.return());
			}
		};
	}
}
