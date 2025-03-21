// deno-lint-ignore-file no-explicit-any
import { LM_CONST } from "./Consts.ts";
import { AnimateComponent, AnimateTrack, AssignPathAnimation, AssignPlayerToTrack, AssignTrackParent } from "./CustomEvents.ts";
import { Environment } from "./Environment.ts";
import { LightEvent } from "./Lights.ts";
import { Arc, Bomb, Bookmark, Chain, Note, Wall } from "./Objects.ts";

// BeatMap types

export type DiffNames = `${BeatMapDifficultyNames}${BeatMapCharacteristicNames}`;
export type BeatMapCharacteristicNames = "Standard" | "Lightshow" | "Lawless" | "360Degree" | "90Degree" | "NoArrows" | "OneSaber";
export type BeatMapDifficultyNames = "Easy" | "Normal" | "Hard" | "Expert" | "ExpertPlus";

export type BeatmapFilterObject = { c: number; f: number; p: number; t: number; r: number; n: number; s: number; l: number; d: number };
export type RGBAObject = { r: number; b: number; g: number; a: number };
export type BeatmapfxEvent = { b: number; p: number; i: number; v: number };

export type V2ColorScheme = {
	useOverride: boolean;
	colorScheme: {
		colorSchemeId: string;
		saberAColor: RGBAObject;
		saberBColor: RGBAObject;
		obstaclesColor: RGBAObject;
		environmentColor0: RGBAObject;
		environmentColor1: RGBAObject;
		environmentColor0Boost: RGBAObject;
		environmentColor1Boost: RGBAObject;
	};
};

export type V2InfoBeatmap = {
	_difficulty: BeatMapDifficultyNames;
	_difficultyRank: number;
	_beatmapFilename: DatFilename;
	_noteJumpMovementSpeed: number;
	_noteJumpStartBeatOffset: number;
	_beatmapColorSchemeIdx?: number;
	_environmentNameIdx?: number;
	_customData?: Record<string, any>;
};

export type V2InfoBeatmapSet = {
	_beatmapCharacteristicName: BeatMapCharacteristicNames;
	_difficultyBeatmaps: V2InfoBeatmap[];
};

export type V2InfoJSON = {
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
	_environmentName: EnvironmentName;
	_allDirectionsEnvironmentName: string;
	_songTimeOffset: number;
	_environmentNames?: EnvironmentName[];
	_colorSchemes?: V2ColorScheme[];
	_customData?: Record<string, any>;
	_difficultyBeatmapSets: V2InfoBeatmapSet[];
};

export type V4SongInfo = {
	title: string;
	subTitle: string;
	author: string;
};

export type V4AudioInfo = {
	songFilename: string;
	songDuration?: number;
	audioDataFilename: DatFilename;
	bpm: number;
	lufs: number;
	previewStartTime: number;
	previewDuration: number;
};

export type V4InfoColorScheme = {
	useOverride: boolean;
	colorSchemeName: string;
	saberAColor: string;
	saberBColor: string;
	obstaclesColor: string;
	environmentColor0: string;
	environmentColor1: string;
	environmentColor0Boost: string;
	environmentColor1Boost: string;
};

export type V4InfoBeatmap = {
	characteristic: BeatMapCharacteristicNames;
	difficulty: BeatMapDifficultyNames;
	beatmapAuthors: {
		mappers: string[];
		lighters: string[];
	};
	environmentNameIdx: number;
	beatmapColorSchemeIdx?: number;
	noteJumpMovementSpeed: number;
	noteJumpStartBeatOffset: number;
	beatmapDataFilename: DatFilename;
	lightshowDataFilename: DatFilename;
	customData?: Record<string, any>;
};

export type V4InfoJSON = {
	version: "4.0.0";
	song: V4SongInfo;
	audio: V4AudioInfo;
	songPreviewFilename: string;
	coverImageFilename: string;
	environmentNames: EnvironmentName[];
	colorSchemes: V4InfoColorScheme[];
	difficultyBeatmaps: V4InfoBeatmap[];
	customData?: Record<string, any>;
};

export type V2AudioDataJSON = {
	_version: "2.0.0";
	_songSampleCount: number;
	_songFrequency: number;
	_regions: { _startSampleIndex: number; _endSampleIndex: number; _startBeat: number; _endBeat: number }[];
};

export type V2MapJSON = {
	_version: string;
	_notes: {
		_time: number;
		_lineIndex: number;
		_lineLayer: number;
		_type: number;
		_cutDirection: number;
		_customData?: Record<string, unknown>;
	}[];
	_sliders: {
		_colorType: number;
		_headTime: number;
		_headLineIndex: number;
		_headLineLayer: number;
		_headControlPointLengthMultiplier: number;
		_headCutDirection: number;
		_tailTime: number;
		_tailLineIndex: number;
		_tailLineLayer: number;
		_tailControlPointLengthMultiplier: number;
		_tailCutDirection: number;
		_sliderMidAnchorMode: number;
		_customData?: Record<string, unknown>;
	}[];
	_obstacles: {
		_time: number;
		_lineIndex: number;
		_type: number;
		_duration: number;
		_width: number;
		_customData?: Record<string, unknown>;
	}[];
	_events: {
		_time: number;
		_type: number;
		_value: number;
		_floatValue: number;
		_customData?: Record<string, unknown>;
	}[];
	_waypoints: unknown[];
	_customData?: Record<string, any>;
};

export type V3MapJSON = {
	version: string;
	bpmEvents: { b: number; m: number }[];
	rotationEvents: { b: number; e: number; r: number }[];
	colorNotes: NoteJSON[];
	bombNotes: BombJSON[];
	obstacles: ObstacleJSON[];
	sliders: SliderJSON[];
	burstSliders: BurstSliderJSON[];
	waypoints: { b: number; x: number; y: number; d: number }[];
	basicBeatmapEvents: LightEventJSON[];
	colorBoostBeatmapEvents: { b: number; o: boolean }[];
	lightColorEventBoxGroups: { b: number; g: number; e: { f: BeatmapFilterObject; w: number; d: number; r: number; t: number; b: number; i: number; e: { b: number; i: number; c: number; s: number; f: number }[] }[] }[];
	lightRotationEventBoxGroups: { b: number; g: number; e: { f: BeatmapFilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; l: number; r: number; o: number }[] }[] }[];
	lightTranslationEventBoxGroups: { b: number; g: number; e: { f: BeatmapFilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; t: number }[] }[] }[];
	basicEventTypesWithKeywords: Record<string, unknown>;
	useNormalEventsAsCompatibleEvents: boolean;
	vfxEventBoxGroups: {
		b: number;
		g: number;
		e: {
			f: BeatmapFilterObject;
			w: number;
			d: number;
			s: number;
			t: number;
			b: number;
			i: number;
			l: number[];
		}[];
	}[];
	_fxEventsCollection: {
		_fl: BeatmapfxEvent[];
		_il: BeatmapfxEvent[];
	};
	customData?: {
		customEvents?: CustomEventJSON[];
		environment?: EnvironmentJSON[];
		materials?: Record<string, GeometryMaterialJSON>;
		fakeColorNotes?: NoteJSON[];
		fakeBombNotes?: BombJSON[];
		fakeObstacles?: ObstacleJSON[];
		fakeBurstSliders?: BurstSliderJSON[];
		bookmarks?: BookmarkJSON[];
		bookmarksUseOfficialBpmEvents?: boolean;
		time?: number;
	};
};

export type ClassMap = {
	version: string;
	bpmEvents: { b: number; m: number }[];
	rotationEvents: { b: number; e: number; r: number }[];
	colorNotes: Note[];
	bombNotes: Bomb[];
	obstacles: Wall[];
	sliders: Arc[];
	burstSliders: Chain[];
	waypoints: unknown[];
	basicBeatmapEvents: LightEvent[];
	colorBoostBeatmapEvents: { b: number; o: boolean }[];
	lightColorEventBoxGroups: { b: number; g: number; e: { f: BeatmapFilterObject; w: number; d: number; r: number; t: number; b: number; i: number; e: { b: number; i: number; c: number; s: number; f: number }[] }[] }[];
	lightRotationEventBoxGroups: { b: number; g: number; e: { f: BeatmapFilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; l: number; r: number; o: number }[] }[] }[];
	lightTranslationEventBoxGroups: { b: number; g: number; e: { f: BeatmapFilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; t: number }[] }[] }[];
	basicEventTypesWithKeywords: Record<string, unknown>;
	useNormalEventsAsCompatibleEvents: boolean;
	vfxEventBoxGroups: {
		b: number;
		g: number;
		e: {
			f: BeatmapFilterObject;
			w: number;
			d: number;
			s: number;
			t: number;
			b: number;
			i: number;
			l: number[];
		}[];
	}[];
	_fxEventsCollection: {
		_fl: BeatmapfxEvent[];
		_il: BeatmapfxEvent[];
	};
	customData?: {
		customEvents?: Array<AnimateComponent | AnimateTrack | AssignPathAnimation | AssignPlayerToTrack | AssignTrackParent>;
		environment?: Environment[];
		materials?: Record<string, GeometryMaterialJSON>;
		fakeColorNotes?: Note[];
		fakeBombNotes?: Bomb[];
		fakeObstacles?: Wall[];
		fakeBurstSliders?: Chain[];
		bookmarks?: Bookmark[];
		bookmarksUseOfficialBpmEvents?: boolean;
		time?: number;
	};
};

export type EnvironmentName =
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

export type HeckSettings = {
	_playerOptions?: {
		_leftHanded?: boolean;
		_playerHeight?: number;
		_automaticPlayerHeight?: boolean;
		_sfxVolume?: number;
		_reduceDebris?: boolean;
		_noTextsAndHuds?: boolean;
		_noFailEffects?: boolean;
		_advancedHud?: boolean;
		_autoRestart?: boolean;
		_saberTrailIntensity?: number;
		_noteJumpDurationTypeSettings?: "Dynamic" | "Static";
		_noteJumpFixedDuration?: number;
		_noteJumpStartBeatOffset?: number;
		_hideNoteSpawnEffect?: boolean;
		_adaptiveSfx?: boolean;
		_environmentEffectsFilterDefaultPreset?: "AllEffects" | "Strobefilter" | "NoEffects";
		_environmentEffectsFilterExpertPlusPreset?: "AllEffects" | "Strobefilter" | "NoEffects";
	};
	_modifiers?: {
		_energyType?: "Bar" | "Battery";
		_noFailOn0Energy?: boolean;
		_instaFail?: boolean;
		_failOnSaberClash?: boolean;
		_enabledObstacleType?: "All" | "FullHeightOnly" | "NoObstacles";
		_fastNotes?: boolean;
		_strictAngles?: boolean;
		_disappearingArrows?: boolean;
		_ghostNotes?: boolean;
		_noBombs?: boolean;
		_songSpeed?: "Normal" | "Faster" | "Slower" | "SuperFast";
		_noArrows?: boolean;
		_proMode?: boolean;
		_zenMode?: boolean;
		_smallCubes?: boolean;
	};
	_environments?: {
		_overrideEnvironments?: boolean;
	};
	_colors?: {
		_overrideDefaultColors?: boolean;
	};
	_graphics?: {
		_mirrorGraphicsSettings?: 0 | 1 | 2 | 3;
		_mainEffectGraphicsSettings?: 0 | 1;
		_smokeGraphicsSettings?: 0 | 1;
		_burnMarkTrailsEnabled?: boolean;
		_screenDisplacementEffectsEnabled?: boolean;
		_maxShockwaveParticles?: 0 | 1 | 2;
	};
	_chroma?: {
		_disableChromaEvents?: boolean;
		_disableEnvironmentEnhancements?: boolean;
		_disableNoteColoring?: boolean;
		_forceZenModeWalls?: boolean;
	};
};

// Animation types

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];

type EaseBase<T extends string> = `easeIn${T}` | `easeOut${T}` | `easeInOut${T}`;
export type Easing = EaseBase<"Sine"> | EaseBase<"Quad"> | EaseBase<"Cubic"> | EaseBase<"Quart"> | EaseBase<"Quint"> | EaseBase<"Circ"> | EaseBase<"Expo"> | EaseBase<"Back"> | EaseBase<"Bounce"> | EaseBase<"Elastic"> | "easeStep" | "easeLinear";

export type KFVec3 = [number, number, number, number, Easing?, "splineCatmullRom"?];
export type KFScalar = [number, number, Easing?];
export type KFVec4 = [number, number, number, number, number, Easing?, "splineCatmullRom"?];

export type KFVec3Modifier = [ModifierTarget] | [ModifierTarget, [number, number, number, ModifierOpKeyword]];
export type KFVec4Modifier = [ModifierTarget] | [ModifierTarget, [number, number, number, number, ModifierOpKeyword]];
export type KFScalarModifier = [ModifierTarget] | [ModifierTarget, [number, ModifierOpKeyword]];

export type ModifierOpKeyword = "opNone" | "opAdd" | "opSub" | "opMul" | "opDiv";
export type ModifierTarget =
	| "baseHeadLocalPosition"
	| "baseLeftHandLocalPosition"
	| "baseRightHandLocalPosition"
	| "baseNote0Color"
	| "baseNote1color"
	| "baseSaberAColor"
	| "baseSaberBColor"
	| "baseEnvironmentColor0"
	| "baseEnvironmentColor1"
	| "baseEnvironmentColorW"
	| "baseEnvironmentColor0Boost"
	| "baseEnvironmentColor1Boost"
	| "baseEnvironmentColorWBoost"
	| "baseObstaclesColor";

export type KFColorVec4 = [number, number, number, number, number, Easing?, ("HSV" | "RGB")?];

// Object Properties

export type ObjectAnimProps = {
	offsetPosition?: Vec3 | KFVec3[] | KFVec3Modifier;
	offsetWorldRotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	localRotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	scale?: Vec3 | KFVec3[] | KFVec3Modifier;
	dissolve?: [number] | KFScalar[] | KFScalarModifier;
	dissolveArrow?: [number] | KFScalar[] | KFScalarModifier;
	interactable?: [number] | KFScalar[] | KFScalarModifier;
	definitePosition?: Vec3 | KFVec3[] | KFVec3Modifier;
	color?: Vec4 | KFVec4[] | KFVec4Modifier;
};

export type ComponentStaticProps = {
	lightIds?: { id?: number; type?: LightTypeNames };
	fog?: { attenuation?: number; offset?: number; startY?: number; height?: number };
	lightBloom?: { colorMult?: number; bloomMult?: number };
};

export type ComponentStaticJSONProps = {
	ILightWithId?: { lightID?: number; type?: number };
	BloomFogEnvironment?: { attenuation?: number; offset?: number; startY?: number; height?: number };
	TubeBloomPrePassLight?: { colorAlphaMultiplier?: number; bloomFogIntensityMultiplier?: number };
};

export type NoteCustomProps = {
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
export type SliderCustomProps = {
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

export type ObjectColorNames = keyof typeof LM_CONST.ObjectColorsMap.map;
export type ObjectColorNumbers = keyof typeof LM_CONST.ObjectColorsMap.reverseMap;
export type ObjectDirectionNames = keyof typeof LM_CONST.ObjectDirectionsMap.map;
export type ObjectDirectionNumbers = keyof typeof LM_CONST.ObjectDirectionsMap.reverseMap;

export type WallCustomProps = { size?: Vec3; animation?: ObjectAnimProps; coordinates?: Vec2; worldRotation?: Vec3; localRotation?: Vec3; noteJumpMovementSpeed?: number; noteJumpStartBeatOffset?: number; uninteractable?: boolean; color?: Vec3 | Vec4; track?: string | string[] };
export type NoteJSON = { b: number; x: number; y: number; c: number; d: number; a: number; customData?: NoteCustomProps };
export type BombJSON = { b: number; x: number; y: number; customData?: NoteCustomProps };
export type ObstacleJSON = { b: number; x: number; y: number; d: number; w: number; h: number; customData?: WallCustomProps };
export type EnvironmentJSON = {
	id?: string;
	lookupMethod?: LookupMethod;
	active?: boolean;
	duplicate?: number;
	components?: ComponentStaticJSONProps;
	scale?: Vec3;
	position?: Vec3;
	localPosition?: Vec3;
	rotation?: Vec3;
	localRotation?: Vec3;
	track?: string | string[];
	geometry?: GeometryObjectJSON;
};
export type BurstSliderJSON = { b: number; x: number; y: number; c: number; d: number; tb: number; tx: number; ty: number; sc: number; s: number; customData?: SliderCustomProps };
export type SliderJSON = { b: number; c: number; x: number; y: number; d: number; mu: number; tb: number; tx: number; ty: number; tc: number; tmu: number; m: number; customData?: SliderCustomProps };
export type LightEventCustomData = { lightID?: number | number[]; color?: Vec3 | Vec4; easing?: Easing; lerpType?: "HSV" | "RGB"; lockRotation?: boolean; speed?: number; direction?: number; nameFilter?: string; rotation?: number; step?: number; prop?: number };
export type LightEventJSON = { b: number; et: number; i: number; f: number; customData?: LightEventCustomData };
export type BookmarkJSON = { b: number; n: string; c: Vec4 };

export type LightTypeNames = keyof typeof LM_CONST.LightEventTypesMap.map;
export type LightValueNames = keyof typeof LM_CONST.LightEventValuesMap.map;
export type LightTypeNumbers = keyof typeof LM_CONST.LightEventTypesMap.reverseMap;
export type LightValueNumbers = keyof typeof LM_CONST.LightEventValuesMap.reverseMap;

// CE props

export type CustomEventJSON = { b: number; t: CustomEventNames; d: TrackAnimProps | PathAnimProps | TrackParentProps | PlayerToTrackProps | ComponentAnimProps };

export type PathAnimAllProps = {
	offsetPosition?: Vec3 | KFVec3[] | KFVec3Modifier;
	offsetWorldRotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	localRotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	scale?: Vec3 | KFVec3[] | KFVec3Modifier;
	dissolve?: [number] | KFScalar[] | KFScalarModifier;
	dissolveArrow?: [number] | KFScalar[] | KFScalarModifier;
	interactable?: [number] | KFScalar[] | KFScalarModifier;
	definitePosition?: Vec3 | KFVec3[] | KFVec3Modifier;
	color?: Vec4 | KFVec4[] | KFVec4Modifier;
	track?: string | string[];
	duration?: number;
	easing?: Easing;
};
export type PathAnimProps = {
	offsetPosition?: Vec3 | KFVec3[] | KFVec3Modifier;
	offsetWorldRotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	localRotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	scale?: Vec3 | KFVec3[] | KFVec3Modifier;
	dissolve?: [number] | KFScalar[] | KFScalarModifier;
	dissolveArrow?: [number] | KFScalar[] | KFScalarModifier;
	interactable?: [number] | KFScalar[] | KFScalarModifier;
	definitePosition?: Vec3 | KFVec3[] | KFVec3Modifier;
	color?: Vec4 | KFVec4[] | KFVec4Modifier;
};
export type TrackAnimAllProps = {
	offsetPosition?: Vec3 | KFVec3[] | KFVec3Modifier;
	offsetWorldRotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	localRotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	scale?: Vec3 | KFVec3[] | KFVec3Modifier;
	dissolve?: [number] | KFScalar[] | KFScalarModifier;
	dissolveArrow?: [number] | KFScalar[] | KFScalarModifier;
	interactable?: [number] | KFScalar[] | KFScalarModifier;
	time?: KFScalar[];
	color?: Vec4 | KFVec4[] | KFVec4Modifier;
	position?: Vec3 | KFVec3[] | KFVec3Modifier;
	rotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	localPosition?: Vec3 | KFVec3[] | KFVec3Modifier;
	track?: string | string[];
	duration?: number;
	easing?: Easing;
	repeat?: number;
};
export type TrackAnimProps = {
	offsetPosition?: Vec3 | KFVec3[] | KFVec3Modifier;
	offsetWorldRotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	localRotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	scale?: Vec3 | KFVec3[] | KFVec3Modifier;
	dissolve?: [number] | KFScalar[] | KFScalarModifier;
	dissolveArrow?: [number] | KFScalar[] | KFScalarModifier;
	interactable?: [number] | KFScalar[] | KFScalarModifier;
	time?: KFScalar[];
	color?: Vec4 | KFVec4[] | KFVec4Modifier;
	position?: Vec3 | KFVec3[] | KFVec3Modifier;
	rotation?: Vec3 | KFVec3[] | KFVec3Modifier;
	localPosition?: Vec3 | KFVec3[] | KFVec3Modifier;
};
export type TrackParentProps = { childrenTracks: string[]; parentTrack: string; worldPositionStays?: boolean };
export type PlayerObjectControllers = "Root" | "Head" | "LeftHand" | "RightHand";
export type PlayerToTrackProps = { track?: string; target?: PlayerObjectControllers };
export type ComponentAnimProps = {
	track?: string;
	duration?: number;
	easing?: Easing;
	BloomFogEnvironment?: { attenuation?: [number] | KFScalar[]; offset?: [number] | KFScalar[]; startY?: [number] | KFScalar[]; height?: [number] | KFScalar[] };
	TubeBloomPrePassLight?: { colorAlphaMultiplier?: [number] | KFScalar[]; bloomFogIntensityMultiplier?: [number] | KFScalar[] };
};

// Environment and Geometry

export type LookupMethod = "Contains" | "Regex" | "Exact" | "StartsWith" | "EndsWith";
export type GeometryObjectTypes = "Sphere" | "Capsule" | "Cylinder" | "Cube" | "Plane" | "Quad" | "Triangle";
export type MaterialShader = "Standard" | "OpaqueLight" | "TransparentLight" | "BaseWater" | "BillieWater" | "BTSPillar" | "InterscopeConcrete" | "InterscopeCar" | "Obstacle" | "WaterfallMirror";
export type GeometryMaterialJSON = { shader: MaterialShader; color?: Vec3 | Vec4; track?: string; shaderKeywords?: string[] };
export type GeometryObjectJSON = { type: GeometryObjectTypes; material: GeometryMaterialJSON | string };
export type CustomEventNames = "AnimateTrack" | "AssignPathAnimation" | "AssignTrackParent" | "AssignPlayerToTrack" | "AnimateComponent";

export type KeywordsBaseWater = (
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

export type KeywordsBillieWater = (
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

export type KeywordsBTSPillar = ("DIFFUSE" | "ENABLE_DIFFUSE" | "ENABLE_FOG" | "ENABLE_HEIGHT_FOG" | "ENABLE_SPECULAR" | "FOG" | "HEIGHT_FOG" | "REFLECTION_PROBE_BOX_PROJECTION" | "SPECULAR" | "_EMISSION" | "_ENABLE_FOG_TINT" | "_RIMLIGHT_NONE")[];

export type KeywordsInterscopeCar = (
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

export type KeywordsInterscopeConcrete = (
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

export type KeywordsStandard = ("DIFFUSE" | "ENABLE_DIFFUSE" | "ENABLE_FOG" | "ENABLE_HEIGHT_FOG" | "ENABLE_SPECULAR" | "FOG" | "HEIGHT_FOG" | "REFLECTION_PROBE_BOX_PROJECTION" | "SPECULAR" | "_EMISSION" | "_ENABLE_FOG_TINT" | "_RIMLIGHT_NONE")[];

export type KeywordsWaterfallMirror = ("DETAIL_NORMAL_MAP" | "ENABLE_MIRROR" | "ETC1_EXTERNAL_ALPHA" | "LIGHTMAP" | "REFLECTION_PROBE_BOX_PROJECTION" | "_EMISSION")[];

// Helper types

export type NumberArrLike = Uint16Array | Uint32Array | Uint8Array | Int16Array | Int32Array | Int8Array | Float16Array | Float32Array | Float64Array | Array<number>;

export type DatFilename = `${string}.dat`;
