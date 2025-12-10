import { type RecordKey, TwoWayMap } from "@aurellis/helpers";
import type { V2InfoJSON, V3MapJSON, V4InfoJSON } from "./types.ts";

/**
 * Placeholder for valid V2 info JSON if certain values don't exist.
 */
export const V2_INFO_FALLBACK: V2InfoJSON = {
	_version: "2.1.0",
	_songName: "",
	_songSubName: "",
	_songAuthorName: "",
	_levelAuthorName: "",
	_beatsPerMinute: 100,
	_shuffle: 0,
	_shufflePeriod: 0.5,
	_previewStartTime: 0,
	_previewDuration: 10,
	_songFilename: "",
	_coverImageFilename: "",
	_environmentName: "DefaultEnvironment",
	_allDirectionsEnvironmentName: "GlassDesertEnvironment",
	_songTimeOffset: 0,
	_difficultyBeatmapSets: []
} as const;

/**
 * Placeholder for valid V4 info JSON if values don't exist.
 */
export const V4_INFO_FALLBACK: V4InfoJSON = {
	version: "4.0.0",
	song: {
		title: "",
		author: "",
		subTitle: ""
	},
	audio: {
		songFilename: "",
		songDuration: 0,
		audioDataFilename: ".dat",
		bpm: 0,
		lufs: 0,
		previewStartTime: 0,
		previewDuration: 0
	},
	songPreviewFilename: "",
	coverImageFilename: "",
	environmentNames: [],
	colorSchemes: [],
	difficultyBeatmaps: []
} as const;

/**
 * Placeholder for valid V3 beatmap JSON.
 */
export const V3_MAP_FALLBACK: V3MapJSON = {
	version: "3.3.0",
	bpmEvents: [],
	colorNotes: [],
	bombNotes: [],
	obstacles: [],
	sliders: [],
	burstSliders: [],
	waypoints: [],
	rotationEvents: [],
	basicBeatmapEvents: [],
	basicEventTypesWithKeywords: {},
	colorBoostBeatmapEvents: [],
	vfxEventBoxGroups: [],
	lightColorEventBoxGroups: [],
	lightRotationEventBoxGroups: [],
	lightTranslationEventBoxGroups: [],
	useNormalEventsAsCompatibleEvents: true,
	_fxEventsCollection: { _fl: [], _il: [] }
} as const;

/**
 * TwoWayMap generic type.
 */
export type TWM<T extends Record<RecordKey, RecordKey>> = TwoWayMap<keyof T, T[keyof T]>;

/**
 * Internal map for mapping numerical object colors to named colors. Modifying the contents of this may break LiteMapper's functionality.
 */
export const _objectColors = {
	Left: 0,
	Right: 1
};

/**
 * Internal map for mapping numerical object colors to named colors. Modifying the contents of this may break LiteMapper's functionality.
 */
export const ObjectColorsMap: TWM<typeof _objectColors> = new TwoWayMap(_objectColors);

/**
 * Internal map for mapping object directions to named directions. Modifying the contents of this may break LiteMapper's functionality.
 */
export const _objectDirections = {
	Up: 0,
	Down: 1,
	Left: 2,
	Right: 3,
	"Up Left": 4,
	"Up Right": 5,
	"Down Left": 6,
	"Down Right": 7,
	Dot: 8
};

/**
 * Internal map for mapping object directions to named directions. Modifying the contents of this may break LiteMapper's functionality.
 */
export const ObjectDirectionsMap: TWM<typeof _objectDirections> = new TwoWayMap(_objectDirections);

/**
 * Internal map for mapping light event values to named values. Modifying the contents of this may break LiteMapper's functionality.
 */
export const _lightEventValues = {
	Off: 0,
	OnBlue: 1,
	On: 1,
	FlashBlue: 2,
	FadeBlue: 3,
	Transition: 4,
	TransitionBlue: 4,
	In: 4,
	OnRed: 5,
	FlashRed: 6,
	FadeRed: 7,
	TransitionRed: 8,
	OnWhite: 9,
	FlashWhite: 10,
	FadeWhite: 11,
	TransitionWhite: 12
};

/**
 * Internal map for mapping light event values to named values. Modifying the contents of this may break LiteMapper's functionality.
 */
export const LightEventValuesMap: TWM<typeof _lightEventValues> = new TwoWayMap(_lightEventValues);

/**
 * Internal map for mapping light event types to named types. Modifying the contents of this may break LiteMapper's functionality.
 */
export const _lightEventTypes = {
	BackLasers: 0,
	RingLights: 1,
	LeftLasers: 2,
	RightLasers: 3,
	CenterLights: 4,
	BoostColors: 5,
	RingSpin: 8,
	RingZoom: 9,
	BillieLeft: 10,
	BillieRight: 11,
	LeftLaserSpeed: 12,
	RightLaserSpeed: 13
};

/**
 * Internal map for mapping light event types to named types. Modifying the contents of this may break LiteMapper's functionality.
 */
export const LightEventTypesMap: TWM<typeof _lightEventTypes> = new TwoWayMap(_lightEventTypes);

/**
 * Internal map for applying difficulty rank numbers to rank names in V2 info files. Modifying the contents of this may break LiteMapper's functionality.
 */
export const _difficultyRanks = { Easy: 1, Normal: 3, Hard: 5, Expert: 7, ExpertPlus: 9 } as const;

/**
 * Internal map for applying difficulty rank numbers to rank names in V2 info files. Modifying the contents of this may break LiteMapper's functionality.
 */
export const difficultyRankMap: TWM<typeof _difficultyRanks> = new TwoWayMap(_difficultyRanks);
