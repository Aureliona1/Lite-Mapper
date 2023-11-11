import { jsonPrune, currentDiff, BombType, BurstSliderType, NoteCustomProps, NoteType, ObstacleType, SliderCustomProps, SliderType, Vec2, WallCustomProps } from "./LiteMapper.ts";

export class Note {
	/**
	 * Create a new note.
	 * @param time The time of the note.
	 * @param pos The [x, y] of the note.
	 * @param type Note is left: 0, or right: 1.
	 * @param direction The cut direction of the note.
	 * @param angleOffset The additional angle offset of the note (counter-clockwise).
	 */
	constructor(public time = 0, public pos: Vec2 = [0, 0], public type = 0, public direction = 0, public angleOffset = 0) {}
	public customData: NoteCustomProps = {};

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
		return this.customData.animation;
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
	 */
	return(): NoteType {
		jsonPrune(this);
		return {
			b: this.time,
			x: this.x,
			y: this.y,
			c: this.type,
			d: this.direction,
			a: this.angleOffset,
			customData: this.customData
		};
	}
	JSONToClass(x: NoteType) {
		this.time = x.b;
		this.x = x.x;
		this.y = x.y;
		this.type = x.c;
		this.direction = x.d;
		this.angleOffset = x.a;
		if (x.customData) {
			this.customData = x.customData;
		}
		jsonPrune(this);
		return this;
	}
	/**
	 * Push the note to the current diff.
	 */
	push(fake?: boolean) {
		jsonPrune(this);
		if (fake) {
			currentDiff.fakeNotes?.push(this);
		} else {
			currentDiff.notes.push(this);
		}
	}
}

export class Bomb {
	/**
	 * Create a new bomb.
	 * @param time The time of the bomb.
	 * @param pos The [x, y] of the bomb.
	 */
	constructor(public time = 0, public pos: Vec2 = [0, 0]) {}
	public customData: NoteCustomProps = {};
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
		return this.customData.animation;
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
	 */
	return(): BombType {
		jsonPrune(this);
		return {
			b: this.time,
			x: this.x,
			y: this.y,
			customData: this.customData
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
	 */
	push(fake?: boolean) {
		jsonPrune(this);
		if (fake) {
			currentDiff.fakeBombs?.push(this);
		} else {
			currentDiff.bombs.push(this);
		}
	}
}

export class Wall {
	/**
	 * Create a new wall.
	 * @param time The time of the wall.
	 * @param pos The [x, y] of the wall.
	 * @param duration The duration of the wall.
	 * @param width The width of the wall.
	 * @param height The height of the wall.
	 */
	constructor(public time = 0, public pos = [0, 0], public duration = 1, public width = 1, public height = 1) {}
	public customData: WallCustomProps = {};

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
		return this.customData.animation;
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
	 */
	return(): ObstacleType {
		jsonPrune(this);
		return {
			b: this.time,
			x: this.x,
			y: this.y,
			d: this.duration,
			w: this.width,
			h: this.height,
			customData: this.customData
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
	 */
	push(fake?: boolean) {
		jsonPrune(this);
		if (fake) {
			currentDiff.fakeWalls?.push(this);
		} else {
			currentDiff.walls.push(this);
		}
	}
}

export class Arc {
	/**
	 * Create a new arc.
	 * @param time The time of the arc.
	 * @param type The color of the arc (left / right).
	 * @param pos The starting position of the arc.
	 * @param headDirection The starting direction of the arc.
	 * @param tailBeat The final beat of the arc.
	 * @param tailPos The final position of the arc.
	 * @param tailDirection The direction of the end of the arc.
	 */
	constructor(public time = 0, public pos: Vec2 = [0, 0], public type = 0, public headDirection = 0, public tailBeat = 1, public tailPos: Vec2 = [0, 0], public tailDirection = 0) {}
	public headMultiplier = 1;
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
		return this.customData.animation;
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
	 */
	return(): SliderType {
		jsonPrune(this);
		return {
			b: this.time,
			c: this.type,
			x: this.x,
			y: this.y,
			d: this.headDirection,
			mu: this.headMultiplier,
			tb: this.tailBeat,
			tx: this.tx,
			ty: this.ty,
			tc: this.tailDirection,
			tmu: this.tailMultiplier,
			m: this.anchorMode,
			customData: this.customData
		};
	}
	JSONToClass(x: SliderType) {
		this.time = x.b;
		this.type = x.c;
		this.x = x.x;
		this.y = x.y;
		this.headDirection = x.d;
		this.headMultiplier = x.mu;
		this.tailBeat = x.tb;
		this.tx = x.tx;
		this.ty = x.ty;
		this.tailDirection = x.tc;
		this.tailMultiplier = x.tmu;
		this.anchorMode = x.m;
		if (x.customData) {
			this.customData = x.customData;
		}
		return this;
	}
	/**
	 * Push the arc to the current diff.
	 */
	push() {
		jsonPrune(this);
		currentDiff.arcs.push(this);
	}
}

export class Chain {
	/**
	 * Create a new chain (burstSlider) object.
	 * @param time The time of the chain.
	 * @param pos The [x, y] of the chain.
	 * @param type The type of the chain (left/right).
	 * @param direction The cut direction of the head of the chain.
	 * @param tailBeat The beat at the end of the chain.
	 * @param tailPos The [x, y] of the end of the chain.
	 * @param segments The number of segments in the chain.
	 */
	constructor(public time = 0, public pos: Vec2 = [0, 0], public type = 0, public direction = 0, public tailBeat = 1, public tailPos: Vec2 = [0, 0], public segments = 5) {}
	public squishFactor = 1;
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
		return this.customData.animation;
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
	 */
	return(): BurstSliderType {
		jsonPrune(this);
		return {
			b: this.time,
			x: this.x,
			y: this.y,
			c: this.type,
			d: this.direction,
			tb: this.tailBeat,
			tx: this.tx,
			ty: this.ty,
			sc: this.segments,
			s: this.squishFactor,
			customData: this.customData
		};
	}
	JSONToClass(x: BurstSliderType) {
		this.time = x.b;
		this.x = x.x;
		this.y = x.y;
		this.type = x.c;
		this.direction = x.d;
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
	 */
	push(fake?: boolean) {
		jsonPrune(this);
		if (fake) {
			currentDiff.fakeChains?.push(this);
		} else {
			currentDiff.chains.push(this);
		}
	}
}
