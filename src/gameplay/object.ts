import type { Vec3, Vec4 } from "@aurellis/helpers";
import type { GameObjectCustomProps, ObjectAnimProps, Optional } from "../core/core.ts";

export class GameplayObject {
	/**
	 * Custom Heck properties on the object.
	 */
	customData: GameObjectCustomProps = {};

	/**
	 * The offset (in beats) to prematurely spawn the object.
	 */
	get offset(): Optional<number> {
		return this.customData.noteJumpStartBeatOffset;
	}
	set offset(x: Optional<number>) {
		this.customData.noteJumpStartBeatOffset = x;
	}

	/**
	 * The note jump speed of the object.
	 */
	set NJS(x: Optional<number>) {
		this.customData.noteJumpMovementSpeed = x;
	}
	get NJS(): Optional<number> {
		return this.customData.noteJumpMovementSpeed;
	}

	/**
	 * Animation properties of the object.
	 */
	set animation(x: ObjectAnimProps) {
		this.customData.animation = x;
	}
	get animation(): ObjectAnimProps {
		this.customData.animation ??= {};
		return this.customData.animation;
	}

	/**
	 * Object world rotation. Pivots around [0, 0, 0]
	 */
	set rotation(x: Optional<Vec3>) {
		this.customData.worldRotation = x;
	}
	get rotation(): Optional<Vec3> {
		return this.customData.worldRotation;
	}

	/**
	 * Object local rotation. Pivots around object origin.
	 */
	set localRotation(x: Optional<Vec3>) {
		this.customData.localRotation = x;
	}
	get localRotation(): Optional<Vec3> {
		return this.customData.localRotation;
	}

	/**
	 * Object color (requires chroma), either [r, g, b] or [r, g, b, a].
	 */
	set color(x: Optional<Vec3 | Vec4>) {
		this.customData.color = x;
	}
	get color(): Optional<Vec3 | Vec4> {
		return this.customData.color;
	}

	/**
	 * The track (or tracks) that the object is assigned to.
	 */
	set track(x: Optional<string | string[]>) {
		this.customData.track = x;
	}
	get track(): Optional<string | string[]> {
		return this.customData.track;
	}

	/**
	 * Whether the object can be interacted with by the player's head and/or sabers.
	 */
	get interactable(): boolean {
		return !this.customData.uninteractable;
	}
	set interactable(state: boolean) {
		this.customData.uninteractable = !state;
	}

	/**
	 * Return the internal JSON of the gameplay object.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	return(freeze = true): {} {
		return {};
	}
}
