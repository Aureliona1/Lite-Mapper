import { ArrOp } from "./Arrays.ts";
import { LM_CONST } from "./Consts.ts";
import { AnimateComponent } from "./CustomEvents.ts";
import { copy, jsonPrune, repeat, rotateVector } from "./Functions.ts";
import { currentDiff } from "./Map.ts";
import {
	ComponentStaticProps,
	EnvironmentJSON,
	GeometryMaterialJSON,
	GeometryObjectJSON,
	GeometryObjectTypes,
	KeywordsBTSPillar,
	KeywordsBaseWater,
	KeywordsBillieWater,
	KeywordsInterscopeCar,
	KeywordsInterscopeConcrete,
	KeywordsStandard,
	KeywordsWaterfallMirror,
	LightTypeNumbers,
	LookupMethod,
	MaterialShader,
	Vec3,
	Vec4
} from "./Types.ts";

export class Environment {
	/**
	 * Create a new environment or geometry object.
	 * You will need to use `.env()` or `.geo()` after this.
	 */
	constructor() {}

	/**
	 * Create a new Environment modification.
	 *
	 * **NOTE:** This overrides `.geo()`, you cannot use geometry and environment on the same object.
	 * @param id The Chroma id of the object/s you wish to target.
	 * @param lookup The lookup method for finding these objects.
	 */
	env(id: string, lookup: LookupMethod) {
		this.id = id;
		this.lookupMethod = lookup;
		if (this.geometry) {
			delete this.geometry;
		}
		return this;
	}

	/**
	 * Create a new Geometry object.
	 *
	 * **NOTE:** This overrides `.env()`, you cannot use environment and geometry on the same object.
	 * @param type The geometry primitive type to use.
	 * @param mat The material of the geometry object.
	 */
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
	/**
	 * The id that chroma will use to lookup your environment object from the environment log.
	 */
	id?: string;
	/**
	 * The lookup method that chroma will use to search for your environment object.
	 */
	lookupMethod?: LookupMethod;
	/**
	 * Whether the object should be loaded when the map is played. Setting this to false will prevent all child objects of the object from loading.
	 */
	active?: boolean;
	/**
	 * Whether to duplicate the object. If this is set to true, any changes made will affect the copy of the object and ignore the original.
	 */
	duplicate?: boolean;
	/**
	 * Any component values or modifications on the object.
	 */
	components?: ComponentStaticProps;
	/**
	 * The relative scale of the object to it's original scale. This can be treated as absolute scale for geometry.
	 */
	scale?: Vec3;
	/**
	 * The absolute position of the origin of the object.
	 */
	position?: Vec3;
	/**
	 * Set the relative position of the object.
	 */
	localPosition?: Vec3;
	/**
	 * Set the rotation of the object.
	 */
	rotation?: Vec3;
	/**
	 * Set the relative rotation of the object.
	 */
	localRotation?: Vec3;
	/**
	 * Set a track (or tracks) on the object to be animated through custom events.
	 */
	track?: string | string[];
	/**
	 * Modify geometry properies on the object. This will override `id` and `lookupMethod`.
	 */
	geometry?: GeometryObjectJSON;

	/**
	 * Create an instance of an environment from valid environment JSON.
	 * @param x The JSON.
	 * @returns An environment (or geometry).
	 */
	static from(x: EnvironmentJSON) {
		const e = new Environment();
		e.active = x.active ?? e.active;
		if (x.components) {
			e.components = { fog: x.components.BloomFogEnvironment };
			if (x.components.ILightWithId) {
				e.components.lightIds = { id: x.components.ILightWithId.lightID };
				if (x.components.ILightWithId.type) {
					e.components.lightIds.type = LM_CONST.LightEventTypesMap.revGet(x.components.ILightWithId.type as LightTypeNumbers);
				}
			}
			if (x.components.TubeBloomPrePassLight) {
				e.components.lightBloom = {
					bloomMult: x.components.TubeBloomPrePassLight.bloomFogIntensityMultiplier,
					colorMult: x.components.TubeBloomPrePassLight.colorAlphaMultiplier
				};
			}
			jsonPrune(e.components);
		}
		if (x.duplicate !== undefined) {
			e.duplicate = x.duplicate == 1 ? true : false;
		}
		e.geometry = x.geometry ?? e.geometry;
		e.id = x.id ?? e.id;
		e.localPosition = x.localPosition ?? e.localPosition;
		e.localRotation = x.localRotation ?? e.localRotation;
		e.lookupMethod = x.lookupMethod ?? e.lookupMethod;
		e.position = x.position ?? e.position;
		e.rotation = x.rotation ?? e.rotation;
		e.scale = x.scale ?? e.scale;
		if (x.track !== undefined) {
			if (typeof x.track == "string") {
				e.track = x.track;
			} else {
				e.track = [...x.track];
			}
		}
		return e;
	}

	/**
	 * Return your environment object as an object.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true) {
		const temp = dupe ? copy(this) : this;
		const out: EnvironmentJSON = {
			active: temp.active,
			duplicate: temp.duplicate == undefined ? undefined : temp.duplicate ? 1 : 0,
			geometry: temp.geometry,
			id: temp.id,
			localPosition: temp.localPosition,
			localRotation: temp.localRotation,
			lookupMethod: temp.lookupMethod,
			position: temp.position,
			rotation: temp.rotation,
			scale: temp.scale,
			track: temp.track
		};
		if (temp.components) {
			out.components = { BloomFogEnvironment: temp.components.fog };
			if (temp.components.lightIds) {
				out.components.ILightWithId = { lightID: temp.components.lightIds.id };
				if (temp.components.lightIds.type) {
					out.components.ILightWithId.type = LM_CONST.LightEventTypesMap.get(temp.components.lightIds.type);
				}
			}
			if (temp.components.lightBloom) {
				out.components.TubeBloomPrePassLight = {
					bloomFogIntensityMultiplier: temp.components.lightBloom.bloomMult,
					colorAlphaMultiplier: temp.components.lightBloom.colorMult
				};
			}
		}
		jsonPrune(out);
		return out;
	}
	/**
	 * Push the environment to the current diff.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.environments.push(dupe ? copy(this) : this);
	}
}

export class Material {
	color?: Vec3 | Vec4;
	track?: string;
	shaderKeywords?: string[];
	shader: MaterialShader = "Standard";
	BTSPillar(shaderKeywords?: KeywordsBTSPillar, color?: Vec3 | Vec4, track?: string) {
		this.color = color ?? this.color;
		this.track = track ?? this.track;
		this.shaderKeywords = shaderKeywords ?? this.shaderKeywords;
		this.shader = "BTSPillar";
		return this;
	}
	OpaqueLight(shaderKeywords?: string[], color?: Vec3 | Vec4, track?: string) {
		this.color = color ?? this.color;
		this.track = track ?? this.track;
		this.shaderKeywords = shaderKeywords ?? this.shaderKeywords;
		this.shader = "OpaqueLight";
		return this;
	}
	TransparentLight(shaderKeywords?: string[], color?: Vec3 | Vec4, track?: string) {
		this.color = color ?? this.color;
		this.track = track ?? this.track;
		this.shaderKeywords = shaderKeywords ?? this.shaderKeywords;
		this.shader = "TransparentLight";
		return this;
	}
	BaseWater(shaderKeywords?: KeywordsBaseWater, color?: Vec3 | Vec4, track?: string) {
		this.color = color ?? this.color;
		this.track = track ?? this.track;
		this.shaderKeywords = shaderKeywords ?? this.shaderKeywords;
		this.shader = "BaseWater";
		return this;
	}
	BillieWater(shaderKeywords?: KeywordsBillieWater, color?: Vec3 | Vec4, track?: string) {
		this.color = color ?? this.color;
		this.track = track ?? this.track;
		this.shaderKeywords = shaderKeywords ?? this.shaderKeywords;
		this.shader = "BillieWater";
		return this;
	}
	Standard(shaderKeywords?: KeywordsStandard, color?: Vec3 | Vec4, track?: string) {
		this.color = color ?? this.color;
		this.track = track ?? this.track;
		this.shaderKeywords = shaderKeywords ?? this.shaderKeywords;
		this.shader = "Standard";
		return this;
	}
	InterscopeConcrete(shaderKeywords?: KeywordsInterscopeConcrete, color?: Vec3 | Vec4, track?: string) {
		this.color = color ?? this.color;
		this.track = track ?? this.track;
		this.shaderKeywords = shaderKeywords ?? this.shaderKeywords;
		this.shader = "InterscopeConcrete";
		return this;
	}
	InterscopeCar(shaderKeywords?: KeywordsInterscopeCar, color?: Vec3 | Vec4, track?: string) {
		this.color = color ?? this.color;
		this.track = track ?? this.track;
		this.shaderKeywords = shaderKeywords ?? this.shaderKeywords;
		this.shader = "InterscopeCar";
		return this;
	}
	WaterfallMirror(shaderKeywords?: KeywordsWaterfallMirror, color?: Vec3 | Vec4, track?: string) {
		this.color = color ?? this.color;
		this.track = track ?? this.track;
		this.shaderKeywords = shaderKeywords ?? this.shaderKeywords;
		this.shader = "WaterfallMirror";
		return this;
	}

	/**
	 * Import raw material json into a class.
	 */
	import(raw: GeometryMaterialJSON) {
		return raw as Material;
	}

	/**
	 * Return the class as json.
	 */
	return() {
		const out: GeometryMaterialJSON = {
			color: this.color,
			track: this.track,
			shaderKeywords: this.shaderKeywords,
			shader: this.shader
		};
		jsonPrune(out);
		return out;
	}

	/**
	 * Push the material to the current diff.
	 * @param name The name of the material.
	 */
	push(name: string) {
		currentDiff.materials[name] = this.return();
	}
}

export class Polygon {
	/**
	 * Creates a 2d shape defaulting along the xy plane.
	 * @param sides The number of sides.
	 * @param radius The radius of the shape.
	 * @param position Where to place the center of the shape.
	 * @param scale The scale of the individual sides (x value is ignored as it is used to close the edges).
	 * @param rotation The rotation to add to the shape, not affected by position.
	 * @param material The name of the material to use for the shape (create your own beforehand)
	 * @param track Track to apply to the shape.
	 * @param innercorners Changes the way that corners are joined. Triangles look better (imo) with inner corners.
	 * @param iterateTrack (Default = true) Changes the track value for each piece of the shape. False: every piece will have the same track. True: each piece will have the track `${track}_${i}` where {0 <= i < sides}
	 * @param iterateOffset An offset to start iterating the tracks from.
	 */
	constructor(
		public material: GeometryMaterialJSON = { shader: "Standard" },
		public sides: number = 4,
		public radius: number = 10,
		public position: Vec3 = [0, 0, 0],
		public scale: Vec3 = [1, 1, 1],
		public rotation: Vec3 = [0, 0, 0],
		public innercorners: boolean = false,
		public track: string | undefined = undefined,
		public iterateTrack: boolean = true,
		public iterateOffset = 0
	) {}

	/**
	 * Push the shape to the active diff.
	 */
	push() {
		this.return().forEach(geo => {
			geo.push();
		});
	}
	/**
	 * Returns the array of geometry instead of pushing to the diff.
	 * @returns Geometry array.
	 */
	return() {
		const returnArray: Environment[] = [];
		repeat(this.sides, side => {
			const cube = new Environment().geo("Cube", this.material);
			if (this.track && this.iterateTrack) {
				cube.track = `${this.track}_${side + this.iterateOffset}`;
			} else if (this.track && !this.iterateTrack) {
				cube.track = this.track;
			}
			const angle = (Math.PI * 2 * side) / this.sides;
			cube.position = ArrOp.add(rotateVector([0, 0, 0], [-Math.sin(angle) * this.radius, -Math.cos(angle) * this.radius, 0], this.rotation), this.position);
			cube.scale = [(this.innercorners ? this.radius - this.scale[1] / 2 : this.radius + this.scale[1] / 2) * Math.tan(Math.PI / this.sides) * 2, this.scale[1], this.scale[2]];
			cube.rotation = [this.rotation[0], this.rotation[1], this.rotation[2] - (180 * angle) / Math.PI];
			returnArray.push(cube);
		});
		return returnArray;
	}
}

class staticFog {
	private fog = new Environment().env("[0]Environment", "EndsWith");
	private get components() {
		this.fog.components ??= {};
		this.fog.components.fog ??= {};
		return this.fog.components.fog;
	}
	private set components(x) {
		this.fog.components ??= {};
		this.fog.components.fog ??= {};
		this.fog.components.fog = x;
	}
	attenuation(x: number) {
		this.components.attenuation = x;
		return this;
	}
	height(x: number) {
		this.components.height = x;
		return this;
	}
	startY(x: number) {
		this.components.startY = x;
		return this;
	}
	offset(x: number) {
		this.components.offset = x;
		return this;
	}
	push() {
		this.fog.push();
	}
}

class AnimatedFog {
	constructor(public readonly track: string, public time: number, public duration: number) {
		this.componentAnimation = new AnimateComponent(track, time, duration);
	}
	private componentAnimation: AnimateComponent;
	private get fog() {
		this.componentAnimation.fog ??= {};
		return this.componentAnimation.fog;
	}
	private set fog(x) {
		this.componentAnimation.fog ??= {};
		this.componentAnimation.fog = x;
	}
	get attenuation() {
		return this.fog.attenuation;
	}
	set attenuation(x) {
		this.fog.attenuation = x;
	}
	get height() {
		return this.fog.height;
	}
	set height(x) {
		this.fog.height = x;
	}
	get startY() {
		return this.fog.startY;
	}
	set startY(x) {
		this.fog.startY = x;
	}
	get offset() {
		return this.fog.offset;
	}
	set offset(x) {
		this.fog.offset = x;
	}
	/**
	 * Get the json of the underlying component animation.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true) {
		return this.componentAnimation.return(dupe);
	}
	/**
	 * Push the fog animation.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		this.componentAnimation.time = this.time;
		this.componentAnimation.duration = this.duration;
		this.componentAnimation.push(dupe);
	}
}

export class Fog {
	static() {
		return new staticFog();
	}
	private assignFogTrack(track: string) {
		const fog = new Environment().env("[0]Environment", "EndsWith");
		fog.track = track;
		fog.push();
	}
	animated(track = "fog", time = 0, duration = 1) {
		this.assignFogTrack(track);
		return new AnimatedFog(track, time, duration);
	}
}
