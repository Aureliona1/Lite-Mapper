import { ObjectColorsMap, ObjectDirectionsMap, ObjectColorsNumericalValues, ObjectDirectionsNumericalValues } from "./Consts.ts";
import { copy, jsonPrune } from "./Functions.ts";
import { currentDiff } from "./Map.ts";
import { Vec2, ObjectColors, ObjectDirections, NoteCustomProps, NoteType, BombType, WallCustomProps, ObstacleType, SliderCustomProps, SliderType, BurstSliderType, Vec4, BookmarkType } from "./Types.ts";

export class Note {
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
	constructor(public time = 0, public pos: Vec2 = [0, 0], public type: ObjectColors = "Left", public direction: ObjectDirections = "Dot", public angleOffset = 0) {}
	customData: NoteCustomProps = {};

	get offset() {
		return this.customData.noteJumpStartBeatOffset;
	}
	set offset(x) {
		this.customData.noteJumpStartBeatOffset = x;
	}

	set NJS(x) {
		this.customData.noteJumpMovementSpeed = x;
	}
	get NJS() {
		return this.customData.noteJumpMovementSpeed;
	}

	set animation(x) {
		this.customData.animation = x;
	}
	get animation() {
		return this.customData.animation ?? {};
	}

	set rotation(x) {
		this.customData.worldRotation = x;
	}
	get rotation() {
		return this.customData.worldRotation;
	}

	set localRotation(x) {
		this.customData.localRotation = x;
	}
	get localRotation() {
		return this.customData.localRotation;
	}

	set disableNoteGravity(x) {
		this.customData.disableNoteGravity = x;
	}
	get disableNoteGravity() {
		return this.customData.disableNoteGravity;
	}

	set disableNoteLook(x) {
		this.customData.disableNoteLook = x;
	}
	get disableNoteLook() {
		return this.customData.disableNoteLook;
	}

	set color(x) {
		this.customData.color = x;
	}
	get color() {
		return this.customData.color;
	}

	set spawnEffect(x) {
		this.customData.spawnEffect = x;
	}
	get spawnEffect() {
		return this.customData.spawnEffect;
	}

	set track(x) {
		this.customData.track = x;
	}
	get track() {
		return this.customData.track;
	}

	get interactable() {
		return !this.customData.uninteractable;
	}
	set interactable(state) {
		this.customData.uninteractable = !state;
	}

	get x() {
		return this.pos[0];
	}
	set x(x) {
		this.pos[0] = x;
	}

	get y() {
		return this.pos[1];
	}
	set y(x) {
		this.pos[1] = x;
	}

	/**
	 * Return the raw json of the note.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): NoteType {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		return {
			b: temp.time,
			x: temp.x,
			y: temp.y,
			c: ObjectColorsMap.get(temp.type),
			d: ObjectDirectionsMap.get(temp.direction),
			a: temp.angleOffset,
			customData: temp.customData
		};
	}
	JSONToClass(x: NoteType) {
		this.time = x.b;
		this.x = x.x;
		this.y = x.y;
		this.type = ObjectColorsMap.revGet(x.c as ObjectColorsNumericalValues);
		this.direction = ObjectDirectionsMap.revGet(x.d as ObjectDirectionsNumericalValues);
		this.angleOffset = x.a;
		if (x.customData) {
			this.customData = x.customData;
		}
		return this;
	}
	/**
	 * Push the note to the current diff.
	 * @param fake Whether to push to the regular or fake array.
	 * @param dupe Whether to copy the object on push.
	 */
	push(fake?: boolean, dupe = true) {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		if (fake) {
			currentDiff.fakeNotes?.push(temp);
		} else {
			currentDiff.notes.push(temp);
		}
	}
}

export class Bomb {
	/**
	 * Create a new bomb.
	 * @param time The time of the bomb (Default - 0).
	 * @param pos The [x, y] of the bomb (Default - [0, 0]).
	 */
	constructor(public time = 0, public pos: Vec2 = [0, 0]) {}
	customData: NoteCustomProps = {};

	get offset() {
		return this.customData.noteJumpStartBeatOffset;
	}
	set offset(x) {
		this.customData.noteJumpStartBeatOffset = x;
	}

	set NJS(x) {
		this.customData.noteJumpMovementSpeed = x;
	}
	get NJS() {
		return this.customData.noteJumpMovementSpeed;
	}

	set animation(x) {
		this.customData.animation = x;
	}
	get animation() {
		return this.customData.animation ?? {};
	}

	set rotation(x) {
		this.customData.worldRotation = x;
	}
	get rotation() {
		return this.customData.worldRotation;
	}

	set localRotation(x) {
		this.customData.localRotation = x;
	}
	get localRotation() {
		return this.customData.localRotation;
	}

	set disableNoteGravity(x) {
		this.customData.disableNoteGravity = x;
	}
	get disableNoteGravity() {
		return this.customData.disableNoteGravity;
	}

	set disableNoteLook(x) {
		this.customData.disableNoteLook = x;
	}
	get disableNoteLook() {
		return this.customData.disableNoteLook;
	}

	set color(x) {
		this.customData.color = x;
	}
	get color() {
		return this.customData.color;
	}

	set spawnEffect(x) {
		this.customData.spawnEffect = x;
	}
	get spawnEffect() {
		return this.customData.spawnEffect;
	}

	set track(x) {
		this.customData.track = x;
	}
	get track() {
		return this.customData.track;
	}

	get interactable() {
		return !this.customData.uninteractable;
	}
	set interactable(state) {
		this.customData.uninteractable = !state;
	}

	get x() {
		return this.pos[0];
	}
	set x(x) {
		this.pos[0] = x;
	}

	get y() {
		return this.pos[1];
	}
	set y(x) {
		this.pos[1] = x;
	}
	/**
	 * Return the raw Json of the bomb.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): BombType {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		return {
			b: temp.time,
			x: temp.x,
			y: temp.y,
			customData: temp.customData
		};
	}
	JSONToClass(x: BombType) {
		this.time = x.b;
		this.x = x.x;
		this.y = x.y;
		if (x.customData) {
			this.customData = x.customData;
		}
		return this;
	}
	/**
	 * Push the bomb to the current diff.
	 * @param fake Whether to push to the regular or fake array.
	 * @param dupe Whether to copy the object on push.
	 */
	push(fake?: boolean, dupe = true) {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		if (fake) {
			currentDiff.fakeBombs?.push(temp);
		} else {
			currentDiff.bombs.push(temp);
		}
	}
}

export class Wall {
	/**
	 * Create a new wall.
	 * @param time The time of the wall (Default - 0).
	 * @param pos The [x, y] of the wall (Default - [0, 0]).
	 * @param duration The duration of the wall (Default - 1).
	 * @param width The width of the wall (Default - 1).
	 * @param height The height of the wall (Default - 1).
	 */
	constructor(public time = 0, public pos = [0, 0], public duration = 1, public width = 1, public height = 1) {}
	customData: WallCustomProps = {};

	set scale(x) {
		this.customData.size = x;
	}
	get scale() {
		return this.customData.size;
	}

	get offset() {
		return this.customData.noteJumpStartBeatOffset;
	}
	set offset(x) {
		this.customData.noteJumpStartBeatOffset = x;
	}

	set NJS(x) {
		this.customData.noteJumpMovementSpeed = x;
	}
	get NJS() {
		return this.customData.noteJumpMovementSpeed;
	}

	set animation(x) {
		this.customData.animation = x;
	}
	get animation() {
		return this.customData.animation ?? {};
	}

	set rotation(x) {
		this.customData.worldRotation = x;
	}
	get rotation() {
		return this.customData.worldRotation;
	}

	set localRotation(x) {
		this.customData.localRotation = x;
	}
	get localRotation() {
		return this.customData.localRotation;
	}
	set color(x) {
		this.customData.color = x;
	}
	get color() {
		return this.customData.color;
	}

	set track(x) {
		this.customData.track = x;
	}
	get track() {
		return this.customData.track;
	}

	get interactable() {
		return !this.customData.uninteractable;
	}
	set interactable(state) {
		this.customData.uninteractable = !state;
	}

	get x() {
		return this.pos[0];
	}
	set x(x) {
		this.pos[0] = x;
	}

	get y() {
		return this.pos[1];
	}
	set y(x) {
		this.pos[1] = x;
	}
	/**
	 * Return the raw Json of the wall.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): ObstacleType {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		return {
			b: temp.time,
			x: temp.x,
			y: temp.y,
			d: temp.duration,
			w: temp.width,
			h: temp.height,
			customData: temp.customData
		};
	}
	JSONToClass(x: ObstacleType) {
		this.time = x.b;
		this.x = x.x;
		this.y = x.y;
		this.duration = x.d;
		this.width = x.w;
		this.height = x.h;
		if (x.customData) {
			this.customData = x.customData;
		}
		return this;
	}
	/**
	 * Push the wall to the current diff.
	 * @param fake Whether to push to the regular or fake array.
	 * @param dupe Whether to copy the object on push.
	 */
	push(fake?: boolean, dupe = true) {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		if (fake) {
			currentDiff.fakeWalls?.push(temp);
		} else {
			currentDiff.walls.push(temp);
		}
	}
}

export class Arc {
	/**
	 * Create a new arc.
	 * @param time The time of the arc (Default - 0).
	 * @param pos The starting position of the arc (Default - [0, 0]).
	 * @param type (string) The color of the arc (left / right) (Default - "Left").
	 * @param headDirection (string) The starting direction of the arc (Default - "Up").
	 * @param tailBeat The final beat of the arc (Default - 1).
	 * @param tailPos The final position of the arc (Default - [0, 0]).
	 * @param tailDirection The direction of the end of the arc (Default - "Down").
	 */
	constructor(public time = 0, public pos: Vec2 = [0, 0], public type: ObjectColors = "Left", public headDirection: ObjectDirections = "Up", public tailBeat = 1, public tailPos: Vec2 = [0, 0], public tailDirection: ObjectDirections = "Down") {}
	headMultiplier = 1;
	tailMultiplier = 1;
	anchorMode = 1;
	customData: SliderCustomProps = {};

	get offset() {
		return this.customData.noteJumpStartBeatOffset;
	}
	set offset(x) {
		this.customData.noteJumpStartBeatOffset = x;
	}

	set NJS(x) {
		this.customData.noteJumpMovementSpeed = x;
	}
	get NJS() {
		return this.customData.noteJumpMovementSpeed;
	}

	set animation(x) {
		this.customData.animation = x;
	}
	get animation() {
		return this.customData.animation ?? {};
	}

	set rotation(x) {
		this.customData.worldRotation = x;
	}
	get rotation() {
		return this.customData.worldRotation;
	}

	set localRotation(x) {
		this.customData.localRotation = x;
	}
	get localRotation() {
		return this.customData.localRotation;
	}
	set color(x) {
		this.customData.color = x;
	}
	get color() {
		return this.customData.color;
	}

	set disableNoteGravity(x) {
		this.customData.disableNoteGravity = x;
	}
	get disableNoteGravity() {
		return this.customData.disableNoteGravity;
	}

	set track(x) {
		this.customData.track = x;
	}
	get track() {
		return this.customData.track;
	}

	get x() {
		return this.pos[0];
	}
	set x(x) {
		this.pos[0] = x;
	}

	get y() {
		return this.pos[1];
	}
	set y(x) {
		this.pos[1] = x;
	}

	get tx() {
		return this.tailPos[0];
	}
	set tx(x) {
		this.tailPos[0] = x;
	}

	get ty() {
		return this.tailPos[1];
	}
	set ty(x) {
		this.tailPos[1] = x;
	}

	get interactable() {
		return !this.customData.uninteractable;
	}
	set interactable(state) {
		this.customData.uninteractable = !state;
	}
	/**
	 * Return the raw Json of the arc.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): SliderType {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		return {
			b: temp.time,
			c: ObjectColorsMap.get(temp.type),
			x: temp.x,
			y: temp.y,
			d: ObjectDirectionsMap.get(temp.headDirection),
			mu: temp.headMultiplier,
			tb: temp.tailBeat,
			tx: temp.tx,
			ty: temp.ty,
			tc: ObjectDirectionsMap.get(temp.tailDirection),
			tmu: temp.tailMultiplier,
			m: temp.anchorMode,
			customData: temp.customData
		};
	}
	JSONToClass(x: SliderType) {
		this.time = x.b;
		this.type = ObjectColorsMap.revGet(x.c as ObjectColorsNumericalValues);
		this.x = x.x;
		this.y = x.y;
		this.headDirection = ObjectDirectionsMap.revGet(x.d as ObjectDirectionsNumericalValues);
		this.headMultiplier = x.mu;
		this.tailBeat = x.tb;
		this.tx = x.tx;
		this.ty = x.ty;
		this.tailDirection = ObjectDirectionsMap.revGet(x.tc as ObjectDirectionsNumericalValues);
		this.tailMultiplier = x.tmu;
		this.anchorMode = x.m;
		if (x.customData) {
			this.customData = x.customData;
		}
		return this;
	}
	/**
	 * Push the arc to the current diff.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		currentDiff.arcs.push(temp);
	}
}

export class Chain {
	/**
	 * Create a new chain (burstSlider) object.
	 * @param time The time of the chain (Default - 0).
	 * @param pos The [x, y] of the chain (Default - [0, 0]).
	 * @param type (string) The type of the chain (left/right) (Default - "Left").
	 * @param direction (string) The cut direction of the head of the chain (Default - "Down").
	 * @param tailBeat The beat at the end of the chain (Default - 1).
	 * @param tailPos The [x, y] of the end of the chain (Default - [0, 0]).
	 * @param segments The number of segments in the chain (Default - 5).
	 */
	constructor(public time = 0, public pos: Vec2 = [0, 0], public type: ObjectColors = "Left", public direction: ObjectDirections = "Down", public tailBeat = 1, public tailPos: Vec2 = [0, 0], public segments = 5) {}
	squishFactor = 1;
	customData: SliderCustomProps = {};

	get offset() {
		return this.customData.noteJumpStartBeatOffset;
	}
	set offset(x) {
		this.customData.noteJumpStartBeatOffset = x;
	}

	set NJS(x) {
		this.customData.noteJumpMovementSpeed = x;
	}
	get NJS() {
		return this.customData.noteJumpMovementSpeed;
	}

	set animation(x) {
		this.customData.animation = x;
	}
	get animation() {
		return this.customData.animation ?? {};
	}

	set rotation(x) {
		this.customData.worldRotation = x;
	}
	get rotation() {
		return this.customData.worldRotation;
	}

	set localRotation(x) {
		this.customData.localRotation = x;
	}
	get localRotation() {
		return this.customData.localRotation;
	}
	set color(x) {
		this.customData.color = x;
	}
	get color() {
		return this.customData.color;
	}

	set disableNoteGravity(x) {
		this.customData.disableNoteGravity = x;
	}
	get disableNoteGravity() {
		return this.customData.disableNoteGravity;
	}

	set track(x) {
		this.customData.track = x;
	}
	get track() {
		return this.customData.track;
	}

	get x() {
		return this.pos[0];
	}
	set x(x) {
		this.pos[0] = x;
	}

	get y() {
		return this.pos[1];
	}
	set y(x) {
		this.pos[1] = x;
	}

	get tx() {
		return this.tailPos[0];
	}
	set tx(x) {
		this.tailPos[0] = x;
	}

	get ty() {
		return this.tailPos[1];
	}
	set ty(x) {
		this.tailPos[1] = x;
	}

	get interactable() {
		return !this.customData.uninteractable;
	}
	set interactable(state) {
		this.customData.uninteractable = !state;
	}
	/**
	 * Return the raw Json of the chain.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): BurstSliderType {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		return {
			b: temp.time,
			x: temp.x,
			y: temp.y,
			c: ObjectColorsMap.get(temp.type),
			d: ObjectDirectionsMap.get(temp.direction),
			tb: temp.tailBeat,
			tx: temp.tx,
			ty: temp.ty,
			sc: temp.segments,
			s: temp.squishFactor,
			customData: temp.customData
		};
	}
	JSONToClass(x: BurstSliderType) {
		this.time = x.b;
		this.x = x.x;
		this.y = x.y;
		this.type = ObjectColorsMap.revGet(x.c as ObjectColorsNumericalValues);
		this.direction = ObjectDirectionsMap.revGet(x.d as ObjectDirectionsNumericalValues);
		this.tailBeat = x.tb;
		this.tx = x.tx;
		this.ty = x.ty;
		this.segments = x.sc;
		this.squishFactor = x.s;
		if (x.customData) {
			this.customData = x.customData;
		}
		return this;
	}
	/**
	 * Push the chain to the current diff.
	 * @param fake Whether to push to the regular or fake array.
	 * @param dupe Whether to copy the object on push.
	 */
	push(fake?: boolean, dupe = true) {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		if (fake) {
			currentDiff.fakeChains?.push(temp);
		} else {
			currentDiff.chains.push(temp);
		}
	}
}

export class Bookmark {
	constructor(public time = 0, public name = "", public color: Vec4 = [1, 1, 1, 1]) {}
	return(dupe = true): BookmarkType {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		return {
			b: this.time,
			n: this.name,
			c: this.color
		};
	}
	JSONToClass(x: BookmarkType) {
		this.time = x.b;
		this.name = x.n;
		this.color = x.c;
		jsonPrune(this);
		return this;
	}
	push(dupe = true) {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		currentDiff.bookmarks?.push(temp);
	}
}
