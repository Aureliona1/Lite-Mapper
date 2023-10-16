type DiffTypes<T extends string> = `Easy${T}` | `Normal${T}` | `Hard${T}` | `Expert${T}` | `ExpertPlus${T}`;
export type DiffNames = DiffTypes<"Standard"> | DiffTypes<"Lightshow"> | DiffTypes<"Lawless">;
type FilterObject = { c: number; f: number; p: number; t: number; r: number; n: number; s: number; l: number; d: number };
export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];
type EaseBase<T extends string> = `easeIn${T}` | `easeOut${T}` | `easeInOut${T}`;
export type Easing = EaseBase<"Sine"> | EaseBase<"Quad"> | EaseBase<"Cubic"> | EaseBase<"Quart"> | EaseBase<"Quint"> | EaseBase<"Circ"> | EaseBase<"Back"> | EaseBase<"Bounce"> | EaseBase<"Elastic"> | "easeStep" | "easeLinear";
export type LookupMethod = "Contains" | "Regex" | "Exact" | "StartsWith" | "EndsWith";
export type KFVec3 = [number, number, number, number, Easing?, "splineCatmullRom"?];
export type KFSingle = [number, number, Easing?];
export type KFVec4 = [number, number, number, number, number, Easing?, "splineCatmullRom"?];
type GeometryObjectTypes = "Sphere" | "Capsule" | "Cylinder" | "Cube" | "Plane" | "Quad" | "Triangle";
export type MaterialShader = "Standard" | "OpaqueLight" | "TransparentLight" | "BaseWater" | "BillieWater" | "BTSPillar" | "InterscopeConcrete" | "InterscopeCar" | "Obstacle" | "WaterfallMirror";
export type GeometryMaterialJSON = { shader: MaterialShader; color?: Vec3 | Vec4; track?: string; shaderKeywords: string[] };
export type GeometryObjectJSON = { type: GeometryObjectTypes; material: GeometryMaterialJSON | string };
export type EnvironmentObjectJSON = { id?: string; lookupMethod?: LookupMethod; duplicate?: number; active?: boolean; scale?: Vec3; position?: Vec3; localPosition?: Vec3; rotation?: Vec3; localRotation?: Vec3; track?: string | string[]; geometry?: GeometryObjectJSON };
type CustomEventNames = "AnimateTrack" | "AssignPathAnimation" | "AssignTrackParent" | "AssignPlayerToTrck" | "AnimateComponent";
export type ObjectAnimProps = {
	offsetPosition?: Vec3 | KFVec3[];
	offsetWorldRotation?: Vec3 | KFVec3[];
	localRotation?: Vec3 | KFVec3[];
	scale?: Vec3 | KFVec3[];
	dissolve?: [number] | KFSingle[];
	dissolveArrow?: [number] | KFVec3[];
	interactable?: [number] | KFSingle[];
	definitePosition?: Vec3 | KFVec3[];
	color?: Vec4 | KFVec4[];
};
export type PathAnimProps = {
	offsetPosition?: Vec3 | KFVec3[];
	offsetWorldRotation?: Vec3 | KFVec3[];
	localRotation?: Vec3 | KFVec3[];
	scale?: Vec3 | KFVec3[];
	dissolve?: [number] | KFSingle[];
	dissolveArrow?: [number] | KFVec3[];
	interactable?: [number] | KFSingle[];
	definitePosition?: Vec3 | KFVec3[];
	color?: Vec4 | KFVec4[];
	track: string | string[];
	duration?: number;
	easing?: Easing;
};
export type TrackAnimProps = {
	offsetPosition?: Vec3 | KFVec3[];
	offsetWorldRotation?: Vec3 | KFVec3[];
	localRotation?: Vec3 | KFVec3[];
	scale?: Vec3 | KFVec3[];
	dissolve?: [number] | KFSingle[];
	dissolveArrow?: [number] | KFVec3[];
	interactable?: [number] | KFSingle[];
	time?: KFSingle[];
	color?: Vec4 | KFVec4[];
	position?: Vec3 | KFVec3[];
	rotation?: Vec3 | KFVec3;
	localPosition?: Vec3 | KFVec3[];
	track: string | string[];
	duration?: number;
	easing?: Easing;
	repeat?: number;
};
export type TrackParentProps = { childrenTracks: string[]; parentTrack: string; worldPositionStays?: boolean };
type PlayerObjectControllers = "Root" | "Head" | "LeftHand" | "RightHand";
export type PlayerToTrackProps = { track: string; target?: PlayerObjectControllers };
export type ComponentAnimProps = {
	track: string;
	duration?: number;
	easing?: Easing;
	ILightWithId?: { lightID?: number; type?: number };
	BloomFogEnvironment?: { attenuation?: [number] | KFSingle; offset?: [number] | KFSingle; startY?: [number] | KFSingle; height?: [number] | KFSingle };
	TubeBloomPrePassLight?: { colorAlphaMultiplier?: number; bloomFogIntensityMultiplier?: number };
};

type NoteCustomProps = {
	coordinates?: Vec2;
	worldRotation?: Vec3;
	localRotation?: Vec3;
	noteJumpMovementSpeed?: number;
	noteJumpStartBeatOffest?: number;
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
type SliderCustomProps = { coordinates?: Vec2; worldRotation?: Vec3; localRotation?: Vec3; noteJumpMovementSpeed?: number; noteJumpStartBeatOffset?: number; uninteractable?: boolean; disableNoteGravity?: boolean; tailCoordinates?: Vec2; color?: Vec3 | Vec4; animation?: ObjectAnimProps };

export type RawMapJSON = {
	version: "3.2.0";
	bpmEvents: { b: number; m: number }[];
	rotationEvents: { b: number; e: number; r: number }[];
	colorNotes: { b: number; x: number; y: number; c: number; d: number; a: number; customData?: NoteCustomProps }[];
	bombNotes: { b: number; x: number; y: number; customData?: NoteCustomProps }[];
	obstacles: {
		b: number;
		x: number;
		y: number;
		d: number;
		w: number;
		h: number;
		customData?: { size?: Vec3; animation?: ObjectAnimProps; coordinates?: Vec2; worldRotation?: Vec3; localRotation?: Vec3; noteJumpMovementSpeed?: number; noteJumpStartBeatOffset?: number; uninteractable?: boolean; color?: Vec3 | Vec4 };
	}[];
	sliders: { b: number; c: number; x: number; y: number; d: number; mu: number; tb: number; tx: number; ty: number; tc: number; tmu: number; m: number; customData?: SliderCustomProps }[];
	burstSliders: { b: number; x: number; y: number; c: number; d: number; tb: number; tx: number; ty: number; sc: number; s: number; customData?: SliderCustomProps }[];
	waypoints: [];
	basicBeatmapEvents: {
		b: number;
		et: number;
		i: number;
		f: number;
		customData?: { lightID?: number | number[]; color: Vec3 | Vec4; easing?: Easing; lerpType?: "HSV" | "RGB"; lockRotation?: boolean; speed?: number; direction?: number; nameFilter?: string; rotation?: number; step?: number; prop?: number };
	}[];
	colorBoostBeatmapEvents: { b: number; o: boolean }[];
	lightColorEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; r: number; t: number; b: number; i: number; e: { b: number; i: number; c: number; s: number; f: number }[] }[] }[];
	lightRotationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; l: number; r: number; o: number }[] }[] }[];
	lightTranslationEventBoxGroups: { b: number; g: number; e: { f: FilterObject; w: number; d: number; s: number; t: number; b: number; i: number; a: number; r: number; l: { b: number; p: number; e: number; t: number }[] }[] }[];
	basicEventTypesWithKeywords: {};
	useNormalEventsAsCompatibleEvents: boolean;
	customData?: { customEvents?: { b: number; t: CustomEventNames; d: TrackAnimProps | PathAnimProps | TrackParentProps | PlayerToTrackProps | ComponentAnimProps }[]; environment?: EnvironmentObjectJSON[]; materials?: Record<any, GeometryMaterialJSON> };
};

export class BeatMap {
	private map: Record<any, any> = {
		version: "3.2.0",
		bpmEvents: [],
		rotationEvents: [],
		colorNotes: [],
		bombNotes: [],
		obstacles: [],
		sliders: [],
		burstSliders: [],
		waypoints: [],
		basicBeatmapEvents: [],
		colorBoostBeatmapEvents: [],
		lightColorEventBoxGroups: [],
		lightRotationEventBoxGroups: [],
		lightTranslationEventBoxGroups: [],
		basicEventTypesWithKeywords: {},
		useNormalEventsAsCompatibleEvents: false,
		customData: {}
	};
	constructor(public readonly inputDiff: DiffNames = "ExpertStandard", public readonly outputDiff: DiffNames = "ExpertPlusStandard") {}
}
