// deno-lint-ignore-file no-explicit-any
export type DiffNames = `${BeatMapDifficultyNames}${BeatMapCharacteristicNames}`;
type BeatMapCharacteristicNames = "Standard" | "Lightshow" | "Lawless" | "360Degree" | "90Degree" | "NoArrows" | "OneSaber";
type BeatMapDifficultyNames = "Easy" | "Normal" | "Hard" | "Expert" | "ExpertPlus";
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
export type GeometryObjectTypes = "Sphere" | "Capsule" | "Cylinder" | "Cube" | "Plane" | "Quad" | "Triangle";
export type MaterialShader = "Standard" | "OpaqueLight" | "TransparentLight" | "BaseWater" | "BillieWater" | "BTSPillar" | "InterscopeConcrete" | "InterscopeCar" | "Obstacle" | "WaterfallMirror";
export type GeometryMaterialJSON = { shader: MaterialShader; color?: Vec3 | Vec4; track?: string; shaderKeywords?: string[] };
export type GeometryObjectJSON = { type: GeometryObjectTypes; material: GeometryMaterialJSON | string };
export type CustomEventNames = "AnimateTrack" | "AssignPathAnimation" | "AssignTrackParent" | "AssignPlayerToTrack" | "AnimateComponent";
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

export type LightEventTypes = "BackLasers" | "RingLights" | "LeftLasers" | "RightLasers" | "CenterLights" | "BoostColors" | "RingSpin" | "RingZoom" | "LeftLaserSpeed" | "RightLaserSpeed";

class TwoWayMap {
	private reverseMap: Record<any, any>;
	constructor(private map: Record<any, any>) {
		this.map = map;
		this.reverseMap = {};
		for (const key in map) {
			const value = map[key];
			this.reverseMap[value] = key;
		}
	}
	get(key: any) {
		return this.map[key];
	}
	revGet(key: any) {
		return this.reverseMap[key];
	}
}

const LightEventTypesMap = new TwoWayMap({
	BackLasers: 0,
	RingLights: 1,
	LeftLasers: 2,
	RightLasers: 3,
	CenterLights: 4,
	BoostColors: 5,
	RingSpin: 8,
	RingZoom: 9,
	LeftLaserSpeed: 12,
	RightLaserSpeed: 13
});

const LightEventValuesMap = new TwoWayMap({
	Off: 0,
	OnBlue: 1,
	FlashBlue: 2,
	FadeBlue: 3,
	Transition: 4,
	TransitionBlue: 4,
	OnRed: 5,
	FlashRed: 6,
	FadeRed: 7,
	TransitionRed: 8,
	OnWhite: 9,
	FlashWhite: 10,
	FadeWhite: 11,
	TransitionWhite: 12
});

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

export type NoteType = { b: number; x: number; y: number; c: number; d: number; a: number; customData?: NoteCustomProps };
export type BombType = { b: number; x: number; y: number; customData?: NoteCustomProps };
export type ObstacleType = { b: number; x: number; y: number; d: number; w: number; h: number; customData?: WallCustomProps };
export type BurstSliderType = { b: number; x: number; y: number; c: number; d: number; tb: number; tx: number; ty: number; sc: number; s: number; customData?: SliderCustomProps };
export type SliderType = { b: number; c: number; x: number; y: number; d: number; mu: number; tb: number; tx: number; ty: number; tc: number; tmu: number; m: number; customData?: SliderCustomProps };
export type LightEventCustomData = { lightID?: number | number[]; color?: Vec3 | Vec4; easing?: Easing; lerpType?: "HSV" | "RGB"; lockRotation?: boolean; speed?: number; direction?: number; nameFilter?: string; rotation?: number; step?: number; prop?: number };
export type LightEventType = { b: number; et: number; i: number; f: number; customData?: LightEventCustomData };
export type CustomEventType = { b: number; t: CustomEventNames; d: TrackAnimProps | PathAnimProps | TrackParentProps | PlayerToTrackProps | ComponentAnimProps };

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

export type EnvironmentNames =
	| "BTSEnvironment"
	| "BigMirrorEnvironment"
	| "BillieEnvironment"
	| "CrabRaveEnvironment"
	| "DefaultEnvironment"
	| "DragonsEnvironment"
	| "FitBeatEnvironment"
	| "GagaEnvironment"
	| "GreenDayEnvironment"
	| "GreenDayGrenadeEnvironment"
	| "InterscopeEnvironment"
	| "KDAEnvironment"
	| "KaleidoscopeEnvironment"
	| "LinkinParkEnvironment"
	| "MonstercatEnvironment"
	| "NiceEnvironment"
	| "OriginsEnvironment"
	| "PanicEnvironment"
	| "RocketEnvironment"
	| "SkrillexEnvironment"
	| "HalloweenEnvironment"
	| "TimbalandEnvironment"
	| "TriangleEnvironment"
	| "WeaveEnvironment"
	| "PyroEnvironment"
	| "TheSecondEnvironment"
	| "EDMEnvironment";

type infoJSON = {
	_version: "2.1.0";
	_songName: string;
	_songSubName: string;
	_songAuthorName: string;
	_levelAuthorName: string;
	_beatsPerMinute: number;
	_shuffle: number;
	_shufflePeriod: number;
	_previewStartTime: number;
	_previewDuration: number;
	_songFilename: string;
	_coverImageFilename: string;
	_environmentName: EnvironmentNames;
	_allDirectionsEnvironmentName: string;
	_songTimeOffset: number;
	_environmentNames: [];
	_colorSchemes: {
		useOverride: boolean;
		colorScheme: {
			colorSchemeId: string;
			saberAColor: {
				r: number;
				g: number;
				b: number;
				a: number;
			};
			saberBColor: {
				r: number;
				g: number;
				b: number;
				a: number;
			};
			obstaclesColor: {
				r: number;
				g: number;
				b: number;
				a: number;
			};
			environmentColor0: {
				r: number;
				g: number;
				b: number;
				a: number;
			};
			environmentColor1: {
				r: number;
				g: number;
				b: number;
				a: number;
			};
			environmentColor0Boost: {
				r: number;
				g: number;
				b: number;
				a: number;
			};
			environmentColor1Boost: {
				r: number;
				g: number;
				b: number;
				a: number;
			};
		};
	}[];
	_customData?: Record<any, any>;
	_difficultyBeatmapSets: {
		_beatmapCharacteristicName: "Standard" | "Lightshow" | "Lawless";
		_difficultyBeatmaps: {
			_difficulty: BeatMapDifficultyNames;
			_difficultyRank: number;
			_beatmapFilename: string;
			_noteJumpMovementSpeed: number;
			_noteJumpStartBeatOffset: number;
			_beatmapColorSchemeIdx: number;
			_environmentNameIdx: number;
			_customData?: Record<any, any>;
		}[];
	}[];
};

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
		environment?: Environment[];
		materials?: Record<any, GeometryMaterialJSON>;
		fakeColorNotes?: NoteType[];
		fakeBombNotes?: BombType[];
		fakeObstacles?: ObstacleType[];
		fakeBurstSliders?: BurstSliderType[];
	};
};

type classMap = {
	version: string;
	bpmEvents: { b: number; m: number }[];
	rotationEvents: { b: number; e: number; r: number }[];
	colorNotes: Note[];
	bombNotes: Bomb[];
	obstacles: Wall[];
	sliders: Arc[];
	burstSliders: Chain[];
	waypoints: any[];
	basicBeatmapEvents: LightEvent[];
	colorBoostBeatmapEvents: { b: number; o: boolean }[];
	lightColorEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; r: number; t: number; b: number; i: number; e: { b: number; i: number; c: number; s: number; f: number }[] }[] }[];
	lightRotationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; l: number; r: number; o: number }[] }[] }[];
	lightTranslationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; t: number }[] }[] }[];
	basicEventTypesWithKeywords: Record<any, any>;
	useNormalEventsAsCompatibleEvents: boolean;
	customData: {
		customEvents: CustomEventType[];
		environment: Environment[];
		materials: Record<any, GeometryMaterialJSON>;
		fakeColorNotes: Note[];
		fakeBombNotes: Bomb[];
		fakeObstacles: Wall[];
		fakeBurstSliders: Chain[];
	};
};

export let currentDiff: BeatMap;

export class BeatMap {
	private rawMap: RawMapJSON = {
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
	map: classMap = {
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
		customData: { environment: [], customEvents: [], materials: {}, fakeBombNotes: [], fakeBurstSliders: [], fakeColorNotes: [], fakeObstacles: [] }
	};

	constructor(public readonly inputDiff: DiffNames = "ExpertStandard", public readonly outputDiff: DiffNames = "ExpertPlusStandard") {
		this.rawMap = JSON.parse(Deno.readTextFileSync(inputDiff + ".dat"));
		this.rawMap.basicBeatmapEvents.forEach(e => {
			new LightEvent().JSONToClass(e).push();
		});
		this.rawMap.bombNotes.forEach(n => {
			new Bomb().JSONToClass(n).push();
		});
		this.rawMap.burstSliders.forEach(n => {
			new Chain().JSONToClass(n).push();
		});
		this.rawMap.colorNotes.forEach(n => {
			new Note().JSONToClass(n).push();
		});
		this.rawMap.obstacles.forEach(n => {
			new Wall().JSONToClass(n).push();
		});
		this.rawMap.sliders.forEach(n => {
			new Arc().JSONToClass(n).push();
		});
		if (this.rawMap.customData) {
			if (this.rawMap.customData.customEvents) {
				this.map.customData.customEvents = this.rawMap.customData.customEvents;
			}
			if (this.rawMap.customData.environment) {
				this.map.customData.environment = this.rawMap.customData.environment;
			}
			if (this.rawMap.customData.fakeBombNotes) {
				this.rawMap.customData.fakeBombNotes.forEach(n => {
					new Bomb().JSONToClass(n).push(true);
				});
			}
			if (this.rawMap.customData.fakeBurstSliders) {
				this.rawMap.customData.fakeBurstSliders.forEach(n => {
					new Chain().JSONToClass(n).push(true);
				});
			}
			if (this.rawMap.customData.fakeColorNotes) {
				this.rawMap.customData.fakeColorNotes.forEach(n => {
					new Note().JSONToClass(n).push(true);
				});
			}
			if (this.rawMap.customData.fakeObstacles) {
				this.rawMap.customData.fakeObstacles.forEach(n => {
					new Wall().JSONToClass(n).push(true);
				});
			}
		}
		this.map.bpmEvents = this.rawMap.bpmEvents;
		this.map.basicEventTypesWithKeywords = this.rawMap.basicEventTypesWithKeywords;
		this.map.colorBoostBeatmapEvents = this.rawMap.colorBoostBeatmapEvents;
		this.map.lightColorEventBoxGroups = this.rawMap.lightColorEventBoxGroups;
		this.map.lightRotationEventBoxGroups = this.rawMap.lightRotationEventBoxGroups;
		this.map.lightTranslationEventBoxGroups = this.rawMap.lightTranslationEventBoxGroups;
		this.map.rotationEvents = this.rawMap.rotationEvents;
		this.map.useNormalEventsAsCompatibleEvents = this.rawMap.useNormalEventsAsCompatibleEvents;
		this.map.waypoints = this.rawMap.waypoints;
		currentDiff = this;
	}

	public info = new Info();

	suggest(mod: "Chroma" | "Cinema") {
		this.info.raw._difficultyBeatmapSets.forEach(x => {
			x._difficultyBeatmaps.forEach(y => {
				if (y._beatmapFilename == this.outputDiff + ".dat") {
					if (y._customData) {
						y._customData._suggestions.push(mod);
					} else {
						y._customData = {
							_suggestions: []
						};
						y._customData._suggestions.push(mod);
					}
				}
			});
		});
	}

	require(mod: "Chroma" | "Noodle Extensions") {
		this.info.raw._difficultyBeatmapSets.forEach(x => {
			x._difficultyBeatmaps.forEach(y => {
				if (y._beatmapFilename == this.outputDiff + ".dat") {
					if (y._customData) {
						if (!y._customData._requirements) {
							y._customData["_requirements"] = [];
						}
						y._customData._requirements.push(mod);
					} else {
						y._customData = {
							_requirements: []
						};
						y._customData._requirements.push(mod);
					}
				}
			});
		});
	}

	get version() {
		return this.map.version;
	}

	set basicEventTypesWithKeywords(x) {
		this.map.basicEventTypesWithKeywords = x;
	}
	get basicEventTypesWithKeywords() {
		return this.map.basicEventTypesWithKeywords;
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
		this.customData.customEvents = x;
	}
	get customEvents() {
		return this.customData?.customEvents;
	}

	set environments(x) {
		this.customData.environment = x;
	}
	get environments() {
		return this.customData?.environment;
	}

	set materials(x) {
		this.customData.materials = x;
	}
	get materials() {
		return this.customData?.materials;
	}

	set fakeNotes(x) {
		this.customData.fakeColorNotes = x;
	}
	get fakeNotes() {
		return this.customData?.fakeColorNotes;
	}

	set fakeBombs(x) {
		this.customData.fakeBombNotes = x;
	}
	get fakeBombs() {
		return this.customData?.fakeBombNotes;
	}

	set fakeObstacles(x) {
		this.customData.fakeObstacles = x;
	}
	get fakeObstacles() {
		return this.customData?.fakeObstacles;
	}

	set fakeChains(x) {
		this.customData.fakeBurstSliders = x;
	}
	get fakeChains() {
		return this.customData?.fakeBurstSliders;
	}

	set useNormalEventsAsCompatibleEvents(x) {
		this.map.useNormalEventsAsCompatibleEvents = x;
	}
	get useNormalEventsAsCompatibleEvents() {
		return this.map.useNormalEventsAsCompatibleEvents;
	}

	save() {
		const tempNotes: (NoteType | Note)[] = copy(this.notes),
			tempBombs: (BombType | Bomb)[] = copy(this.bombs),
			tempWalls: (ObstacleType | Wall)[] = copy(this.walls),
			tempArcs: (SliderType | Arc)[] = copy(this.arcs),
			tempChains: (BurstSliderType | Chain)[] = copy(this.chains),
			tempEvents: (LightEvent | LightEventType)[] = copy(this.events),
			tempFakeNotes: (NoteType | Note)[] = copy(this.fakeNotes),
			tempFakeBombs: (BombType | Bomb)[] = copy(this.fakeBombs),
			tempFakeWalls: (ObstacleType | Wall)[] = copy(this.fakeObstacles),
			tempFakeChains: (BurstSliderType | Chain)[] = copy(this.fakeChains);
		tempNotes.forEach(n => {
			jsonPrune(n);
			if (n instanceof Note) {
				n = n.return();
			}
		});
		tempBombs.forEach(n => {
			jsonPrune(n);
			if (n instanceof Bomb) {
				n = n.return();
			}
		});
		tempWalls.forEach(n => {
			jsonPrune(n);
			if (n instanceof Wall) {
				n = n.return();
			}
		});
		tempArcs.forEach(n => {
			jsonPrune(n);
			if (n instanceof Arc) {
				n = n.return();
			}
		});
		tempChains.forEach(n => {
			jsonPrune(n);
			if (n instanceof Chain) {
				n = n.return();
			}
		});
		tempFakeNotes.forEach(n => {
			jsonPrune(n);
			if (n instanceof Note) {
				n = n.return();
			}
		});
		tempFakeBombs.forEach(n => {
			jsonPrune(n);
			if (n instanceof Bomb) {
				n = n.return();
			}
		});
		tempFakeWalls.forEach(n => {
			jsonPrune(n);
			if (n instanceof Wall) {
				n = n.return();
			}
		});
		tempFakeChains.forEach(n => {
			jsonPrune(n);
			if (n instanceof Chain) {
				n = n.return();
			}
		});
		tempEvents.forEach(n => {
			jsonPrune(n);
			if (n instanceof LightEvent) {
				n = n.return();
			}
		});

		this.rawMap.basicBeatmapEvents = tempEvents as LightEventType[];
		this.rawMap.basicEventTypesWithKeywords = this.basicEventTypesWithKeywords;
		this.rawMap.bombNotes = tempBombs as BombType[];
		this.rawMap.bpmEvents = this.bpmEvents;
		this.rawMap.burstSliders = tempChains as BurstSliderType[];
		this.rawMap.colorBoostBeatmapEvents = this.colorBoostBeatmapEvents;
		this.rawMap.colorNotes = tempNotes as NoteType[];
		if (!this.rawMap.customData) {
			this.rawMap.customData = {};
		}
		this.rawMap.customData.customEvents = this.customEvents;
		this.rawMap.customData.environment = this.environments;
		this.rawMap.customData.fakeBombNotes = tempFakeBombs as BombType[];
		this.rawMap.customData.fakeBurstSliders = tempFakeChains as BurstSliderType[];
		this.rawMap.customData.fakeColorNotes = tempFakeNotes as NoteType[];
		this.rawMap.customData.fakeObstacles = tempFakeWalls as ObstacleType[];
		this.rawMap.customData.materials = this.materials;
		jsonPrune(this.rawMap.customData);
		this.rawMap.lightColorEventBoxGroups = this.lightColorEventBoxGroups;
		this.rawMap.lightRotationEventBoxGroups = this.lightRotationEventBoxGroups;
		this.rawMap.lightTranslationEventBoxGroups = this.lightTranslationEventBoxGroups;
		this.rawMap.obstacles = tempWalls as ObstacleType[];
		this.rawMap.rotationEvents = this.rotationEvents;
		this.rawMap.sliders = tempArcs as SliderType[];
		this.rawMap.useNormalEventsAsCompatibleEvents = this.useNormalEventsAsCompatibleEvents;

		Deno.writeTextFileSync(this.outputDiff + ".dat", JSON.stringify(this.rawMap));
		this.info.save();
	}
}

class Info {
	public raw: infoJSON;
	constructor() {
		this.raw = JSON.parse(Deno.readTextFileSync("info.dat"));
	}
	save() {
		if (this.raw._customData) {
			jsonPrune(this.raw._customData);
		}
		this.raw._difficultyBeatmapSets.forEach(bs => {
			bs._difficultyBeatmaps.forEach(d => {
				if (d._customData) {
					jsonPrune(d._customData);
				}
			});
		});
		Deno.writeTextFileSync("info.dat", JSON.stringify(this.raw));
	}
}

// Functions stolen from ReMapper >:)

export function copy<T>(obj: T): T {
	if (obj === null || typeof obj !== "object") {
		return obj;
	}

	const newObj = Array.isArray(obj) ? [] : {};
	const keys = Object.getOwnPropertyNames(obj);

	keys.forEach(x => {
		const value = copy((obj as any)[x]);
		(newObj as any)[x] = value;
	});

	Object.setPrototypeOf(newObj, obj as any);
	return newObj as T;
}

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
	constructor() {}
	environment(id: string, lookup: LookupMethod) {
		this.id = id;
		this.lookupMethod = lookup;
		if (this.geometry) {
			delete this.geometry;
		}
		return this;
	}
	geo(type: GeometryObjectTypes, mat: GeometryMaterialJSON | string) {
		this.geometry = {
			type: type,
			material: mat
		};
		if (this.id) {
			delete this.id;
		}
		if (this.lookupMethod) {
			delete this.lookupMethod;
		}
		return this;
	}
	public id?: string;
	lookupMethod?: LookupMethod;
	active?: boolean;
	duplicate?: number;
	scale?: Vec3;
	position?: Vec3;
	localPosition?: Vec3;
	rotation?: Vec3;
	localRotation?: Vec3;
	track?: string | string[];
	geometry?: GeometryObjectJSON;
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
		currentDiff.environments?.push(this.return());
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
			currentDiff.fakeObstacles?.push(this);
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
	 * Return the raw Json of the event.
	 */
	return(): LightEventType {
		jsonPrune(this);
		return {
			b: this.time,
			et: LightEventTypesMap.get(this.type),
			i: LightEventValuesMap.get(this.value),
			f: this.floatValue,
			customData: this.customData
		};
	}
	JSONToClass(x: LightEventType) {
		this.time = x.b;
		this.type = LightEventTypesMap.revGet(x.et);
		this.value = LightEventValuesMap.revGet(x.i);
		if (x.customData) {
			this.customData = x.customData;
		}
		return this;
	}
	/**
	 * Push the event to the current diff.
	 */
	push() {
		jsonPrune(this);
		currentDiff.events.push(this);
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
