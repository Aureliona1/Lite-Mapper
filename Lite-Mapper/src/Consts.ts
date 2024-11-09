import { TwoWayMap } from "./Functions.ts";
import { Vec3, MaterialPresetNames, GeometryMaterialJSON, LookupMethod } from "./Types.ts";

export const ye = -69420;
export const ye3: Vec3 = [ye, ye, ye];

/**
 * Ported from https://github.com/Shonshyn/BS-Tools-for-Mappers
 */
export const MaterialPresets: Record<MaterialPresetNames, GeometryMaterialJSON> = {
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
};

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
		SUN: ["Sun$", "Regex"] as [string, LookupMethod],
		CLOUDS: ["Clouds$", "Regex"] as [string, LookupMethod],
		SMOKE: ["BigSmokePS$", "Regex"] as [string, LookupMethod],
		RAIL_LIGHT: ["t\\.\\[\\d+\\]Neon\\w+L$", "Regex"] as [string, LookupMethod],
		RAIN: ["Rain$", "Regex"] as [string, LookupMethod]
	}
};

/**
 * Internal type for mapping numerical light types to named types.
 */
export type LightTypesNumericalValues = 0 | 1 | 2 | 3 | 4 | 5 | 8 | 9 | 12 | 13;
/**
 * Internal type for mapping numerical light values to named values.
 */
export type LightValueNumericalValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const LightEventTypesMap = new TwoWayMap({
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

export const LightEventValuesMap = new TwoWayMap({
	Off: 0,
	OnBlue: 1,
	FlashBlue: 2,
	FadeBlue: 3,
	Transition: 4,
	In: 4,
	TransitionBlue: 4,
	On: 5,
	OnRed: 5,
	FlashRed: 6,
	FadeRed: 7,
	TransitionRed: 8,
	OnWhite: 9,
	FlashWhite: 10,
	FadeWhite: 11,
	TransitionWhite: 12
});

/**
 * Internal type for mapping nunerical object directions to named directions.
 */
export type ObjectDirectionsNumericalValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/**
 * Internal type for mapping numerical object colors to named colors.
 */
export type ObjectColorsNumericalValues = 0 | 1;

export const ObjectDirectionsMap = new TwoWayMap({
	Up: 0,
	Down: 1,
	Left: 2,
	Right: 3,
	"Up Left": 4,
	"Up Right": 5,
	"Down Left": 6,
	"Down Right": 7,
	Dot: 8
});

export const ObjectColorsMap = new TwoWayMap({
	Left: 0,
	Right: 1
});
