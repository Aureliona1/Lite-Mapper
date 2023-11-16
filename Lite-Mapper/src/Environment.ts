import {
	jsonPrune,
	currentDiff,
	ComponentStaticProps,
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
	LookupMethod,
	MaterialShader,
	Vec3,
	Vec4,
	repeat,
	rotateVector,
	copy
} from "./LiteMapper.ts";

export class Environment {
	/**
	 * Create a new environment object.
	 * @param id The environment id.
	 * @param lookupMethod The lookup method for your environment.
	 */
	constructor() {}
	env(id: string, lookup: LookupMethod) {
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
	components?: ComponentStaticProps;
	scale?: Vec3;
	position?: Vec3;
	localPosition?: Vec3;
	rotation?: Vec3;
	localRotation?: Vec3;
	track?: string | string[];
	geometry?: GeometryObjectJSON;
	/**
	 * Return your environment object as an object.
	 * @param dupe Whether to copy the object on return.
	 */
	return(dupe = true) {
		const temp = dupe ? copy(this) : this;
		jsonPrune(temp);
		return temp;
	}
	/**
	 * Push the environment to the current diff.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.environments?.push(this.return(dupe));
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
			cube.position = rotateVector([-Math.sin(angle) * this.radius, -Math.cos(angle) * this.radius, 0], this.rotation);
			cube.position = [cube.position[0] + this.position[0], cube.position[1] + this.position[1], cube.position[2] + this.position[2]];
			cube.scale = [(this.innercorners ? this.radius - this.scale[1] / 2 : this.radius + this.scale[1] / 2) * Math.tan(Math.PI / this.sides) * 2, this.scale[1], this.scale[2]];
			cube.rotation = [this.rotation[0], this.rotation[1], this.rotation[2] - (180 * angle) / Math.PI];
			returnArray.push(cube);
		});
		return returnArray;
	}
}
