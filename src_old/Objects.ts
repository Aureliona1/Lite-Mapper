import { deepCopy, type Vec2, type Vec3, type Vec4 } from "@aurellis/helpers";
import { jsonPrune } from "./Functions.ts";
import { currentDiff } from "./Map.ts";
import type {
	SliderJSON as ArcJSON,
	BombJSON,
	BookmarkJSON,
	BurstSliderJSON as ChainJSON,
	NoteCustomProps,
	NoteJSON,
	ObjectAnimProps,
	ObjectColorName,
	ObjectColorNumber,
	ObjectDirectionName,
	ObjectDirectionNumber,
	Optional,
	SliderCustomProps,
	WallCustomProps,
	ObstacleJSON as WallJSON
} from "./Types.ts";
import { ObjectColorsMap, ObjectDirectionsMap } from "./Internal.ts";

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
	constructor(public time = 0, public pos: Vec2 = [0, 0], public type: ObjectColorName = "Left", public direction: ObjectDirectionName = "Dot", public angleOffset = 0) {}
	customData: NoteCustomProps = {};

	get offset(): Optional<number> {
		return this.customData.noteJumpStartBeatOffset;
	}
	set offset(x: Optional<number>) {
		this.customData.noteJumpStartBeatOffset = x;
	}

	set NJS(x: Optional<number>) {
		this.customData.noteJumpMovementSpeed = x;
	}
	get NJS(): Optional<number> {
		return this.customData.noteJumpMovementSpeed;
	}

	set animation(x: ObjectAnimProps) {
		this.customData.animation = x;
	}
	get animation(): ObjectAnimProps {
		this.customData.animation ??= {};
		return this.customData.animation;
	}

	set rotation(x: Optional<Vec3>) {
		this.customData.worldRotation = x;
	}
	get rotation(): Optional<Vec3> {
		return this.customData.worldRotation;
	}

	set localRotation(x: Optional<Vec3>) {
		this.customData.localRotation = x;
	}
	get localRotation(): Optional<Vec3> {
		return this.customData.localRotation;
	}

	set disableNoteGravity(x: Optional<boolean>) {
		this.customData.disableNoteGravity = x;
	}
	get disableNoteGravity(): Optional<boolean> {
		return this.customData.disableNoteGravity;
	}

	set disableNoteLook(x: Optional<boolean>) {
		this.customData.disableNoteLook = x;
	}
	get disableNoteLook(): Optional<boolean> {
		return this.customData.disableNoteLook;
	}

	set color(x: Optional<Vec3 | Vec4>) {
		this.customData.color = x;
	}
	get color(): Optional<Vec3 | Vec4> {
		return this.customData.color;
	}

	set spawnEffect(x: Optional<boolean>) {
		this.customData.spawnEffect = x;
	}
	get spawnEffect(): Optional<boolean> {
		return this.customData.spawnEffect;
	}

	set track(x: Optional<string | string[]>) {
		this.customData.track = x;
	}
	get track(): Optional<string | string[]> {
		return this.customData.track;
	}

	get interactable(): boolean {
		return !this.customData.uninteractable;
	}
	set interactable(state: boolean) {
		this.customData.uninteractable = !state;
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
	 * Return the raw json of the note.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): NoteJSON {
		const temp = dupe ? deepCopy(this) : this;
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
	 * @param dupe Whether to copy the object on push.
	 */
	push(fake?: boolean, dupe = true) {
		const temp = dupe ? deepCopy(this) : this;
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

	get offset(): Optional<number> {
		return this.customData.noteJumpStartBeatOffset;
	}
	set offset(x: Optional<number>) {
		this.customData.noteJumpStartBeatOffset = x;
	}

	set NJS(x: Optional<number>) {
		this.customData.noteJumpMovementSpeed = x;
	}
	get NJS(): Optional<number> {
		return this.customData.noteJumpMovementSpeed;
	}

	set animation(x: ObjectAnimProps) {
		this.customData.animation = x;
	}
	get animation(): ObjectAnimProps {
		this.customData.animation ??= {};
		return this.customData.animation;
	}

	set rotation(x: Optional<Vec3>) {
		this.customData.worldRotation = x;
	}
	get rotation(): Optional<Vec3> {
		return this.customData.worldRotation;
	}

	set localRotation(x: Optional<Vec3>) {
		this.customData.localRotation = x;
	}
	get localRotation(): Optional<Vec3> {
		return this.customData.localRotation;
	}

	set disableNoteGravity(x: Optional<boolean>) {
		this.customData.disableNoteGravity = x;
	}
	get disableNoteGravity(): Optional<boolean> {
		return this.customData.disableNoteGravity;
	}

	set disableNoteLook(x: Optional<boolean>) {
		this.customData.disableNoteLook = x;
	}
	get disableNoteLook(): Optional<boolean> {
		return this.customData.disableNoteLook;
	}

	set color(x: Optional<Vec3 | Vec4>) {
		this.customData.color = x;
	}
	get color(): Optional<Vec3 | Vec4> {
		return this.customData.color;
	}

	set spawnEffect(x: Optional<boolean>) {
		this.customData.spawnEffect = x;
	}
	get spawnEffect(): Optional<boolean> {
		return this.customData.spawnEffect;
	}

	set track(x: Optional<string | string[]>) {
		this.customData.track = x;
	}
	get track(): Optional<string | string[]> {
		return this.customData.track;
	}

	get interactable(): boolean {
		return !this.customData.uninteractable;
	}
	set interactable(state: boolean) {
		this.customData.uninteractable = !state;
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
	 * Return the raw Json of the bomb.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): BombJSON {
		const temp = dupe ? deepCopy(this) : this;
		const out: BombJSON = {
			b: temp.time,
			x: temp.x,
			y: temp.y,
			customData: temp.customData
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create an instance of a bomb from valid bomb JSON.
	 * @param x The JSON.
	 * @returns A bomb.
	 */
	static from(x: BombJSON): Bomb {
		const b = new Bomb(x.b);
		b.x = x.x ?? 0;
		b.y = x.y ?? 0;
		if (x.customData) {
			b.customData = x.customData;
		}
		return b;
	}
	/**
	 * Push the bomb to the current diff.
	 * @param fake Whether to push to the regular or fake array.
	 * @param dupe Whether to copy the object on push.
	 */
	push(fake?: boolean, dupe = true) {
		const temp = dupe ? deepCopy(this) : this;
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

	set scale(x: Optional<Vec3>) {
		this.customData.size = x;
	}
	get scale(): Optional<Vec3> {
		return this.customData.size;
	}

	get offset(): Optional<number> {
		return this.customData.noteJumpStartBeatOffset;
	}
	set offset(x: Optional<number>) {
		this.customData.noteJumpStartBeatOffset = x;
	}

	set NJS(x: Optional<number>) {
		this.customData.noteJumpMovementSpeed = x;
	}
	get NJS(): Optional<number> {
		return this.customData.noteJumpMovementSpeed;
	}

	set animation(x: ObjectAnimProps) {
		this.customData.animation = x;
	}
	get animation(): ObjectAnimProps {
		this.customData.animation ??= {};
		return this.customData.animation;
	}

	set rotation(x: Optional<Vec3>) {
		this.customData.worldRotation = x;
	}
	get rotation(): Optional<Vec3> {
		return this.customData.worldRotation;
	}

	set localRotation(x: Optional<Vec3>) {
		this.customData.localRotation = x;
	}
	get localRotation(): Optional<Vec3> {
		return this.customData.localRotation;
	}
	set color(x: Optional<Vec3 | Vec4>) {
		this.customData.color = x;
	}
	get color(): Optional<Vec3 | Vec4> {
		return this.customData.color;
	}

	set track(x: Optional<string | string[]>) {
		this.customData.track = x;
	}
	get track(): Optional<string | string[]> {
		return this.customData.track;
	}

	get interactable(): boolean {
		return !this.customData.uninteractable;
	}
	set interactable(state: boolean) {
		this.customData.uninteractable = !state;
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
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): WallJSON {
		const temp = dupe ? deepCopy(this) : this;
		const out: WallJSON = {
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
	static from(x: WallJSON): Wall {
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
	 * @param dupe Whether to copy the object on push.
	 */
	push(fake?: boolean, dupe = true) {
		const temp = dupe ? deepCopy(this) : this;
		if (fake) {
			currentDiff.fakeWalls?.push(temp);
		} else {
			currentDiff.walls.push(temp);
		}
	}
}

/**
 * Beatmap aarc object.
 */
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
	constructor(public time = 0, public pos: Vec2 = [0, 0], public type: ObjectColorName = "Left", public headDirection: ObjectDirectionName = "Up", public tailBeat = 1, public tailPos: Vec2 = [0, 0], public tailDirection: ObjectDirectionName = "Down") {}
	/**
	 * The arc head multiplier (see beatmap v3 spec).
	 */
	headMultiplier = 1;
	/**
	 * The arc tail multiplier (see beatmapp v3 spec).
	 */
	tailMultiplier = 1;
	/**
	 * The arc anchor mode (see beatmap v3 spec).
	 */
	anchorMode = 1;
	/**
	 * The raw custom data of the arc.
	 */
	customData: SliderCustomProps = {};

	/**
	 * The note jump offset (in beats) of this object.
	 */
	get offset(): Optional<number> {
		return this.customData.noteJumpStartBeatOffset;
	}
	set offset(x: Optional<number>) {
		this.customData.noteJumpStartBeatOffset = x;
	}

	/**
	 * The note jump speed of this object.
	 */
	get NJS(): Optional<number> {
		return this.customData.noteJumpMovementSpeed;
	}
	set NJS(x: Optional<number>) {
		this.customData.noteJumpMovementSpeed = x;
	}

	/**
	 * The custom path animation on this object.
	 */
	get animation(): ObjectAnimProps {
		this.customData.animation ??= {};
		return this.customData.animation;
	}
	set animation(x: ObjectAnimProps) {
		this.customData.animation = x;
	}

	/**
	 * The global/world rotation of this object.
	 */
	get rotation(): Optional<Vec3> {
		return this.customData.worldRotation;
	}
	set rotation(x: Optional<Vec3>) {
		this.customData.worldRotation = x;
	}

	/**
	 * The local/object rotation of this object.
	 */
	get localRotation(): Optional<Vec3> {
		return this.customData.localRotation;
	}
	set localRotation(x: Optional<Vec3>) {
		this.customData.localRotation = x;
	}

	/**
	 * The chroma color of this arc.
	 */
	get color(): Optional<Vec3 | Vec4> {
		return this.customData.color;
	}
	set color(x: Optional<Vec3 | Vec4>) {
		this.customData.color = x;
	}

	/**
	 * Whether to use the "gravity" spawn effect for this arc.
	 */
	get disableNoteGravity(): Optional<boolean> {
		return this.customData.disableNoteGravity;
	}
	set disableNoteGravity(x: Optional<boolean>) {
		this.customData.disableNoteGravity = x;
	}

	/**
	 * The track/s that the arc belongs to.
	 */
	get track(): Optional<string | string[]> {
		return this.customData.track;
	}
	set track(x: Optional<string | string[]>) {
		this.customData.track = x;
	}

	/**
	 * The x position of the head of the arc.
	 */
	get x(): number {
		return this.pos[0];
	}
	set x(x: number) {
		this.pos[0] = x;
	}

	/**
	 * The y position of the head of the arc.
	 */
	get y(): number {
		return this.pos[1];
	}
	set y(x: number) {
		this.pos[1] = x;
	}

	/**
	 * The x position of the tail of the arc.
	 */
	get tx(): number {
		return this.tailPos[0];
	}
	set tx(x: number) {
		this.tailPos[0] = x;
	}

	/**
	 * The y position of the tail of the arc.
	 */
	get ty(): number {
		return this.tailPos[1];
	}
	set ty(x: number) {
		this.tailPos[1] = x;
	}

	/**
	 * Whether the game will register collisions between the sabers and this object.
	 */
	get interactable(): boolean {
		return !this.customData.uninteractable;
	}
	set interactable(state: boolean) {
		this.customData.uninteractable = !state;
	}
	/**
	 * Return the raw Json of the arc.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): ArcJSON {
		const temp = dupe ? deepCopy(this) : this;
		const out: ArcJSON = {
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
		jsonPrune(out);
		return out;
	}
	/**
	 * Create an instance of an arc from valid slider JSON.
	 * @param x The JSON.
	 * @returns An arc.
	 */
	static from(x: ArcJSON): Arc {
		const n = new Arc(x.b);
		n.type = ObjectColorsMap.revGet((x.c ?? 0) as ObjectColorNumber);
		n.x = x.x ?? 0;
		n.y = x.y ?? 0;
		n.headDirection = ObjectDirectionsMap.revGet((x.d ?? 0) as ObjectDirectionNumber);
		n.headMultiplier = x.mu ?? 0;
		n.tailBeat = x.tb ?? 0;
		n.tx = x.tx ?? 0;
		n.ty = x.ty ?? 0;
		n.tailDirection = ObjectDirectionsMap.revGet((x.tc ?? 0) as ObjectDirectionNumber);
		n.tailMultiplier = x.tmu ?? 0;
		n.anchorMode = x.m ?? 0;
		if (x.customData) {
			n.customData = x.customData;
		}
		return n;
	}
	/**
	 * Push the arc to the current diff.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.arcs.push(dupe ? deepCopy(this) : this);
	}
}

/**
 * A beatmap chain object.
 */
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
	constructor(public time = 0, public pos: Vec2 = [0, 0], public type: ObjectColorName = "Left", public direction: ObjectDirectionName = "Down", public tailBeat = 1, public tailPos: Vec2 = [0, 0], public segments = 5) {}
	/**
	 * The factor to "squish" the segments together by.
	 * Setting this to 0 will crash the game.
	 */
	squishFactor = 1;
	/**
	 * The raw custom data of the chain.
	 */
	customData: SliderCustomProps = {};

	/**
	 * The jump offset (in beats) of the chain.
	 */
	get offset(): Optional<number> {
		return this.customData.noteJumpStartBeatOffset;
	}
	set offset(x: Optional<number>) {
		this.customData.noteJumpStartBeatOffset = x;
	}

	/**
	 * The jump speed of the chain.
	 */
	get NJS(): Optional<number> {
		return this.customData.noteJumpMovementSpeed;
	}
	set NJS(x: Optional<number>) {
		this.customData.noteJumpMovementSpeed = x;
	}

	/**
	 * The animation properties on the chain.
	 */
	get animation(): ObjectAnimProps {
		this.customData.animation ??= {};
		return this.customData.animation;
	}
	set animation(x: ObjectAnimProps) {
		this.customData.animation = x;
	}

	/**
	 * The global/world rotation of the chain.
	 */
	get rotation(): Optional<Vec3> {
		return this.customData.worldRotation;
	}
	set rotation(x: Optional<Vec3>) {
		this.customData.worldRotation = x;
	}

	/**
	 * The local/object rotation of the chain.
	 */
	get localRotation(): Optional<Vec3> {
		return this.customData.localRotation;
	}
	set localRotation(x: Optional<Vec3>) {
		this.customData.localRotation = x;
	}

	/**
	 * The chroma color of the chain.
	 */
	get color(): Optional<Vec3 | Vec4> {
		return this.customData.color;
	}
	set color(x: Optional<Vec3 | Vec4>) {
		this.customData.color = x;
	}

	/**
	 * Whether the chain should have the "gravity" effect.
	 */
	get disableNoteGravity(): Optional<boolean> {
		return this.customData.disableNoteGravity;
	}
	set disableNoteGravity(x: Optional<boolean>) {
		this.customData.disableNoteGravity = x;
	}

	/**
	 * The track/s that the chain belongs to.
	 */
	get track(): Optional<string | string[]> {
		return this.customData.track;
	}
	set track(x: Optional<string | string[]>) {
		this.customData.track = x;
	}

	/**
	 * The x position of the head of the chain.
	 */
	get x(): number {
		return this.pos[0];
	}
	set x(x: number) {
		this.pos[0] = x;
	}

	/**
	 * The y position of the head of the chain.
	 */
	get y(): number {
		return this.pos[1];
	}
	set y(x: number) {
		this.pos[1] = x;
	}

	/**
	 * The x position of the tail of the chain.
	 */
	get tx(): number {
		return this.tailPos[0];
	}
	set tx(x: number) {
		this.tailPos[0] = x;
	}

	/**
	 * The y position of the tail of the chain.
	 */
	get ty(): number {
		return this.tailPos[1];
	}
	set ty(x: number) {
		this.tailPos[1] = x;
	}

	/**
	 * Whether the game will register collisions between the sabers and this chain.
	 */
	get interactable(): boolean {
		return !this.customData.uninteractable;
	}
	set interactable(state: boolean) {
		this.customData.uninteractable = !state;
	}
	/**
	 * Return the raw Json of the chain.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true): ChainJSON {
		const temp = dupe ? deepCopy(this) : this;
		const out: ChainJSON = {
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
		jsonPrune(out);
		return out;
	}
	/**
	 * Create an instance of a chain from valid burst slider JSON.
	 * @param x The JSON.
	 * @returns A chain.
	 */
	static from(x: ChainJSON): Chain {
		const n = new Chain(x.b);
		n.x = x.x ?? 0;
		n.y = x.y ?? 0;
		n.type = ObjectColorsMap.revGet((x.c ?? 0) as ObjectColorNumber);
		n.direction = ObjectDirectionsMap.revGet((x.d ?? 0) as ObjectDirectionNumber);
		n.tailBeat = x.tb ?? 0;
		n.tx = x.tx ?? 0;
		n.ty = x.ty ?? 0;
		n.segments = x.sc ?? 0;
		n.squishFactor = x.s ?? 1;
		if (x.customData) {
			n.customData = x.customData;
		}
		return n;
	}
	/**
	 * Push the chain to the current diff.
	 * @param fake Whether to push to the regular or fake array.
	 * @param dupe Whether to copy the object on push.
	 */
	push(fake?: boolean, dupe = true) {
		const temp = dupe ? deepCopy(this) : this;
		if (fake) {
			currentDiff.fakeChains?.push(temp);
		} else {
			currentDiff.chains.push(temp);
		}
	}
}

/**
 * A map bookmark object.
 * This is based on bookmarks from ChroMapper.
 */
export class Bookmark {
	/**
	 * Create a new bookmark that is visible in Chromapper (and other mapping software that supports this format).
	 * @param time The time of the bookmark.
	 * @param name The name that will appear for the bookmark.
	 * @param color The in-editor color of the bookmark.
	 */
	constructor(public time = 0, public name = "", public color: Vec4 = [1, 1, 1, 1]) {}
	/**
	 * Return the bookmark as valid bookmark JSON.
	 * @param dupe Whether to duplicate the object on return.
	 */
	return(dupe = true): BookmarkJSON {
		const temp = dupe ? deepCopy(this) : this;
		const out: BookmarkJSON = {
			b: temp.time,
			n: temp.name,
			c: temp.color
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create an instance of a bookmark from bookmark JSON.
	 * @param x The JSON.
	 * @returns A bookmark.
	 */
	static from(x: BookmarkJSON): Bookmark {
		return new Bookmark(x.b, x.n, x.c);
	}
	/**
	 * Push the bookmark to the current diff.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.bookmarks?.push(dupe ? deepCopy(this) : this);
	}
}
