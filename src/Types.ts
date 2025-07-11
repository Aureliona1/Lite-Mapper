// deno-lint-ignore-file no-explicit-any
import type { Easing, Vec2, Vec3, Vec4 } from "@aurellis/helpers";
import type { LM_CONST } from "./Consts.ts";
import type { AnimateComponent, AnimateTrack, AssignPathAnimation, AssignPlayerToTrack, AssignTrackParent } from "./CustomEvents.ts";
import type { Environment } from "./Environment.ts";
import type { LightEvent } from "./Lights.ts";
import type { Arc, Bomb, Bookmark, Chain, Note, Wall } from "./Objects.ts";

// BeatMap types

export type DiffName = `${BeatMapDifficultyName}${BeatMapCharacteristicName}`;
export type BeatMapCharacteristicName = "Standard" | "Lightshow" | "Lawless" | "360Degree" | "90Degree" | "NoArrows" | "OneSaber";
export type BeatMapDifficultyName = "Easy" | "Normal" | "Hard" | "Expert" | "ExpertPlus";

/**
 * JSON RGBA objeect with named keys.
 */
export type RGBAObject = { r: number; b: number; g: number; a: number };

/**
 * The color scheme layout for V2 info files.
 */
export type V2InfoColorScheme = {
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

/**
 * The layout for beatmaps in V2 info files.
 */
export type V2InfoBeatmap = {
	_difficulty: BeatMapDifficultyName;
	_difficultyRank: number;
	_beatmapFilename: DatFilename;
	_noteJumpMovementSpeed: number;
	_noteJumpStartBeatOffset: number;
	_beatmapColorSchemeIdx?: number;
	_environmentNameIdx?: number;
	_customData?: Record<string, any>;
};

/**
 * JSON for beatmap sets in V2 info files.
 */
export type V2InfoBeatmapSet = {
	_beatmapCharacteristicName: BeatMapCharacteristicName;
	_difficultyBeatmaps: V2InfoBeatmap[];
};

/**
 * JSON layout for V2 info files.
 */
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
	_colorSchemes?: V2InfoColorScheme[];
	_customData?: Record<string, any>;
	_difficultyBeatmapSets: V2InfoBeatmapSet[];
};

/**
 * The song info object in V4 info files.
 */
export type V4SongInfo = {
	title: string;
	subTitle: string;
	author: string;
};

/**
 * The audio info object in V4 info files.
 */
export type V4AudioInfo = {
	songFilename: string;
	songDuration?: number;
	audioDataFilename: DatFilename;
	bpm: number;
	lufs: number;
	previewStartTime: number;
	previewDuration: number;
};

/**
 * The color scheme layout for V4 info files.
 */
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

/**
 * The beatmap layout for V4 info files.
 */
export type V4InfoBeatmap = {
	characteristic: BeatMapCharacteristicName;
	difficulty: BeatMapDifficultyName;
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

/**
 * The JSON layout of a V4 info file.
 */
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

/**
 * The JSON layout for V4 audio data files.
 */
export type V2AudioDataJSON = {
	_version: "2.0.0";
	_songSampleCount: number;
	_songFrequency: number;
	_regions: { _startSampleIndex: number; _endSampleIndex: number; _startBeat: number; _endBeat: number }[];
};

/**
 * This is currently unused by LM, but there are plans to implement this in the future.
 */
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

/**
 * A version string for valid V3 beatmap versions in Beat Saber.
 */
export type V3ValidVersion = "3.0.0" | "3.1.0" | "3.2.0" | "3.3.0";
/**
 * The JSON format for a BPM event.
 */
export type BpmEventJSON = { b: number; m: number };
/**
 * The JSON format for a rotation event.
 */
export type RotationEventJSON = { b: number; e: number; r: number };
/**
 * The JSON format for a waypoint event.
 */
export type WaypointJSON = { b: number; x: number; y: number; d: number };
/**
 * The JSON format for a color boost event.
 */
export type ColorBoostEventJSON = { b: number; o: boolean };
/**
 * JSON Objects used in V3 light events to filter lights.
 */
export type BeatmapFilterObject = { c: number; f: number; p: number; t: number; r: number; n: number; s: number; l: number; d: number };
/**
 * The base format for all box group events.
 */
export type BoxGroupBaseEventJSON = {
	f: BeatmapFilterObject;
	w: number;
	d: number;
	t: number;
	b: number;
	i: number;
};
/**
 * The JSON format for color event box groups.
 */
export type ColorEventBoxGroupJSON = {
	b: number;
	g: number;
	e: (BoxGroupBaseEventJSON & {
		r: number;
		e: {
			b: number;
			i: number;
			c: number;
			s: number;
			f: number;
		}[];
	})[];
};
/**
 * The JSON format for rotation event box groups.
 */
export type RotationEventBoxGroupJSON = {
	b: number;
	g: number;
	e: (BoxGroupBaseEventJSON & {
		s: number;
		a: number;
		r: number;
		l: {
			b: number;
			p: number;
			e: number;
			l: number;
			r: number;
			o: number;
		}[];
	})[];
};
/**
 * The JSON format for translation event box groups.
 */
export type TranslationEventBoxGroupJSON = {
	b: number;
	g: number;
	e: (BoxGroupBaseEventJSON & {
		s: number;
		a: number;
		r: number;
		l: {
			b: number;
			p: number;
			e: number;
			t: number;
		}[];
	})[];
};
/**
 * The JSON format for vfx event box groups.
 */
export type VfxEventBoxGroupJSON = {
	b: number;
	g: number;
	e: (BoxGroupBaseEventJSON & {
		s: number;
		l: number[];
	})[];
};
/**
 * JSON Fx event for V3 beatmaps.
 */
export type BeatmapfxEvent = { b: number; p: number; i: number; v: number };

/**
 * The JSON layout of a V3 map.
 */
export type V3MapJSON = {
	version: V3ValidVersion;
	bpmEvents: BpmEventJSON[];
	rotationEvents: RotationEventJSON[];
	colorNotes: NoteJSON[];
	bombNotes: BombJSON[];
	obstacles: ObstacleJSON[];
	sliders: SliderJSON[];
	burstSliders: BurstSliderJSON[];
	waypoints: WaypointJSON[];
	basicBeatmapEvents: LightEventJSON[];
	colorBoostBeatmapEvents: ColorBoostEventJSON[];
	lightColorEventBoxGroups: ColorEventBoxGroupJSON[];
	lightRotationEventBoxGroups: RotationEventBoxGroupJSON[];
	lightTranslationEventBoxGroups: TranslationEventBoxGroupJSON[];
	basicEventTypesWithKeywords: Record<string, unknown>;
	useNormalEventsAsCompatibleEvents: boolean;
	vfxEventBoxGroups: VfxEventBoxGroupJSON[];
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

export type CustomEvent = AnimateComponent | AnimateTrack | AssignPathAnimation | AssignPlayerToTrack | AssignTrackParent;

export type CustomData = {
	customEvents?: CustomEvent[];
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

/**
 * The layout of a V3 beatmap with all objects in class form.
 */
export type ClassMap = {
	version: V3ValidVersion;
	bpmEvents: BpmEventJSON[];
	rotationEvents: RotationEventJSON[];
	colorNotes: Note[];
	bombNotes: Bomb[];
	obstacles: Wall[];
	sliders: Arc[];
	burstSliders: Chain[];
	waypoints: WaypointJSON[];
	basicBeatmapEvents: LightEvent[];
	colorBoostBeatmapEvents: ColorBoostEventJSON[];
	lightColorEventBoxGroups: ColorEventBoxGroupJSON[];
	lightRotationEventBoxGroups: RotationEventBoxGroupJSON[];
	lightTranslationEventBoxGroups: TranslationEventBoxGroupJSON[];
	basicEventTypesWithKeywords: Record<string, unknown>;
	useNormalEventsAsCompatibleEvents: boolean;
	vfxEventBoxGroups: VfxEventBoxGroupJSON[];
	_fxEventsCollection: {
		_fl: BeatmapfxEvent[];
		_il: BeatmapfxEvent[];
	};
	customData?: CustomData;
};

/**
 * A collection of all the valid environment names.
 */
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

/**
 * The collection of valid setings that Heck can override.
 */
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

export type KFVec3 = [number, number, number, number, (Easing | "splineCatmullRom")?, "splineCatmullRom"?];
export type KFScalar = [number, number, Easing?];
export type KFVec4 = [number, number, number, number, number, (Easing | "splineCatmullRom")?, "splineCatmullRom"?];

export type KFVec3Modifier = [ModifierBaseTarget] | [ModifierBaseTarget, [number, number, number, ModifierOp]];
export type KFVec4Modifier = [ModifierBaseTarget] | [ModifierBaseTarget, [number, number, number, number, ModifierOp]];
export type KFScalarModifier = [ModifierBaseTarget] | [ModifierBaseTarget, [number, ModifierOp]];

export type ModifierOp = "opNone" | "opAdd" | "opSub" | "opMul" | "opDiv";
type VectorBase = "Position" | "LocalPosition" | "Rotation" | "LocalRotation" | "LocalScale";
type BaseEnvColors = "0" | "1" | "W" | "0Boost" | "1Boost" | "WBoost";
type ModifierBaseName =
	| `baseHead${VectorBase}`
	| `baseLeftHand${VectorBase}`
	| `baseRightHand${VectorBase}`
	| "baseNote0Color"
	| "baseNote1Color"
	| "baseObstaclesColor"
	| "baseSaberAColor"
	| "baseSaberBColor"
	| `baseEnvironment${BaseEnvColors}`
	| "baseCombo"
	| "baseMultipliedScore"
	| "baseImmediateMaxPossibleMultipliedScore"
	| "baseModifiedScore"
	| "baseImmediateMaxPossibleModifiedScore"
	| "baseRelativeScore"
	| "baseMultiplier"
	| "baseEnergy"
	| "baseSongTime"
	| "baseSongLength";

export type ModifierBaseTarget = "";

/**
 * A custom keyframe type for light keyframes that includes HSV and RGB interpolation.
 */
export type KFColorVec4 = [number, number, number, number, number, Easing?, ("HSV" | "RGB")?];

/**
 * An animatable property that uses a scalar value.
 */
export type AnimationSingle = [number] | KFScalar[] | KFScalarModifier;

/**
 * An animatable property that uses 3 values to represent a vector.
 */
export type AnimationVec3 = Vec3 | KFVec3[] | KFVec3Modifier;

/**
 * An animatable property that uses 4 values to represent a vector.
 */
export type AnimationVec4 = Vec4 | KFVec4[] | KFVec4Modifier;

// Object Properties

/**
 * A collection of all the valid properties that can be animated on gameplay objects.
 */
export type ObjectAnimProps = {
	offsetPosition?: AnimationVec3;
	offsetWorldRotation?: AnimationVec3;
	localRotation?: AnimationVec3;
	scale?: AnimationVec3;
	dissolve?: AnimationSingle;
	dissolveArrow?: AnimationSingle;
	interactable?: AnimationSingle;
	definitePosition?: AnimationVec3;
	color?: AnimationVec4;
};

/**
 * A collection of the properties that can be applied in the components section of an environment.
 * These properties are all static.
 */
export type ComponentStaticProps = {
	lightIds?: { id?: number; type?: LightTypeName };
	fog?: { attenuation?: number; offset?: number; startY?: number; height?: number };
	lightBloom?: { colorMult?: number; bloomMult?: number };
};

/**
 * JSON representation of static component properties.
 */
export type ComponentStaticJSONProps = {
	ILightWithId?: { lightID?: number; type?: number };
	BloomFogEnvironment?: { attenuation?: number; offset?: number; startY?: number; height?: number };
	TubeBloomPrePassLight?: { colorAlphaMultiplier?: number; bloomFogIntensityMultiplier?: number };
};

/**
 * A collection of the custom properties that can be added onto note objects.
 */
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
/**
 * A collection of the custom properties that can be added to slider objects.
 */
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

/**
 * A collection of the custom properties that can be added to walls.
 */
export type WallCustomProps = { size?: Vec3; animation?: ObjectAnimProps; coordinates?: Vec2; worldRotation?: Vec3; localRotation?: Vec3; noteJumpMovementSpeed?: number; noteJumpStartBeatOffset?: number; uninteractable?: boolean; color?: Vec3 | Vec4; track?: string | string[] };

/**
 * The L or R colors of gameplay objects.
 */
export type ObjectColorName = keyof typeof LM_CONST.ObjectColorsMap.map;
export type ObjectColorNumber = keyof typeof LM_CONST.ObjectColorsMap.reverseMap;
/**
 * Valid cut directions of gameplay objects.
 */
export type ObjectDirectionName = keyof typeof LM_CONST.ObjectDirectionsMap.map;
export type ObjectDirectionNumber = keyof typeof LM_CONST.ObjectDirectionsMap.reverseMap;

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

/**
 * A valid light type name, this specifies which light/s to target with a light event.
 */
export type LightTypeName = keyof typeof LM_CONST.LightEventTypesMap.map;
/**
 * A valid light value name, this specifies what the light event actually does to the light/s.
 */
export type LightValueName = keyof typeof LM_CONST.LightEventValuesMap.map;
export type LightTypeNumber = keyof typeof LM_CONST.LightEventTypesMap.reverseMap;
export type LightValueNumber = keyof typeof LM_CONST.LightEventValuesMap.reverseMap;

// CE props

export type CustomEventName = "AnimateTrack" | "AssignPathAnimation" | "AssignTrackParent" | "AssignPlayerToTrack" | "AnimateComponent";

/**
 * The JSON format of a generic custom event.
 */
export type CustomEventJSON = { b: number; t: CustomEventName; d: TrackAnimAnimationProps | PathAnimAnimationProps | TrackParentProps | PlayerToTrackProps | ComponentAnimProps };

/**
 * A collection of the properties that can be added to a path animation.
 */
export type PathAnimDataProps = PathAnimAnimationProps & { track?: string | string[]; duration?: number; easing?: Easing };
/**
 * A collection of the animatable properties that can be added to a path animation.
 */
export type PathAnimAnimationProps = {
	offsetPosition?: AnimationVec3;
	offsetWorldRotation?: AnimationVec3;
	localRotation?: AnimationVec3;
	scale?: AnimationVec3;
	dissolve?: AnimationSingle;
	dissolveArrow?: AnimationSingle;
	interactable?: AnimationSingle;
	definitePosition?: AnimationVec3;
	color?: AnimationVec4;
};

/**
 * A collection of the properties that can be added to a track animation.
 */
export type TrackAnimDataProps = TrackAnimAnimationProps & {
	track?: string | string[];
	duration?: number;
	easing?: Easing;
	repeat?: number;
};
/**
 * A collection of all the animatable properties that can be added to a track animation.
 */
export type TrackAnimAnimationProps = {
	offsetPosition?: Vec3 | KFVec3[] | KFVec3Modifier | string;
	offsetWorldRotation?: Vec3 | KFVec3[] | KFVec3Modifier | string;
	localRotation?: Vec3 | KFVec3[] | KFVec3Modifier | string;
	scale?: Vec3 | KFVec3[] | KFVec3Modifier | string;
	dissolve?: [number] | KFScalar[] | KFScalarModifier | string;
	dissolveArrow?: [number] | KFScalar[] | KFScalarModifier | string;
	interactable?: [number] | KFScalar[] | KFScalarModifier | string;
	time?: KFScalar[] | string;
	color?: Vec4 | KFVec4[] | KFVec4Modifier | string;
	position?: Vec3 | KFVec3[] | KFVec3Modifier | string;
	rotation?: Vec3 | KFVec3[] | KFVec3Modifier | string;
	localPosition?: Vec3 | KFVec3[] | KFVec3Modifier | string;
};

/**
 * A collection of the properties that can be added to a track parent assignment.
 */
export type TrackParentProps = { childrenTracks: string[]; parentTrack: string; worldPositionStays?: boolean };

/**
 * A valid target on the player object that can be assigned to a track.
 */
export type PlayerObjectTarget = "Root" | "Head" | "LeftHand" | "RightHand";
/**
 * A collection of the properties that can be added to a player track assignment.
 */
export type PlayerToTrackProps = { track?: string; target?: PlayerObjectTarget };

/**
 * A collection of the properties that can be animated on fog.
 */
export type FogAnimationProps = {
	attenuation?: [number] | KFScalar[];
	offset?: [number] | KFScalar[];
	startY?: [number] | KFScalar[];
	height?: [number] | KFScalar[];
};

/**
 * A collection of the properties that can be animated for tube lights and bloom.
 */
export type TubeLightAnimationProps = {
	colorAlphaMultiplier?: [number] | KFScalar[];
	bloomFogIntensityMultiplier?: [number] | KFScalar[];
};

/**
 * A collection of the properties that can be added to a component animation.
 */
export type ComponentAnimProps = {
	track?: string;
	duration?: number;
	easing?: Easing;
	BloomFogEnvironment?: FogAnimationProps;
	TubeBloomPrePassLight?: TubeLightAnimationProps;
};

// Environment and Geometry

/**
 * A valid lookup method that chroma will use to search for your environment id.
 */
export type LookupMethod = "Contains" | "Regex" | "Exact" | "StartsWith" | "EndsWith";
/**
 * A valid geometry primitive object.
 */
export type GeometryObjectPrimitive = "Sphere" | "Capsule" | "Cylinder" | "Cube" | "Plane" | "Quad" | "Triangle";
/**
 * The name of one of chroma's registered material shaders.
 */
export type MaterialShaderName = "Standard" | "OpaqueLight" | "TransparentLight" | "BaseWater" | "BillieWater" | "BTSPillar" | "InterscopeConcrete" | "InterscopeCar" | "Obstacle" | "WaterfallMirror";
/**
 * The JSON format of a geometry material.
 */
export type GeometryMaterialJSON = { shader: MaterialShaderName; color?: Vec3 | Vec4; track?: string; shaderKeywords?: string[] };
/**
 * The JSON format of a geometry object.
 */
export type GeometryObjectJSON = { type: GeometryObjectPrimitive; material: GeometryMaterialJSON | string };

export type KeywordBaseWater =
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
	| "_ZWRITE_ON";

export type KeywordBillieWater =
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
	| "_ZWRITE_ON";

export type KeywordBTSPillar = "DIFFUSE" | "ENABLE_DIFFUSE" | "ENABLE_FOG" | "ENABLE_HEIGHT_FOG" | "ENABLE_SPECULAR" | "FOG" | "HEIGHT_FOG" | "REFLECTION_PROBE_BOX_PROJECTION" | "SPECULAR" | "_EMISSION" | "_ENABLE_FOG_TINT" | "_RIMLIGHT_NONE";

export type KeywordInterscopeCar =
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
	| "_WHITEBOOSTTYPE_NONE";

export type KeywordInterscopeConcrete =
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
	| "_RIMLIGHT_NONE";

export type KeywordStandard = "DIFFUSE" | "ENABLE_DIFFUSE" | "ENABLE_FOG" | "ENABLE_HEIGHT_FOG" | "ENABLE_SPECULAR" | "FOG" | "HEIGHT_FOG" | "REFLECTION_PROBE_BOX_PROJECTION" | "SPECULAR" | "_EMISSION" | "_ENABLE_FOG_TINT" | "_RIMLIGHT_NONE";

export type KeywordWaterfallMirror = "DETAIL_NORMAL_MAP" | "ENABLE_MIRROR" | "ETC1_EXTERNAL_ALPHA" | "LIGHTMAP" | "REFLECTION_PROBE_BOX_PROJECTION" | "_EMISSION";

// Helper types

export type DatFilename = `${string}.dat`;

export type Optional<T> = T | undefined;
