import { Arc, Bomb, CEToJSON, Chain, DiffNames, JSONToCE, LMLog, LightEvent, Note, RawMapJSON, Wall, classMap, infoJSON, jsonPrune, optimizeMaterials } from "./LiteMapper.ts";
import { LMUpdateCheck } from "./UpdateChecker.ts";

export let currentDiff: BeatMap,
	start = 0;

export class BeatMap {
	private rawMap: RawMapJSON = {
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
	map: classMap = {
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
		customData: { environment: [], customEvents: [], materials: {}, fakeBombNotes: [], fakeBurstSliders: [], fakeColorNotes: [], fakeObstacles: [] }
	};

	constructor(public readonly inputDiff: DiffNames = "ExpertStandard", public readonly outputDiff: DiffNames = "ExpertPlusStandard", checkForUpdate = true) {
		if (checkForUpdate) {
			LMUpdateCheck();
		}
		start = Date.now();
		this.rawMap = JSON.parse(Deno.readTextFileSync(inputDiff + ".dat"));
		this.rawMap.basicBeatmapEvents.forEach(e => {
			new LightEvent().JSONToClass(e).push();
		});
		this.rawMap.bombNotes.forEach(n => {
			new Bomb().JSONToClass(n).push();
		});
		this.rawMap.burstSliders.forEach(n => {
			new Chain().JSONToClass(n).push();
		});
		this.rawMap.colorNotes.forEach(n => {
			new Note().JSONToClass(n).push();
		});
		this.rawMap.obstacles.forEach(n => {
			new Wall().JSONToClass(n).push();
		});
		this.rawMap.sliders.forEach(n => {
			new Arc().JSONToClass(n).push();
		});
		if (this.rawMap.customData) {
			if (this.rawMap.customData.customEvents) {
				this.customEvents = [];
				this.rawMap.customData.customEvents.forEach(n => {
					this.customEvents?.push(JSONToCE(n));
				});
			}
			if (this.rawMap.customData.environment) {
				this.environments = this.rawMap.customData.environment;
			}
			if (this.rawMap.customData.fakeBombNotes) {
				this.rawMap.customData.fakeBombNotes.forEach(n => {
					new Bomb().JSONToClass(n).push(true);
				});
			}
			if (this.rawMap.customData.fakeBurstSliders) {
				this.rawMap.customData.fakeBurstSliders.forEach(n => {
					new Chain().JSONToClass(n).push(true);
				});
			}
			if (this.rawMap.customData.fakeColorNotes) {
				this.rawMap.customData.fakeColorNotes.forEach(n => {
					new Note().JSONToClass(n).push(true);
				});
			}
			if (this.rawMap.customData.fakeObstacles) {
				this.rawMap.customData.fakeObstacles.forEach(n => {
					new Wall().JSONToClass(n).push(true);
				});
			}
		}
		this.map.bpmEvents = this.rawMap.bpmEvents;
		this.map.basicEventTypesWithKeywords = this.rawMap.basicEventTypesWithKeywords;
		this.map.colorBoostBeatmapEvents = this.rawMap.colorBoostBeatmapEvents;
		this.map.lightColorEventBoxGroups = this.rawMap.lightColorEventBoxGroups;
		this.map.lightRotationEventBoxGroups = this.rawMap.lightRotationEventBoxGroups;
		this.map.lightTranslationEventBoxGroups = this.rawMap.lightTranslationEventBoxGroups;
		this.map.rotationEvents = this.rawMap.rotationEvents;
		this.map.useNormalEventsAsCompatibleEvents = this.rawMap.useNormalEventsAsCompatibleEvents;
		this.map.waypoints = this.rawMap.waypoints;
		currentDiff = this;
	}

	public info = new Info();

	suggest(mod: "Chroma" | "Cinema") {
		this.info.raw._difficultyBeatmapSets.forEach(x => {
			x._difficultyBeatmaps.forEach(y => {
				if (y._beatmapFilename == this.outputDiff + ".dat") {
					if (y._customData) {
						y._customData._suggestions.push(mod);
					} else {
						y._customData = {
							_suggestions: []
						};
						y._customData._suggestions.push(mod);
					}
				}
			});
		});
	}

	require(mod: "Chroma" | "Noodle Extensions") {
		this.info.raw._difficultyBeatmapSets.forEach(x => {
			x._difficultyBeatmaps.forEach(y => {
				if (y._beatmapFilename == this.outputDiff + ".dat") {
					if (y._customData) {
						if (!y._customData._requirements) {
							y._customData["_requirements"] = [];
						}
						y._customData._requirements.push(mod);
					} else {
						y._customData = {
							_requirements: []
						};
						y._customData._requirements.push(mod);
					}
				}
			});
		});
	}

	get version() {
		return this.map.version;
	}

	set basicEventTypesWithKeywords(x) {
		this.map.basicEventTypesWithKeywords = x;
	}
	get basicEventTypesWithKeywords() {
		return this.map.basicEventTypesWithKeywords;
	}

	set bpmEvents(x) {
		this.map.bpmEvents = x;
	}
	get bpmEvents() {
		return this.map.bpmEvents;
	}

	set rotationEvents(x) {
		this.map.rotationEvents = x;
	}
	get rotationEvents() {
		return this.map.rotationEvents;
	}

	set notes(x) {
		this.map.colorNotes = x;
	}
	get notes() {
		return this.map.colorNotes;
	}

	set bombs(x) {
		this.map.bombNotes = x;
	}
	get bombs() {
		return this.map.bombNotes;
	}

	set walls(x) {
		this.map.obstacles = x;
	}
	get walls() {
		return this.map.obstacles;
	}

	set arcs(x) {
		this.map.sliders = x;
	}
	get arcs() {
		return this.map.sliders;
	}

	set chains(x) {
		this.map.burstSliders = x;
	}
	get chains() {
		return this.map.burstSliders;
	}

	set events(x) {
		this.map.basicBeatmapEvents = x;
	}
	get events() {
		return this.map.basicBeatmapEvents;
	}

	set colorBoostBeatmapEvents(x) {
		this.map.colorBoostBeatmapEvents = x;
	}
	get colorBoostBeatmapEvents() {
		return this.map.colorBoostBeatmapEvents;
	}

	set lightColorEventBoxGroups(x) {
		this.map.lightColorEventBoxGroups = x;
	}
	get lightColorEventBoxGroups() {
		return this.map.lightColorEventBoxGroups;
	}

	set lightRotationEventBoxGroups(x) {
		this.map.lightRotationEventBoxGroups = x;
	}
	get lightRotationEventBoxGroups() {
		return this.map.lightRotationEventBoxGroups;
	}

	set lightTranslationEventBoxGroups(x) {
		this.map.lightTranslationEventBoxGroups = x;
	}
	get lightTranslationEventBoxGroups() {
		return this.map.lightTranslationEventBoxGroups;
	}

	set customData(x) {
		this.map.customData = x;
	}
	get customData() {
		return this.map.customData ? this.map.customData : {};
	}

	set customEvents(x) {
		this.customData.customEvents = x;
	}
	get customEvents() {
		return this.customData?.customEvents;
	}

	set environments(x) {
		this.customData.environment = x;
	}
	get environments() {
		return this.customData?.environment ? this.customData.environment : [];
	}

	set materials(x) {
		this.customData.materials = x;
	}
	get materials() {
		return this.customData?.materials ? this.customData.materials : {};
	}

	set fakeNotes(x) {
		this.customData.fakeColorNotes = x;
	}
	get fakeNotes() {
		return this.customData?.fakeColorNotes ? this.customData.fakeColorNotes : [];
	}

	set fakeBombs(x) {
		this.customData.fakeBombNotes = x;
	}
	get fakeBombs() {
		return this.customData?.fakeBombNotes ? this.customData.fakeBombNotes : [];
	}

	set fakeWalls(x) {
		this.customData.fakeObstacles = x;
	}
	get fakeWalls() {
		return this.customData?.fakeObstacles ? this.customData.fakeObstacles : [];
	}

	set fakeChains(x) {
		this.customData.fakeBurstSliders = x;
	}
	get fakeChains() {
		return this.customData?.fakeBurstSliders ? this.customData.fakeBurstSliders : [];
	}

	set useNormalEventsAsCompatibleEvents(x) {
		this.map.useNormalEventsAsCompatibleEvents = x;
	}
	get useNormalEventsAsCompatibleEvents() {
		return this.map.useNormalEventsAsCompatibleEvents;
	}
	/**
	 * Save your map changes and write the output file.
	 * @param format Optional to format the json of the output (massively increases the file size).
	 */
	save(optimizeMats = true, format?: boolean) {
		if (optimizeMats) {
			optimizeMaterials();
		}
		this.rawMap.customData ??= {};
		this.rawMap.customData.fakeBombNotes ??= [];
		this.rawMap.customData.fakeBurstSliders ??= [];
		this.rawMap.customData.fakeColorNotes ??= [];
		this.rawMap.customData.fakeObstacles ??= [];
		this.rawMap.customData.customEvents ??= [];
		if (!this.rawMap.customData.customEvents) {
			this.rawMap.customData.customEvents = [];
		}
		this.notes.forEach(n => {
			jsonPrune(n);
			this.rawMap.colorNotes.push(n.return());
		});
		this.bombs.forEach(n => {
			jsonPrune(n);
			this.rawMap.bombNotes.push(n.return());
		});
		this.walls.forEach(n => {
			jsonPrune(n);
			this.rawMap.obstacles.push(n.return());
		});
		this.arcs.forEach(n => {
			jsonPrune(n);
			this.rawMap.sliders.push(n.return());
		});
		this.chains.forEach(n => {
			jsonPrune(n);
			this.rawMap.burstSliders.push(n.return());
		});
		this.fakeNotes.forEach(n => {
			jsonPrune(n);
			this.rawMap.customData?.fakeColorNotes?.push(n.return());
		});
		this.fakeBombs.forEach(n => {
			jsonPrune(n);
			this.rawMap.customData?.fakeBombNotes?.push(n.return());
		});
		this.fakeWalls.forEach(n => {
			jsonPrune(n);
			this.rawMap.customData?.fakeObstacles?.push(n.return());
		});
		this.fakeChains.forEach(n => {
			jsonPrune(n);
			this.rawMap.customData?.fakeBurstSliders?.push(n.return());
		});
		this.events.forEach(n => {
			jsonPrune(n);
			this.rawMap.basicBeatmapEvents.push(n.return());
		});
		this.customEvents?.forEach(n => {
			jsonPrune(n);
			this.rawMap.customData?.customEvents?.push(CEToJSON(n));
		});

		this.rawMap.basicEventTypesWithKeywords = this.basicEventTypesWithKeywords;
		this.rawMap.bpmEvents = this.bpmEvents;
		this.rawMap.colorBoostBeatmapEvents = this.colorBoostBeatmapEvents;
		this.rawMap.customData.environment = this.environments;
		this.rawMap.customData.materials = this.materials;
		this.rawMap.lightColorEventBoxGroups = this.lightColorEventBoxGroups;
		this.rawMap.lightRotationEventBoxGroups = this.lightRotationEventBoxGroups;
		this.rawMap.lightTranslationEventBoxGroups = this.lightTranslationEventBoxGroups;
		this.rawMap.rotationEvents = this.rotationEvents;
		this.rawMap.useNormalEventsAsCompatibleEvents = this.useNormalEventsAsCompatibleEvents;
		jsonPrune(this.rawMap.customData);

		Deno.writeTextFileSync(this.outputDiff + ".dat", JSON.stringify(this.rawMap, undefined, format ? 4 : undefined));
		this.info.save();
		LMLog("Map saved...");
	}
}

class Info {
	public raw: infoJSON;
	constructor() {
		this.raw = JSON.parse(Deno.readTextFileSync("info.dat"));
	}
	save() {
		if (this.raw._customData) {
			jsonPrune(this.raw._customData);
		}
		this.raw._difficultyBeatmapSets.forEach(bs => {
			bs._difficultyBeatmaps.forEach(d => {
				if (d._customData) {
					jsonPrune(d._customData);
				}
			});
		});
		Deno.writeTextFileSync("info.dat", JSON.stringify(this.raw, undefined, 4));
	}
}
