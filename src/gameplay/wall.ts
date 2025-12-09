import { type Vec3, deepCopy } from "@aurellis/helpers";
import type { ObstacleJSON, Optional, WallCustomProps } from "../core/core.ts";
import { currentDiff } from "../map/map.ts";
import { jsonPrune } from "../utility/utility.ts";
import { GameplayObject } from "./object.ts";

/**
 * Wall gameplay object.
 */
export class Wall extends GameplayObject {
	/**
	 * Create a new wall.
	 * @param time The time of the wall (Default - 0).
	 * @param pos The [x, y] of the wall (Default - [0, 0]).
	 * @param duration The duration of the wall (Default - 1).
	 * @param width The width of the wall (Default - 1).
	 * @param height The height of the wall (Default - 1).
	 */
	constructor(public time = 0, public pos = [0, 0], public duration = 1, public width = 1, public height = 1) {
		super();
	}
	override customData: WallCustomProps = {};

	set scale(x: Optional<Vec3>) {
		this.customData.size = x;
	}
	get scale(): Optional<Vec3> {
		return this.customData.size;
	}

	get x(): number {
		return this.pos[0];
	}
	set x(x: number) {
		this.pos[0] = x;
	}

	get y(): number {
		return this.pos[1];
	}
	set y(x: number) {
		this.pos[1] = x;
	}
	/**
	 * Return the raw Json of the wall.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	override return(freeze = true): ObstacleJSON {
		const temp = freeze ? deepCopy(this) : this;
		const out: ObstacleJSON = {
			b: temp.time,
			x: temp.x,
			y: temp.y,
			d: temp.duration,
			w: temp.width,
			h: temp.height,
			customData: temp.customData
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create an instance of a wall from valid obstacle JSON.
	 * @param x The JSON.
	 * @returns A wall.
	 */
	static from(x: ObstacleJSON): Wall {
		const w = new Wall(x.b);
		w.x = x.x ?? 0;
		w.y = x.y ?? 0;
		w.duration = x.d ?? 0;
		w.width = x.w ?? 0;
		w.height = x.h ?? 0;
		if (x.customData) {
			w.customData = x.customData;
		}
		return w;
	}
	/**
	 * Push the wall to the current diff.
	 * @param fake Whether to push to the regular or fake array.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	push(fake?: boolean, freeze = true) {
		const temp = freeze ? deepCopy(this) : this;
		if (fake) {
			currentDiff.fakeWalls?.push(temp);
		} else {
			currentDiff.walls.push(temp);
		}
	}
}
