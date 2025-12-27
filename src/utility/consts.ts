import type { Vec3 } from "@aurellis/helpers";
import type { LookupMethod } from "../core/types.ts";

/**
 * Constant value to send objects to so that they are out of view of the player.
 */
export const ye: number = -69420;
/**
 * Vec3 position to send objects to so that they are out of view of the player.
 */
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
} as const;

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
