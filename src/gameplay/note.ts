import { deepCopy, type Vec2 } from "@aurellis/helpers";
import { ObjectColorsMap, ObjectDirectionsMap, type NoteCustomProps, type NoteJSON, type ObjectColorName, type ObjectDirectionName, type Optional } from "../core/core.ts";
import { currentDiff } from "../map/map.ts";
import { jsonPrune } from "../utility/utility.ts";
import { GameplayObject } from "./object.ts";

/**
 * Note gameplay object.
 */
export class Note extends GameplayObject {
	/**
	 * Create a new note. All paramaters here are optional and can be edited later.
	 *
	 * For example:
	 * ```ts
	 * const note = new Note();
	 * note.time = 0;
	 * note.x = 1;
	 * note.y = 2;
	 * note.direction = "Down";
	 * note.push();
	 * ```
	 * @param time The time of the note (Default - 0).
	 * @param pos The [x, y] of the note (Default - [0, 0]).
	 * @param type (string) If the note is a left or right note (Default - "Left").
	 * @param direction (string) The cut direction of the note (Default - "Dot").
	 * @param angleOffset The additional angle offset of the note (counter-clockwise).
	 */
	constructor(public time = 0, pos: Vec2 = [0, 0], public type: ObjectColorName = "Left", public direction: ObjectDirectionName = "Dot", public angleOffset = 0) {
		super(pos);
	}
	/**
	 * The note custom properties.
	 */
	override customData: NoteCustomProps = {};

	/**
	 * Whether to disable the note "gravity" effect on spawn.
	 */
	get disableNoteGravity(): Optional<boolean> {
		return this.customData.disableNoteGravity;
	}
	set disableNoteGravity(x: Optional<boolean>) {
		this.customData.disableNoteGravity = x;
	}

	/**
	 * Whether to disable the note "looking" effect.
	 */
	get disableNoteLook(): Optional<boolean> {
		return this.customData.disableNoteLook;
	}
	set disableNoteLook(x: Optional<boolean>) {
		this.customData.disableNoteLook = x;
	}

	/**
	 * Whether the note shold have the note "spawn effect".
	 */
	get spawnEffect(): Optional<boolean> {
		return this.customData.spawnEffect;
	}
	set spawnEffect(x: Optional<boolean>) {
		this.customData.spawnEffect = x;
	}

	/**
	 * Return the raw json of the note.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	override return(freeze = true): NoteJSON {
		const temp = freeze ? deepCopy(this) : this;
		const out: NoteJSON = {
			b: temp.time,
			x: temp.x,
			y: temp.y,
			c: ObjectColorsMap.get(temp.type),
			d: ObjectDirectionsMap.get(temp.direction),
			a: temp.angleOffset,
			customData: temp.customData
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create an instance of a note from valid note JSON.
	 * @param x The JSON.
	 * @returns A note.
	 */
	static from(x: NoteJSON): Note {
		const n = new Note(x.b);
		n.x = x.x ?? 0;
		n.y = x.y ?? 0;
		n.type = ObjectColorsMap.revGet(x.c ?? 0);
		n.direction = ObjectDirectionsMap.revGet(x.d ?? 0);
		n.angleOffset = x.a;
		if (x.customData) {
			n.customData = x.customData;
		}
		return n;
	}
	/**
	 * Push the note to the current diff.
	 * @param fake Whether to push to the regular or fake array.
	 * @param freeze Whether to freeze the properties of the object. This prevents further property modifications from affecting extracted values here.
	 */
	push(fake?: boolean, freeze = true) {
		const temp = freeze ? deepCopy(this) : this;
		if (fake) {
			currentDiff().fakeNotes?.push(temp);
		} else {
			currentDiff().notes.push(temp);
		}
	}
}
