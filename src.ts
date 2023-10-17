// deno-lint-ignore-file no-explicit-any
type DiffTypes<T extends string> = `Easy${T}` | `Normal${T}` | `Hard${T}` | `Expert${T}` | `ExpertPlus${T}`;
export type DiffNames = DiffTypes<"Standard"> | DiffTypes<"Lightshow"> | DiffTypes<"Lawless">;
type FilterObject = { c: number; f: number; p: number; t: number; r: number; n: number; s: number; l: number; d: number };
export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];
type EaseBase<T extends string> = `easeIn${T}` | `easeOut${T}` | `easeInOut${T}`;
export type Easing = EaseBase<"Sine"> | EaseBase<"Quad"> | EaseBase<"Cubic"> | EaseBase<"Quart"> | EaseBase<"Quint"> | EaseBase<"Circ"> | EaseBase<"Back"> | EaseBase<"Bounce"> | EaseBase<"Elastic"> | "easeStep" | "easeLinear";
export type LookupMethod = "Contains" | "Regex" | "Exact" | "StartsWith" | "EndsWith";
export type KFVec3 = [number, number, number, number, Easing?, "splineCatmullRom"?];
export type KFSingle = [number, number, Easing?];
export type KFVec4 = [number, number, number, number, number, Easing?, "splineCatmullRom"?];
type GeometryObjectTypes = "Sphere" | "Capsule" | "Cylinder" | "Cube" | "Plane" | "Quad" | "Triangle";
export type MaterialShader = "Standard" | "OpaqueLight" | "TransparentLight" | "BaseWater" | "BillieWater" | "BTSPillar" | "InterscopeConcrete" | "InterscopeCar" | "Obstacle" | "WaterfallMirror";
export type GeometryMaterialJSON = { shader: MaterialShader; color?: Vec3 | Vec4; track?: string; shaderKeywords?: string[] };
export type GeometryObjectJSON = { type: GeometryObjectTypes; material: GeometryMaterialJSON | string };
type CustomEventNames = "AnimateTrack" | "AssignPathAnimation" | "AssignTrackParent" | "AssignPlayerToTrck" | "AnimateComponent";
export type ObjectAnimProps = {
	offsetPosition?: Vec3 | KFVec3[];
	offsetWorldRotation?: Vec3 | KFVec3[];
	localRotation?: Vec3 | KFVec3[];
	scale?: Vec3 | KFVec3[];
	dissolve?: [number] | KFSingle[];
	dissolveArrow?: [number] | KFVec3[];
	interactable?: [number] | KFSingle[];
	definitePosition?: Vec3 | KFVec3[];
	color?: Vec4 | KFVec4[];
};
export type PathAnimProps = {
	offsetPosition?: Vec3 | KFVec3[];
	offsetWorldRotation?: Vec3 | KFVec3[];
	localRotation?: Vec3 | KFVec3[];
	scale?: Vec3 | KFVec3[];
	dissolve?: [number] | KFSingle[];
	dissolveArrow?: [number] | KFVec3[];
	interactable?: [number] | KFSingle[];
	definitePosition?: Vec3 | KFVec3[];
	color?: Vec4 | KFVec4[];
	track: string | string[];
	duration?: number;
	easing?: Easing;
};
export type TrackAnimProps = {
	offsetPosition?: Vec3 | KFVec3[];
	offsetWorldRotation?: Vec3 | KFVec3[];
	localRotation?: Vec3 | KFVec3[];
	scale?: Vec3 | KFVec3[];
	dissolve?: [number] | KFSingle[];
	dissolveArrow?: [number] | KFVec3[];
	interactable?: [number] | KFSingle[];
	time?: KFSingle[];
	color?: Vec4 | KFVec4[];
	position?: Vec3 | KFVec3[];
	rotation?: Vec3 | KFVec3;
	localPosition?: Vec3 | KFVec3[];
	track: string | string[];
	duration?: number;
	easing?: Easing;
	repeat?: number;
};
export type TrackParentProps = { childrenTracks: string[]; parentTrack: string; worldPositionStays?: boolean };
type PlayerObjectControllers = "Root" | "Head" | "LeftHand" | "RightHand";
export type PlayerToTrackProps = { track: string; target?: PlayerObjectControllers };
export type ComponentAnimProps = {
	track: string;
	duration?: number;
	easing?: Easing;
	ILightWithId?: { lightID?: number; type?: number };
	BloomFogEnvironment?: { attenuation?: [number] | KFSingle; offset?: [number] | KFSingle; startY?: [number] | KFSingle; height?: [number] | KFSingle };
	TubeBloomPrePassLight?: { colorAlphaMultiplier?: number; bloomFogIntensityMultiplier?: number };
};

type NoteCustomProps = {
	coordinates?: Vec2;
	worldRotation?: Vec3;
	localRotation?: Vec3;
	noteJumpMovementSpeed?: number;
	noteJumpStartBeatOffest?: number;
	uninteractable?: boolean;
	flip?: Vec2;
	disableNoteGravity?: boolean;
	disableNoteLook?: boolean;
	disableBadCutDirection?: boolean;
	disableBadCutSpeed?: boolean;
	disableBadCutSaberType?: boolean;
	link?: string;
	color?: Vec3 | Vec4;
	spawnEffect?: boolean;
	track?: string | string[];
	animation?: ObjectAnimProps;
};
type SliderCustomProps = { coordinates?: Vec2; worldRotation?: Vec3; localRotation?: Vec3; noteJumpMovementSpeed?: number; noteJumpStartBeatOffset?: number; uninteractable?: boolean; disableNoteGravity?: boolean; tailCoordinates?: Vec2; color?: Vec3 | Vec4; animation?: ObjectAnimProps };
type WallCustomProps = { size?: Vec3; animation?: ObjectAnimProps; coordinates?: Vec2; worldRotation?: Vec3; localRotation?: Vec3; noteJumpMovementSpeed?: number; noteJumpStartBeatOffset?: number; uninteractable?: boolean; color?: Vec3 | Vec4 };

type NoteType = { b: number; x: number; y: number; c: number; d: number; a: number; customData?: NoteCustomProps };
type BombType = { b: number; x: number; y: number; customData?: NoteCustomProps };
type ObstacleType = {
	b: number;
	x: number;
	y: number;
	d: number;
	w: number;
	h: number;
	customData?: WallCustomProps;
};
type BurstSliderType = { b: number; x: number; y: number; c: number; d: number; tb: number; tx: number; ty: number; sc: number; s: number; customData?: SliderCustomProps };
type ArcType = { b: number; c: number; x: number; y: number; d: number; mu: number; tb: number; tx: number; ty: number; tc: number; tmu: number; m: number; customData?: SliderCustomProps };

export type RawMapJSON = {
	version: string;
	bpmEvents: { b: number; m: number }[];
	rotationEvents: { b: number; e: number; r: number }[];
	colorNotes: NoteType[];
	bombNotes: BombType[];
	obstacles: ObstacleType[];
	sliders: ArcType[];
	burstSliders: BurstSliderType[];
	waypoints: [];
	basicBeatmapEvents: {
		b: number;
		et: number;
		i: number;
		f: number;
		customData?: { lightID?: number | number[]; color: Vec3 | Vec4; easing?: Easing; lerpType?: "HSV" | "RGB"; lockRotation?: boolean; speed?: number; direction?: number; nameFilter?: string; rotation?: number; step?: number; prop?: number };
	}[];
	colorBoostBeatmapEvents: { b: number; o: boolean }[];
	lightColorEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; r: number; t: number; b: number; i: number; e: { b: number; i: number; c: number; s: number; f: number }[] }[] }[];
	lightRotationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; l: number; r: number; o: number }[] }[] }[];
	lightTranslationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; t: number }[] }[] }[];
	basicEventTypesWithKeywords: Record<any, any>;
	useNormalEventsAsCompatibleEvents: boolean;
	customData?: {
		customEvents?: { b: number; t: CustomEventNames; d: TrackAnimProps | PathAnimProps | TrackParentProps | PlayerToTrackProps | ComponentAnimProps }[];
		environment?: (Environment | Geometry)[];
		materials?: Record<any, GeometryMaterialJSON>;
		fakeColorNotes?: NoteType[];
		fakeBombNotes?: BombType[];
		fakeObstacles?: ObstacleType[];
		fakeBurstSliders?: BurstSliderType[];
	};
};

export class BeatMap {
	private map: RawMapJSON = {
		version: "3.2.0",
		bpmEvents: [],
		rotationEvents: [],
		colorNotes: [],
		bombNotes: [],
		obstacles: [],
		sliders: [],
		burstSliders: [],
		waypoints: [],
		basicBeatmapEvents: [],
		colorBoostBeatmapEvents: [],
		lightColorEventBoxGroups: [],
		lightRotationEventBoxGroups: [],
		lightTranslationEventBoxGroups: [],
		basicEventTypesWithKeywords: {},
		useNormalEventsAsCompatibleEvents: false,
		customData: {}
	};
	constructor(public readonly inputDiff: DiffNames = "ExpertStandard", public readonly outputDiff: DiffNames = "ExpertPlusStandard") {
		this.map = JSON.parse(Deno.readTextFileSync(inputDiff + ".dat"));
	}

	public readonly version = this.map.version;
	public bpmEvents = this.map.bpmEvents;
	public rotationEvents = this.map.rotationEvents;
	public notes = this.map.colorNotes;
	public bombs = this.map.bombNotes;
	public walls = this.map.obstacles;
	public arcs = this.map.sliders;
	public chains = this.map.burstSliders;
	public events = this.map.basicBeatmapEvents;
	public colorBoostBeatmapEvents = this.map.colorBoostBeatmapEvents;
	public lightColorEventBoxGroups = this.map.lightColorEventBoxGroups;
	public lightRotationEventBoxGroups = this.map.lightRotationEventBoxGroups;
	public lightTranslationEventBoxGroups = this.map.lightTranslationEventBoxGroups;
	public customData = this.map.customData;
	public customEvents = this.map.customData?.customEvents;
	public environments = this.map.customData?.environment;
	public materials = this.map.customData?.materials;
	public fakeNotes = this.map.customData?.fakeColorNotes;
	public fakeBombs = this.map.customData?.fakeBombNotes;
	public fakeObstacles = this.map.customData?.fakeObstacles;
	public fakeChains = this.map.customData?.fakeBurstSliders;

	save() {
		this.notes.forEach(n => {
			jsonPrune(n);
		});
		this.bombs.forEach(n => {
			jsonPrune(n);
		});
		this.walls.forEach(n => {
			jsonPrune(n);
		});
		this.arcs.forEach(n => {
			jsonPrune(n);
		});
		this.chains.forEach(n => {
			jsonPrune(n);
		});
		this.events.forEach(n => jsonPrune(n));

		this.customData ? jsonPrune(this.customData) : delete this.map.customData;
		Deno.writeTextFileSync(this.outputDiff + ".dat", JSON.stringify(this.map));
	}
}

// Functions stolen from ReMapper >:)

/**
 * Checks if an object is empty.
 * @param o Object to check.
 */
export function isEmptyObject(o: Record<string, any>) {
	if (typeof o !== "object") return false;
	return Object.keys(o).length === 0;
}

/**
 * Delete empty objects/arrays from an object recursively.
 * @param obj Object to prune.
 */
export function jsonPrune(obj: Record<string, any>) {
	Object.keys(obj).forEach(prop => {
		if (obj[prop] == null) {
			delete obj[prop];
			return;
		}
		const type = typeof obj[prop];
		if (type === "object") {
			if (Array.isArray(obj[prop])) {
				if (obj[prop].length === 0) {
					delete obj[prop];
				}
			} else {
				jsonPrune(obj[prop]);
				if (isEmptyObject(obj[prop])) {
					delete obj[prop];
				}
			}
		} else if (type === "string" && obj[prop].length === 0) {
			delete obj[prop];
		}
	});
}

export class Environment {
	/**
	 * Create a new environment object.
	 * @param id The environment id.
	 * @param lookupMethod The lookup method for your environment.
	 */
	constructor(public id: string, public lookupMethod: LookupMethod = "Contains") {}
	public active?: boolean;
	duplicate?: number;
	scale?: Vec3;
	position?: Vec3;
	localPosition?: Vec3;
	rotation?: Vec3;
	localRotation?: Vec3;
	track?: string | string[];
	/**
	 * Return your environment object as an object.
	 */
	return() {
		jsonPrune(this);
		return this;
	}
}

export class Geometry {
	public geometry: GeometryObjectJSON = { type: "Cube", material: { shader: "Standard" } };
	/**
	 * Create a new geometry object.
	 * @param type The geometry primitive to use.
	 * @param material The material for your geometry.
	 */
	constructor(type?: GeometryObjectTypes, material?: GeometryMaterialJSON | string) {
		if (type) {
			this.geometry.type = type;
		}
		if (material) {
			this.geometry.material = material;
		}
	}
	public scale?: Vec3;
	position?: Vec3;
	localPosition?: Vec3;
	rotation?: Vec3;
	localRotation?: Vec3;
	track?: string | string[];
	/**
	 * Return your geometry object as an object.
	 */
	return() {
		jsonPrune(this);
		return this;
	}
}

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
	offset = this.customData.noteJumpStartBeatOffest;
	NJS = this.customData.noteJumpMovementSpeed;
	animation = this.customData.animation;
	rotation = this.customData.worldRotation;
	localRotation = this.customData.localRotation;
	disableNoteGravity = this.customData.disableNoteGravity;
	disableNoteLook = this.customData.disableNoteLook;
	color = this.customData.color;
	spawnEffect = this.customData.spawnEffect;
	track = this.customData.track;

	get interactable() {
		return !this.customData.uninteractable;
	}
	set interactable(state: boolean) {
		this.customData.uninteractable = !state;
	}

	get x() {
		return this.pos[0];
	}
	set x(val: number) {
		this.pos[0] = val;
	}

	get y() {
		return this.pos[1];
	}
	set y(val: number) {
		this.pos[1] = val;
	}

	/**
	 * Return the note as an object.
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
}

export class Bomb {
	/**
	 * Create a new bomb.
	 * @param time The time of the bomb.
	 * @param pos The [x, y] of the bomb.
	 */
	constructor(public time = 0, public pos: Vec2 = [0, 0]) {}
	public customData: NoteCustomProps = {};
	offset = this.customData.noteJumpStartBeatOffest;
	NJS = this.customData.noteJumpMovementSpeed;
	animation = this.customData.animation;

	get x() {
		return this.pos[0];
	}
	set x(val: number) {
		this.pos[0] = val;
	}

	get y() {
		return this.pos[1];
	}
	set y(val: number) {
		this.pos[1] = val;
	}
	/**
	 * Return the bomb as an object.
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
}

/* type ObstacleType = {
	b: number;
	x: number;
	y: number;
	d: number;
	w: number;
	h: number;
	customData?: { size?: Vec3; animation?: ObjectAnimProps; coordinates?: Vec2; worldRotation?: Vec3; localRotation?: Vec3; noteJumpMovementSpeed?: number; noteJumpStartBeatOffset?: number; uninteractable?: boolean; color?: Vec3 | Vec4 };
};

*/

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
	scale = this.customData.size;
	animation = this.customData.animation;
	rotation = this.customData.worldRotation;
	localRotation = this.customData.localRotation;
	NJS = this.customData.noteJumpMovementSpeed;
	offset = this.customData.noteJumpStartBeatOffset;
	color = this.customData.color;

	get x() {
		return this.pos[0];
	}
	set x(val: number) {
		this.pos[0] = val;
	}

	get y() {
		return this.pos[1];
	}
	set y(val: number) {
		this.pos[1] = val;
	}

	get interactable() {
		return !this.customData.uninteractable;
	}
	set interactable(state: boolean) {
		this.customData.uninteractable = !state;
	}
	/**
	 * Return the wall as an object.
	 */
	return() {
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
}
