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
type CustomEventNames = "AnimateTrack" | "AssignPathAnimation" | "AssignTrackParent" | "AssignPlayerToTrack" | "AnimateComponent";
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

enum LightEventTypesEnum {
	"BackLasers" = 0,
	"RingLights" = 1,
	"LeftLasers" = 2,
	"RightLasers" = 3,
	"CenterLights" = 4,
	"BoostColors" = 5,
	"RingSpin" = 8,
	"RingZoom" = 9,
	"LeftLaserSpeed" = 12,
	"RightLaserSpeed" = 13
}

export type LightEventTypes = "BackLasers" | "RingLights" | "LeftLasers" | "RightLasers" | "CenterLights" | "BoostColors" | "RingSpin" | "RingZoom" | "LeftLaserSpeed" | "RightLaserSpeed";

enum LightEventValuesEnum {
	"Off" = 0,
	"OnBlue" = 1,
	"FlashBlue" = 2,
	"FadeBlue" = 3,
	"Transition" = 4,
	"TransitionBlue" = 4,
	"OnRed" = 5,
	"FlashRed" = 6,
	"FadeRed" = 7,
	"TransitionRed" = 8,
	"OnWhite" = 9,
	"FlashWhite" = 10,
	"FadeWhite" = 11,
	"TransitionWhite" = 12
}

export type LightEventValues = "Off" | "OnBlue" | "FlashBlue" | "FadeBlue" | "Transition" | "TransitionBlue" | "OnRed" | "FlashRed" | "FadeRed" | "TransitionRed" | "OnWhite" | "FlashWhite" | "FadeWhite" | "TransitionWhite";

type NoteCustomProps = {
	coordinates?: Vec2;
	worldRotation?: Vec3;
	localRotation?: Vec3;
	noteJumpMovementSpeed?: number;
	noteJumpStartBeatOffset?: number;
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
type SliderCustomProps = {
	coordinates?: Vec2;
	worldRotation?: Vec3;
	localRotation?: Vec3;
	noteJumpMovementSpeed?: number;
	noteJumpStartBeatOffset?: number;
	uninteractable?: boolean;
	disableNoteGravity?: boolean;
	tailCoordinates?: Vec2;
	color?: Vec3 | Vec4;
	animation?: ObjectAnimProps;
	track?: string | string[];
};
type WallCustomProps = { size?: Vec3; animation?: ObjectAnimProps; coordinates?: Vec2; worldRotation?: Vec3; localRotation?: Vec3; noteJumpMovementSpeed?: number; noteJumpStartBeatOffset?: number; uninteractable?: boolean; color?: Vec3 | Vec4; track?: string | string[] };

type NoteType = { b: number; x: number; y: number; c: number; d: number; a: number; customData?: NoteCustomProps };
type BombType = { b: number; x: number; y: number; customData?: NoteCustomProps };
type ObstacleType = { b: number; x: number; y: number; d: number; w: number; h: number; customData?: WallCustomProps };
type BurstSliderType = { b: number; x: number; y: number; c: number; d: number; tb: number; tx: number; ty: number; sc: number; s: number; customData?: SliderCustomProps };
type SliderType = { b: number; c: number; x: number; y: number; d: number; mu: number; tb: number; tx: number; ty: number; tc: number; tmu: number; m: number; customData?: SliderCustomProps };
type LightEventCustomData = { lightID?: number | number[]; color?: Vec3 | Vec4; easing?: Easing; lerpType?: "HSV" | "RGB"; lockRotation?: boolean; speed?: number; direction?: number; nameFilter?: string; rotation?: number; step?: number; prop?: number };
type LightEventType = { b: number; et: number; i: number; f: number; customData?: LightEventCustomData };
type CustomEventType = { b: number; t: CustomEventNames; d: TrackAnimProps | PathAnimProps | TrackParentProps | PlayerToTrackProps | ComponentAnimProps };

type KeywordsBaseWater = (
	| "FOG"
	| "HEIGHT_FOG"
	| "INVERT_RIMLIGHT"
	| "MASK_RED_IS_ALPHA"
	| "NOISE_DITHERING"
	| "NORMAL_MAP"
	| "REFLECTION_PROBE"
	| "REFLECTION_PROBE_BOX_PROJECTION"
	| "_DECALBLEND_ALPHABLEND"
	| "_DISSOLVEAXIS_LOCALX"
	| "_EMISSIONCOLORTYPE_FLAT"
	| "_EMISSIONTEXTURE_NONE"
	| "_RIMLIGHT_NONE"
	| "_ROTATE_UV_NONE"
	| "_VERTEXMODE_NONE"
	| "_WHITEBOOSTTYPE_NONE"
	| "_ZWRITE_ON"
)[];

type KeywordsBillieWater = (
	| "FOG"
	| "HEIGHT_FOG"
	| "INVERT_RIMLIGHT"
	| "MASK_RED_IS_ALPHA"
	| "NOISE_DITHERING"
	| "NORMAL_MAP"
	| "REFLECTION_PROBE"
	| "REFLECTION_PROBE_BOX_PROJECTION"
	| "_DECALBLEND_ALPHABLEND"
	| "_DISSOLVEAXIS_LOCALX"
	| "_EMISSIONCOLORTYPE_FLAT"
	| "_EMISSIONTEXTURE_NONE"
	| "_RIMLIGHT_NONE"
	| "_ROTATE_UV_NONE"
	| "_VERTEXMODE_NONE"
	| "_WHITEBOOSTTYPE_NONE"
	| "_ZWRITE_ON"
)[];

type KeywordsBTSPillar = ("DIFFUSE" | "ENABLE_DIFFUSE" | "ENABLE_FOG" | "ENABLE_HEIGHT_FOG" | "ENABLE_SPECULAR" | "FOG" | "HEIGHT_FOG" | "REFLECTION_PROBE_BOX_PROJECTION" | "SPECULAR" | "_EMISSION" | "_ENABLE_FOG_TINT" | "_RIMLIGHT_NONE")[];

type KeywordsInterscopeCar = (
	| "ENABLE_DIFFUSE"
	| "ENABLE_DIRT"
	| "ENABLE_DIRT_DETAIL"
	| "ENABLE_FOG"
	| "ENABLE_GROUND_FADE"
	| "ENABLE_SPECULAR"
	| "ENABLE_VERTEX_COLOR"
	| "FOG"
	| "INVERT_RIM_DIM"
	| "REFLECTION_PROBE"
	| "REFLECTION_PROBE_BOX_PROJECTION"
	| "REFLECTION_PROBE_BOX_PROJECTION_OFFSET"
	| "SPECULAR_ANTIFLICKER"
	| "_EMISSION"
	| "_EMISSIONCOLORTYPE_WHITEBOOST"
	| "_EMISSIONTEXTURE_NONE"
	| "_ENABLE_FOG_TINT"
	| "_RIMLIGHT_NONE"
	| "_VERTEXMODE_METALSMOOTHNESS"
	| "_WHITEBOOSTTYPE_NONE"
)[];

type KeywordsInterscopeConcrete = (
	| "DIRT"
	| "ENABLE_DIFFUSE"
	| "ENABLE_DIRT"
	| "ENABLE_DIRT_DETAIL"
	| "ENABLE_FOG"
	| "ENABLE_GROUND_FADE"
	| "ENABLE_SPECULAR"
	| "ENABLE_VERTEX_COLOR"
	| "FOG"
	| "LIGHTMAP"
	| "NOISE_DITHERING"
	| "REFLECTION_PROBE"
	| "REFLECTION_PROBE_BOX_PROJECTION"
	| "REFLECTION_PROBE_BOX_PROJECTION_OFFSET"
	| "_EMISSION"
	| "_ENABLE_FOG_TINT"
	| "_RIMLIGHT_NONE"
)[];

type KeywordsStandard = ("DIFFUSE" | "ENABLE_DIFFUSE" | "ENABLE_FOG" | "ENABLE_HEIGHT_FOG" | "ENABLE_SPECULAR" | "FOG" | "HEIGHT_FOG" | "REFLECTION_PROBE_BOX_PROJECTION" | "SPECULAR" | "_EMISSION" | "_ENABLE_FOG_TINT" | "_RIMLIGHT_NONE")[];

type KeywordsWaterfallMirror = ("DETAIL_NORMAL_MAP" | "ENABLE_MIRROR" | "ETC1_EXTERNAL_ALPHA" | "LIGHTMAP" | "REFLECTION_PROBE_BOX_PROJECTION" | "_EMISSION")[];

export type RawMapJSON = {
	version: string;
	bpmEvents: { b: number; m: number }[];
	rotationEvents: { b: number; e: number; r: number }[];
	colorNotes: NoteType[];
	bombNotes: BombType[];
	obstacles: ObstacleType[];
	sliders: SliderType[];
	burstSliders: BurstSliderType[];
	waypoints: any[];
	basicBeatmapEvents: LightEventType[];
	colorBoostBeatmapEvents: { b: number; o: boolean }[];
	lightColorEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; r: number; t: number; b: number; i: number; e: { b: number; i: number; c: number; s: number; f: number }[] }[] }[];
	lightRotationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; l: number; r: number; o: number }[] }[] }[];
	lightTranslationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; t: number }[] }[] }[];
	basicEventTypesWithKeywords: Record<any, any>;
	useNormalEventsAsCompatibleEvents: boolean;
	customData?: {
		customEvents?: CustomEventType[];
		environment?: (Environment | Geometry)[];
		materials?: Record<any, GeometryMaterialJSON>;
		fakeColorNotes?: NoteType[];
		fakeBombNotes?: BombType[];
		fakeObstacles?: ObstacleType[];
		fakeBurstSliders?: BurstSliderType[];
	};
};

export let thisDiff: BeatMap;

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
		thisDiff = this;
	}

	get version() {
		return this.map.version;
	}

	set bpmEvents(x) {
		this.map.bpmEvents = x;
	}
	get bpmEvents() {
		return this.map.bpmEvents;
	}

	set rotationEvents(x) {
		this.map.rotationEvents = x;
	}
	get rotationEvents() {
		return this.map.rotationEvents;
	}

	set notes(x) {
		this.map.colorNotes = x;
	}
	get notes() {
		return this.map.colorNotes;
	}

	set bombs(x) {
		this.map.bombNotes = x;
	}
	get bombs() {
		return this.map.bombNotes;
	}

	set walls(x) {
		this.map.obstacles = x;
	}
	get walls() {
		return this.map.obstacles;
	}

	set arcs(x) {
		this.map.sliders = x;
	}
	get arcs() {
		return this.map.sliders;
	}

	set chains(x) {
		this.map.burstSliders = x;
	}
	get chains() {
		return this.map.burstSliders;
	}

	set events(x) {
		this.map.basicBeatmapEvents = x;
	}
	get events() {
		return this.map.basicBeatmapEvents;
	}

	set colorBoostBeatmapEvents(x) {
		this.map.colorBoostBeatmapEvents = x;
	}
	get colorBoostBeatmapEvents() {
		return this.map.colorBoostBeatmapEvents;
	}

	set lightColorEventBoxGroups(x) {
		this.map.lightColorEventBoxGroups = x;
	}
	get lightColorEventBoxGroups() {
		return this.map.lightColorEventBoxGroups;
	}

	set lightRotationEventBoxGroups(x) {
		this.map.lightRotationEventBoxGroups = x;
	}
	get lightRotationEventBoxGroups() {
		return this.map.lightRotationEventBoxGroups;
	}

	set lightTranslationEventBoxGroups(x) {
		this.map.lightTranslationEventBoxGroups = x;
	}
	get lightTranslationEventBoxGroups() {
		return this.map.lightTranslationEventBoxGroups;
	}

	set customData(x) {
		this.map.customData = x;
	}
	get customData() {
		return this.map.customData;
	}

	set customEvents(x) {
		if (this.customData) {
			this.customData.customEvents = x;
		} else {
			this.customData = { customEvents: x };
		}
	}
	get customEvents() {
		return this.customData?.customEvents;
	}

	set environments(x) {
		if (this.customData) {
			this.customData.environment = x;
		} else {
			this.customData = { environment: x };
		}
	}
	get environments() {
		return this.customData?.environment;
	}

	set materials(x) {
		if (this.customData) {
			this.customData.materials = x;
		} else {
			this.customData = { materials: x };
		}
	}
	get materials() {
		return this.customData?.materials;
	}

	set fakeNotes(x) {
		if (this.customData) {
			this.customData.fakeColorNotes = x;
		} else {
			this.customData = { fakeColorNotes: x };
		}
	}
	get fakeNotes() {
		return this.customData?.fakeColorNotes;
	}

	set fakeBombs(x) {
		if (this.customData) {
			this.customData.fakeBombNotes = x;
		} else {
			this.customData = { fakeBombNotes: x };
		}
	}
	get fakeBombs() {
		return this.customData?.fakeBombNotes;
	}

	set fakeObstacles(x) {
		if (this.customData) {
			this.customData.fakeObstacles = x;
		} else {
			this.customData = { fakeObstacles: x };
		}
	}
	get fakeObstacles() {
		return this.customData?.fakeObstacles;
	}

	set fakeChains(x) {
		if (this.customData) {
			this.customData.fakeBurstSliders = x;
		} else {
			this.customData = { fakeBurstSliders: x };
		}
	}
	get fakeChains() {
		return this.customData?.fakeBurstSliders;
	}

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
		this.events.forEach(n => {
			jsonPrune(n);
		});

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
	/**
	 * Push the environment to the current diff.
	 */
	push() {
		thisDiff.environments?.push(this.return());
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
	/**
	 * Push the geometry to the current diff.
	 */
	push() {
		thisDiff.environments?.push(this.return());
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
	/**
	 * Push the note to the current diff.
	 */
	push() {
		thisDiff.notes.push(this.return());
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
	/**
	 * Push the bomb to the current diff.
	 */
	push() {
		thisDiff.bombs.push(this.return());
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
	 * Return the wall as an object.
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
	/**
	 * Push the wall to the current diff.
	 */
	push() {
		thisDiff.walls.push(this.return());
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
	 * Return the arc as an object.
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
	/**
	 * Push the arc to the current diff.
	 */
	push() {
		thisDiff.arcs.push(this.return());
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
	 * Return the chain as an object.
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
	/**
	 * Push the chain to the current diff.
	 */
	push() {
		thisDiff.chains.push(this.return());
	}
}

export class LightEvent {
	/**
	 * Create a new lighting event.
	 * @param time The time of the event.
	 */
	constructor(public time = 0) {}
	public type: LightEventTypes = "BackLasers";
	value: LightEventValues = "OnRed";
	floatValue = 1;
	customData: LightEventCustomData = {};

	set lightID(x) {
		this.customData.lightID = x;
	}
	get lightID() {
		return this.customData.lightID;
	}

	set color(x) {
		this.customData.color = x;
	}
	get color() {
		return this.customData.color;
	}

	set lerpType(x) {
		this.customData.lerpType = x;
	}
	get lerpType() {
		return this.customData.lerpType;
	}

	/**
	 * Return the light event as an object.
	 */
	return(): LightEventType {
		jsonPrune(this);
		return {
			b: this.time,
			et: LightEventTypesEnum[this.type],
			i: LightEventValuesEnum[this.value],
			f: this.floatValue,
			customData: this.customData
		};
	}
	/**
	 * Push the event to the current diff.
	 */
	push() {
		thisDiff.events.push(this.return());
	}
}

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
				thisDiff.customEvents?.push(this.return());
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
				thisDiff.customEvents?.push(this.return());
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
				thisDiff.customEvents?.push(this.return());
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
				thisDiff.customEvents?.push(this.return());
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
				thisDiff.customEvents?.push(this.return());
			}
		};
	}
}

export class Material {
	public color?: Vec3 | Vec4;
	public track?: string;
	public shaderKeywords?: string[];
	public shader: MaterialShader = "Standard";
	BTSPillar(shaderKeywords?: KeywordsBTSPillar, color?: Vec3 | Vec4, track?: string) {
		if (color) {
			this.color = color;
		}
		if (track) {
			this.track = track;
		}
		if (shaderKeywords) {
			this.shaderKeywords = shaderKeywords;
		}
		this.shader = "BTSPillar";
		return this as GeometryMaterialJSON;
	}
	OpaqueLight(shaderKeywords?: string[], color?: Vec3 | Vec4, track?: string) {
		if (color) {
			this.color = color;
		}
		if (track) {
			this.track = track;
		}
		if (shaderKeywords) {
			this.shaderKeywords = shaderKeywords;
		}
		this.shader = "OpaqueLight";
		return this as GeometryMaterialJSON;
	}
	TransparentLight(shaderKeywords?: string[], color?: Vec3 | Vec4, track?: string) {
		if (color) {
			this.color = color;
		}
		if (track) {
			this.track = track;
		}
		if (shaderKeywords) {
			this.shaderKeywords = shaderKeywords;
		}
		this.shader = "TransparentLight";
		return this as GeometryMaterialJSON;
	}
	BaseWater(shaderKeywords?: KeywordsBaseWater, color?: Vec3 | Vec4, track?: string) {
		if (color) {
			this.color = color;
		}
		if (track) {
			this.track = track;
		}
		if (shaderKeywords) {
			this.shaderKeywords = shaderKeywords;
		}
		this.shader = "BaseWater";
		return this as GeometryMaterialJSON;
	}
	BillieWater(shaderKeywords?: KeywordsBillieWater, color?: Vec3 | Vec4, track?: string) {
		if (color) {
			this.color = color;
		}
		if (track) {
			this.track = track;
		}
		if (shaderKeywords) {
			this.shaderKeywords = shaderKeywords;
		}
		this.shader = "BillieWater";
		return this as GeometryMaterialJSON;
	}
	Standard(shaderKeywords?: KeywordsStandard, color?: Vec3 | Vec4, track?: string) {
		if (color) {
			this.color = color;
		}
		if (track) {
			this.track = track;
		}
		if (shaderKeywords) {
			this.shaderKeywords = shaderKeywords;
		}
		this.shader = "Standard";
		return this as GeometryMaterialJSON;
	}
	InterscopeConcrete(shaderKeywords?: KeywordsInterscopeConcrete, color?: Vec3 | Vec4, track?: string) {
		if (color) {
			this.color = color;
		}
		if (track) {
			this.track = track;
		}
		if (shaderKeywords) {
			this.shaderKeywords = shaderKeywords;
		}
		this.shader = "InterscopeConcrete";
		return this as GeometryMaterialJSON;
	}
	InterscopeCar(shaderKeywords?: KeywordsInterscopeCar, color?: Vec3 | Vec4, track?: string) {
		if (color) {
			this.color = color;
		}
		if (track) {
			this.track = track;
		}
		if (shaderKeywords) {
			this.shaderKeywords = shaderKeywords;
		}
		this.shader = "InterscopeCar";
		return this as GeometryMaterialJSON;
	}
	WaterfallMirror(shaderKeywords?: KeywordsWaterfallMirror, color?: Vec3 | Vec4, track?: string) {
		if (color) {
			this.color = color;
		}
		if (track) {
			this.track = track;
		}
		if (shaderKeywords) {
			this.shaderKeywords = shaderKeywords;
		}
		this.shader = "WaterfallMirror";
		return this as GeometryMaterialJSON;
	}
}
