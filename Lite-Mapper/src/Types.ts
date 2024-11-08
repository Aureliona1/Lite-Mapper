// deno-lint-ignore-file no-explicit-any
import { AnimateComponent, AnimateTrack, Arc, AssignPathAnimation, AssignPlayerToTrack, AssignTrackParent, Bomb, Chain, Environment, LightEvent, Note, Wall } from "./LiteMapper.ts";

// BeatMap types

export type DiffNames = `${BeatMapDifficultyNames}${BeatMapCharacteristicNames}`;
export type BeatMapCharacteristicNames = "Standard" | "Lightshow" | "Lawless" | "360Degree" | "90Degree" | "NoArrows" | "OneSaber";
export type BeatMapDifficultyNames = "Easy" | "Normal" | "Hard" | "Expert" | "ExpertPlus";

type FilterObject = { c: number; f: number; p: number; t: number; r: number; n: number; s: number; l: number; d: number };

export type infoJSON = {
	_version: "2.1.0" | "2.0.0";
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
	_environmentNames?: [];
	_colorSchemes?: {
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
	_customData?: Record<string, any>;
	_difficultyBeatmapSets: {
		_beatmapCharacteristicName: BeatMapCharacteristicNames;
		_difficultyBeatmaps: {
			_difficulty: BeatMapDifficultyNames;
			_difficultyRank: number;
			_beatmapFilename: string;
			_noteJumpMovementSpeed: number;
			_noteJumpStartBeatOffset: number;
			_beatmapColorSchemeIdx?: number;
			_environmentNameIdx?: number;
			_customData?: Record<string, any>;
		}[];
	}[];
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
	colorNotes: NoteType[];
	bombNotes: BombType[];
	obstacles: ObstacleType[];
	sliders: SliderType[];
	burstSliders: BurstSliderType[];
	waypoints: unknown[];
	basicBeatmapEvents: LightEventType[];
	colorBoostBeatmapEvents: { b: number; o: boolean }[];
	lightColorEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; r: number; t: number; b: number; i: number; e: { b: number; i: number; c: number; s: number; f: number }[] }[] }[];
	lightRotationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; l: number; r: number; o: number }[] }[] }[];
	lightTranslationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; t: number }[] }[] }[];
	basicEventTypesWithKeywords: Record<string, unknown>;
	useNormalEventsAsCompatibleEvents: boolean;
	customData?: {
		customEvents?: CustomEventType[];
		environment?: Environment[];
		materials?: Record<string, GeometryMaterialJSON>;
		fakeColorNotes?: NoteType[];
		fakeBombNotes?: BombType[];
		fakeObstacles?: ObstacleType[];
		fakeBurstSliders?: BurstSliderType[];
	};
};

export type classMap = {
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
	lightColorEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; r: number; t: number; b: number; i: number; e: { b: number; i: number; c: number; s: number; f: number }[] }[] }[];
	lightRotationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; l: number; r: number; o: number }[] }[] }[];
	lightTranslationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; t: number }[] }[] }[];
	basicEventTypesWithKeywords: Record<string, unknown>;
	useNormalEventsAsCompatibleEvents: boolean;
	customData?: {
		customEvents?: Array<AnimateComponent | AnimateTrack | AssignPathAnimation | AssignPlayerToTrack | AssignTrackParent>;
		environment?: Environment[];
		materials?: Record<string, GeometryMaterialJSON>;
		fakeColorNotes?: Note[];
		fakeBombNotes?: Bomb[];
		fakeObstacles?: Wall[];
		fakeBurstSliders?: Chain[];
	};
};

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
export type KFSingle = [number, number, Easing?];
export type KFVec4 = [number, number, number, number, number, Easing?, "splineCatmullRom"?];

export type modifierKFVec3 = [baseModifiers] | [baseModifiers, [number, number, number, modifierOps]];
export type modifierKFVec4 = [baseModifiers] | [baseModifiers, [number, number, number, number, modifierOps]];
export type modifierKFSingle = [baseModifiers] | [baseModifiers, [number, modifierOps]];

export type modifierOps = "opNone" | "opAdd" | "opSub" | "opMul" | "opDiv";
export type baseModifiers =
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

export type LightKeyframeFrameType = [number, number, number, number, number, Easing?, ("HSV" | "RGB")?];

// Object Properties

export type ObjectAnimProps = {
	offsetPosition?: Vec3 | KFVec3[] | modifierKFVec3;
	offsetWorldRotation?: Vec3 | KFVec3[] | modifierKFVec3;
	localRotation?: Vec3 | KFVec3[] | modifierKFVec3;
	scale?: Vec3 | KFVec3[] | modifierKFVec3;
	dissolve?: [number] | KFSingle[] | modifierKFSingle;
	dissolveArrow?: [number] | KFSingle[] | modifierKFSingle;
	interactable?: [number] | KFSingle[] | modifierKFSingle;
	definitePosition?: Vec3 | KFVec3[] | modifierKFVec3;
	color?: Vec4 | KFVec4[] | modifierKFVec4;
};

export type ComponentStaticProps = {
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

export type ObjectDirections = "Up" | "Down" | "Left" | "Right" | "Up Left" | "Up Right" | "Down Left" | "Down Right" | "Dot";
export type ObjectColors = "Left" | "Right";

export type WallCustomProps = { size?: Vec3; animation?: ObjectAnimProps; coordinates?: Vec2; worldRotation?: Vec3; localRotation?: Vec3; noteJumpMovementSpeed?: number; noteJumpStartBeatOffset?: number; uninteractable?: boolean; color?: Vec3 | Vec4; track?: string | string[] };
export type NoteType = { b: number; x: number; y: number; c: number; d: number; a: number; customData?: NoteCustomProps };
export type BombType = { b: number; x: number; y: number; customData?: NoteCustomProps };
export type ObstacleType = { b: number; x: number; y: number; d: number; w: number; h: number; customData?: WallCustomProps };
export type BurstSliderType = { b: number; x: number; y: number; c: number; d: number; tb: number; tx: number; ty: number; sc: number; s: number; customData?: SliderCustomProps };
export type SliderType = { b: number; c: number; x: number; y: number; d: number; mu: number; tb: number; tx: number; ty: number; tc: number; tmu: number; m: number; customData?: SliderCustomProps };
export type LightEventCustomData = { lightID?: number | number[]; color?: Vec3 | Vec4; easing?: Easing; lerpType?: "HSV" | "RGB"; lockRotation?: boolean; speed?: number; direction?: number; nameFilter?: string; rotation?: number; step?: number; prop?: number };
export type LightEventType = { b: number; et: number; i: number; f: number; customData?: LightEventCustomData };

export type LightEventTypes = "BackLasers" | "RingLights" | "LeftLasers" | "RightLasers" | "CenterLights" | "BoostColors" | "RingSpin" | "RingZoom" | "LeftLaserSpeed" | "RightLaserSpeed";
export type LightEventValues = "Off" | "OnBlue" | "FlashBlue" | "FadeBlue" | "Transition" | "In" | "TransitionBlue" | "On" | "OnRed" | "FlashRed" | "FadeRed" | "TransitionRed" | "OnWhite" | "FlashWhite" | "FadeWhite" | "TransitionWhite";

// CE props

export type CustomEventType = { b: number; t: CustomEventNames; d: TrackAnimProps | PathAnimProps | TrackParentProps | PlayerToTrackProps | ComponentAnimProps };

export type PathAnimAllProps = {
	offsetPosition?: Vec3 | KFVec3[] | modifierKFVec3;
	offsetWorldRotation?: Vec3 | KFVec3[] | modifierKFVec3;
	localRotation?: Vec3 | KFVec3[] | modifierKFVec3;
	scale?: Vec3 | KFVec3[] | modifierKFVec3;
	dissolve?: [number] | KFSingle[] | modifierKFSingle;
	dissolveArrow?: [number] | KFSingle[] | modifierKFSingle;
	interactable?: [number] | KFSingle[] | modifierKFSingle;
	definitePosition?: Vec3 | KFVec3[] | modifierKFVec3;
	color?: Vec4 | KFVec4[] | modifierKFVec4;
	track?: string | string[];
	duration?: number;
	easing?: Easing;
};
export type PathAnimProps = {
	offsetPosition?: Vec3 | KFVec3[] | modifierKFVec3;
	offsetWorldRotation?: Vec3 | KFVec3[] | modifierKFVec3;
	localRotation?: Vec3 | KFVec3[] | modifierKFVec3;
	scale?: Vec3 | KFVec3[] | modifierKFVec3;
	dissolve?: [number] | KFSingle[] | modifierKFSingle;
	dissolveArrow?: [number] | KFSingle[] | modifierKFSingle;
	interactable?: [number] | KFSingle[] | modifierKFSingle;
	definitePosition?: Vec3 | KFVec3[] | modifierKFVec3;
	color?: Vec4 | KFVec4[] | modifierKFVec4;
};
export type TrackAnimAllProps = {
	offsetPosition?: Vec3 | KFVec3[] | modifierKFVec3;
	offsetWorldRotation?: Vec3 | KFVec3[] | modifierKFVec3;
	localRotation?: Vec3 | KFVec3[] | modifierKFVec3;
	scale?: Vec3 | KFVec3[] | modifierKFVec3;
	dissolve?: [number] | KFSingle[] | modifierKFSingle;
	dissolveArrow?: [number] | KFSingle[] | modifierKFSingle;
	interactable?: [number] | KFSingle[] | modifierKFSingle;
	time?: KFSingle[];
	color?: Vec4 | KFVec4[] | modifierKFVec4;
	position?: Vec3 | KFVec3[] | modifierKFVec3;
	rotation?: Vec3 | KFVec3[] | modifierKFVec3;
	localPosition?: Vec3 | KFVec3[] | modifierKFVec3;
	track?: string | string[];
	duration?: number;
	easing?: Easing;
	repeat?: number;
};
export type TrackAnimProps = {
	offsetPosition?: Vec3 | KFVec3[] | modifierKFVec3;
	offsetWorldRotation?: Vec3 | KFVec3[] | modifierKFVec3;
	localRotation?: Vec3 | KFVec3[] | modifierKFVec3;
	scale?: Vec3 | KFVec3[] | modifierKFVec3;
	dissolve?: [number] | KFSingle[] | modifierKFSingle;
	dissolveArrow?: [number] | KFSingle[] | modifierKFSingle;
	interactable?: [number] | KFSingle[] | modifierKFSingle;
	time?: KFSingle[];
	color?: Vec4 | KFVec4[] | modifierKFVec4;
	position?: Vec3 | KFVec3[] | modifierKFVec3;
	rotation?: Vec3 | KFVec3[] | modifierKFVec3;
	localPosition?: Vec3 | KFVec3[] | modifierKFVec3;
};
export type TrackParentProps = { childrenTracks: string[]; parentTrack: string; worldPositionStays?: boolean };
export type PlayerObjectControllers = "Root" | "Head" | "LeftHand" | "RightHand";
export type PlayerToTrackProps = { track?: string; target?: PlayerObjectControllers };
export type ComponentAnimProps = {
	track?: string;
	duration?: number;
	easing?: Easing;
	BloomFogEnvironment?: { attenuation?: [number] | KFSingle[]; offset?: [number] | KFSingle[]; startY?: [number] | KFSingle[]; height?: [number] | KFSingle[] };
	TubeBloomPrePassLight?: { colorAlphaMultiplier?: [number] | KFSingle[]; bloomFogIntensityMultiplier?: [number] | KFSingle[] };
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

// Function and class prop types

export type MaterialPresetNames = "FixedConcrete" | "Dirt" | "BlurryMetal" | "ShinyMetal" | "ShinyMetal2D" | "Glass" | "Grid" | "FogLight" | "Invisible" | "SlightReflection" | "SlightReflectionNoColor" | "BlurryMirror" | "BlurryMirror2D" | "ShinyMirror" | "ShinyMirror2D";
