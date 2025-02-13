import { GeometryMaterialJSON, LookupMethod, V2InfoJSON, V4InfoJSON, Vec3 } from "./Types.ts";

export const ye = -69420;
export const ye3: Vec3 = [ye, ye, ye];

/**
 * Ported from https://github.com/Shonshyn/BS-Tools-for-Mappers
 */
export const MaterialPresets = {
	FixedConcrete: {
		shader: "InterscopeConcrete",
		shaderKeywords: [
			"DIFFUSE",
			"DIRT",
			"ENABLE_DIFFUSE",
			"ENABLE_DIRT",
			"ENABLE_DIRT_DETAIL",
			"ENABLE_FOG",
			"ENABLE_GROUND_FADE",
			"ENABLE_SPECULAR",
			"ENABLE_VERTEXT_COLOR",
			"FOG",
			"NOISE_DITHERING",
			"REFLECTION_PROBE",
			"REFLECTION_PROBE_BOX_PROJECTION",
			"REFLECTION_PROBE_BOX_PROJECTION_OFFSET",
			"_EMISSION",
			"_ENABLE_FOG_TINT",
			"_RIMLIGHT_NONE"
		]
	},
	Dirt: {
		shader: "InterscopeConcrete",
		color: [0.5, 0.368, 0.36, 1],
		shaderKeywords: ["DIFFUSE", "DIRT", "FOG", "REFLECTION_PROBE_BOX_PROJECTION"]
	},
	BlurryMetal: {
		shader: "InterscopeConcrete",
		shaderKeywords: ["DIRT", "DIFFUSE", "FOG", "REFLECTION_PROBE", "REFLECTION_PROBE_BOX_PROJECTION", "REFLECTION_PROBE_BOX_PROJECTION_OFFSET"]
	},
	ShinyMetal: {
		shader: "InterscopeCar",
		shaderKeywords: ["DIRT", "DIFFUSE", "FOG", "REFLECTION_PROBE", "REFLECTION_PROBE_BOX_PROJECTION", "REFLECTION_PROBE_BOX_PROJECTION_OFFSET"]
	},
	ShinyMetal2D: {
		shader: "InterscopeCar",
		shaderKeywords: ["DIRT", "DIFFUSE", "FOG", "REFLECTION_PROBE", "REFLECTION_PROBE_BOX_PROJECTION_OFFSET"]
	},
	Glass: {
		shader: "TransparentLight",
		shaderKeywords: ["REFLECTION_PROBE"]
	},
	Grid: {
		shader: "WaterfallMirror",
		shaderKeywords: ["ENABLE_DIRT"]
	},
	FogLight: {
		shader: "OpaqueLight",
		shaderKeywords: ["ENABLE_HEIGHT_FOG"]
	},
	Invisible: {
		shader: "InterscopeConcrete",
		shaderKeywords: ["INSTANCING_ON"]
	},
	SlightReflection: {
		shader: "BTSPillar",
		shaderKeywords: ["DIFFUSE", "FOG", "REFLECTION_PROBE", "REFLECTION_PROBE_BOX_PROJECTION"]
	},
	SlightReflectionNoColor: {
		shader: "BTSPillar",
		shaderKeywords: ["FOG", "REFLECTION_PROBE", "REFLECTION_PROBE_BOX_PROJECTION"]
	},
	BlurryMirror: {
		shader: "InterscopeConcrete",
		shaderKeywords: ["DIFFUSE", "FOG", "REFLECTION_PROBE", "REFLECTION_PROBE_BOX_PROJECTION"]
	},
	BlurryMirror2D: {
		shader: "InterscopeConcrete",
		shaderKeywords: ["DIFFUSE", "FOG", "REFLECTION_PROBE"]
	},
	ShinyMirror: {
		shader: "InterscopeCar",
		shaderKeywords: ["DIFFUSE", "FOG", "REFLECTION_PROBE", "REFLECTION_PROBE_BOX_PROJECTION"]
	},
	ShinyMirror2D: {
		shader: "InterscopeCar",
		shaderKeywords: ["DIFFUSE", "FOG", "REFLECTION_PROBE"]
	}
} satisfies Record<string, GeometryMaterialJSON>;

/**
 * Useful environment constants. Use in your map as such:
 * ```ts
 * const env = new Environment().env(...ENV_PARAM.BILLIE.RAIN);
 * env.push();
 * ```
 */
export const ENV_PARAM = {
	BTS: {
		DOOR: ["MagicDoorSprite", "Regex"] as [string, LookupMethod],
		CLOUDS_HIGH: ["HighCloudsGenerator$", "Regex"] as [string, LookupMethod],
		CLOUDS_LOW: ["LowCloudsGenerator$", "Regex"] as [string, LookupMethod],
		CLOUDS_ALL: ["Clouds$", "Regex"] as [string, LookupMethod],
		SOLID_LASER: ["SmallPillarPair\\.\\[\\d*\\]PillarL\\.\\[\\d*\\]LaserL$", "Regex"] as [string, LookupMethod]
	},
	BILLIE: {
		DIRECTIONAL_LIGHT: ["Day\\.\\[\\d+\\]\\w+Front$", "Regex"] as [string, LookupMethod],
		SOLID_LASER: ["\\w+\\.\\[\\d+\\]\\w+L\\.\\[\\d+\\]\\w+L\\.\\[\\d+\\]\\w+LH$", "Regex"] as [string, LookupMethod],
		SUN: ["Sun", "EndsWith"] as [string, LookupMethod],
		CLOUDS: ["Clouds$", "Regex"] as [string, LookupMethod],
		SMOKE: ["BigSmokePS$", "Regex"] as [string, LookupMethod],
		RAIL_LIGHT: ["t\\.\\[\\d+\\]Neon\\w+L$", "Regex"] as [string, LookupMethod],
		RAIN: ["Rain$", "Regex"] as [string, LookupMethod]
	}
};

class TwoWayMap<S extends string | number | symbol, T extends string | number | symbol> {
	reverseMap: Record<T, S>;
	constructor(private map: Record<S, T>) {
		this.reverseMap = Object.fromEntries(Object.entries(map).map(x => [x[1], x[0]]));
	}
	get(key: S) {
		return this.map[key];
	}
	revGet(key: T) {
		return this.reverseMap[key];
	}
}

/**
 * A collection of constants used internally by Lite-Mapper. Do not edit these as this will break Lite-Mapper's functionality.
 */
export const LM_CONST = {
	V2_INFO_FALLBACK: {
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
	} satisfies V2InfoJSON,
	V4_INFO_FALLBACK: {
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
	} satisfies V4InfoJSON,
	/**
	 * Internal map for mapping numerical object colors to named colors.
	 */
	ObjectColorsMap: new TwoWayMap({
		Left: 0,
		Right: 1
	}),
	/**
	 * Internal map for mapping object directions to named directions. DO NOT EDIT!
	 */
	ObjectDirectionsMap: new TwoWayMap({
		Up: 0,
		Down: 1,
		Left: 2,
		Right: 3,
		"Up Left": 4,
		"Up Right": 5,
		"Down Left": 6,
		"Down Right": 7,
		Dot: 8
	}),
	LightEventValuesMap: new TwoWayMap({
		Off: 0,
		On: 1,
		OnBlue: 1,
		FlashBlue: 2,
		FadeBlue: 3,
		Transition: 4,
		In: 4,
		TransitionBlue: 4,
		OnRed: 5,
		FlashRed: 6,
		FadeRed: 7,
		TransitionRed: 8,
		OnWhite: 9,
		FlashWhite: 10,
		FadeWhite: 11,
		TransitionWhite: 12
	}),
	LightEventTypesMap: new TwoWayMap({
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
	}),
	difficultyRankMap: new TwoWayMap({ Easy: 1, Normal: 3, Hard: 5, Expert: 7, ExpertPlus: 9 })
};
