import { jsonPrune, currentDiff } from "./LiteMapper.ts";
import { LookupMethod, GeometryObjectTypes, GeometryMaterialJSON, Vec3, GeometryObjectJSON, Vec4, MaterialShader, KeywordsBTSPillar, KeywordsBaseWater, KeywordsBillieWater, KeywordsStandard, KeywordsInterscopeConcrete, KeywordsInterscopeCar, KeywordsWaterfallMirror } from "./types.ts";

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
