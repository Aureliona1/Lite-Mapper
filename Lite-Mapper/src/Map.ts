import { jsonDecimals } from "./LiteMapper.ts";
import { Arc, Bomb, CEToJSON, Chain, DiffNames, HeckSettings, JSONToCE, LMLog, LightEvent, Note, V3MapJSON, Wall, classMap, copyToDir, infoJSON, jsonPrune, optimizeMaterials } from "./LiteMapper.ts";
import { LMUpdateCheck } from "./UpdateChecker.ts";

export let currentDiff: BeatMap,
	start = 0;

export class BeatMap {
	private rawMap: V3MapJSON = {
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
		this.map.version = this.rawMap.version;
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
		if (/[^3]\.\d\.\d/.test(this.version)) {
			LMLog(`Map not in V3 format, Lite-Mapper will not work for your map. Read here to learn about updating your map with ChroMapper: https://chromapper.atlassian.net/wiki/spaces/UG/pages/806682666/Frequently+Asked+Questions+FAQ#How-do-I-use-new-v3-features%3F`, "Error");
		}
		let inExists = false,
			outExists = false;
		this.info.raw._difficultyBeatmapSets.forEach(x => {
			x._difficultyBeatmaps.forEach(y => {
				if (y._beatmapFilename == inputDiff + ".dat") {
					inExists = true;
				}
				if (y._beatmapFilename == outputDiff + ".dat") {
					outExists = true;
				}
			});
		});
		if (!inExists) {
			LMLog(`Input difficulty ${inputDiff} does not exist in info.dat, make sure to save your info in Chromapper or MMA2 before continuing...`, "Warning");
		}
		if (!outExists) {
			LMLog(`Output difficulty ${outputDiff} does not exist in info.dat, make sure to save your info in Chromapper or MMA2 before continuing...`, "Warning");
		}
		if (checkForUpdate) {
			LMUpdateCheck();
		}
	}

	// Hidden info that only initialises if it gets used, to prevent git file changes.
	private trueInfo: Info | undefined = undefined;

	get info() {
		return this.trueInfo ?? new Info();
	}
	set info(x: Info) {
		this.trueInfo = x;
	}

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
		return this.map.customData ?? {};
	}

	set customEvents(x) {
		this.customData.customEvents = x;
	}
	get customEvents() {
		return this.customData.customEvents ?? [];
	}

	set environments(x) {
		this.customData.environment = x;
	}
	get environments() {
		return this.customData.environment ?? [];
	}

	set materials(x) {
		this.customData.materials = x;
	}
	get materials() {
		return this.customData.materials ?? {};
	}

	set fakeNotes(x) {
		this.customData.fakeColorNotes = x;
	}
	get fakeNotes() {
		return this.customData.fakeColorNotes ?? [];
	}

	set fakeBombs(x) {
		this.customData.fakeBombNotes = x;
	}
	get fakeBombs() {
		return this.customData.fakeBombNotes ?? [];
	}

	set fakeWalls(x) {
		this.customData.fakeObstacles = x;
	}
	get fakeWalls() {
		return this.customData.fakeObstacles ?? [];
	}

	set fakeChains(x) {
		this.customData.fakeBurstSliders = x;
	}
	get fakeChains() {
		return this.customData.fakeBurstSliders ?? [];
	}

	set useNormalEventsAsCompatibleEvents(x) {
		this.map.useNormalEventsAsCompatibleEvents = x;
	}
	get useNormalEventsAsCompatibleEvents() {
		return this.map.useNormalEventsAsCompatibleEvents;
	}

	optimize = {
		materials: true,
		precision: 5
	};

	get settings() {
		this.info.raw._difficultyBeatmapSets.forEach(x => {
			x._difficultyBeatmaps.forEach(y => {
				if (y._beatmapFilename == this.outputDiff + ".dat") {
					y._customData ??= {};
					return (y._customData["_settings"] ?? {}) as HeckSettings;
				}
			});
		});
		return {} as HeckSettings;
	}

	set settings(x) {
		this.info.raw._difficultyBeatmapSets.forEach(a =>
			a._difficultyBeatmaps.forEach(y => {
				if (y._beatmapFilename == this.outputDiff + ".dat") {
					y._customData ??= {};
					y._customData["_settings"] = x;
					jsonPrune(y._customData);
				}
			})
		);
	}

	/**
	 * Adds elements and objects from an additional difficulty file to your map.
	 * @param diff The name of the input difficulty to add elements from.
	 */
	addInputDiff(diff: DiffNames) {
		const input: V3MapJSON = JSON.parse(Deno.readTextFileSync(diff + ".dat"));
		input.basicBeatmapEvents.forEach(e => {
			new LightEvent().JSONToClass(e).push();
		});
		input.bombNotes.forEach(n => {
			new Bomb().JSONToClass(n).push();
		});
		input.burstSliders.forEach(n => {
			new Chain().JSONToClass(n).push();
		});
		input.colorNotes.forEach(n => {
			new Note().JSONToClass(n).push();
		});
		input.obstacles.forEach(n => {
			new Wall().JSONToClass(n).push();
		});
		input.sliders.forEach(n => {
			new Arc().JSONToClass(n).push();
		});
		if (input.customData) {
			if (input.customData.customEvents) {
				this.customEvents ??= [];
				input.customData.customEvents.forEach(n => {
					this.customEvents.push(JSONToCE(n));
				});
			}
			if (input.customData.environment) {
				this.environments = [...this.environments, ...input.customData.environment];
			}
			if (input.customData.fakeBombNotes) {
				input.customData.fakeBombNotes.forEach(n => {
					new Bomb().JSONToClass(n).push(true);
				});
			}
			if (input.customData.fakeBurstSliders) {
				input.customData.fakeBurstSliders.forEach(n => {
					new Chain().JSONToClass(n).push(true);
				});
			}
			if (input.customData.fakeColorNotes) {
				input.customData.fakeColorNotes.forEach(n => {
					new Note().JSONToClass(n).push(true);
				});
			}
			if (input.customData.fakeObstacles) {
				input.customData.fakeObstacles.forEach(n => {
					new Wall().JSONToClass(n).push(true);
				});
			}
		}
	}

	/**
	 * Save your map changes and write the output file.
	 * @param formatJSON Optional to format the json of the output (massively increases the file size).
	 * @param copyMapTo Optional directory to copy map contents to (useful when working outside of beat saber directory).
	 */
	save(formatJSON?: boolean, copyMapTo?: string) {
		if (this.optimize.materials) {
			optimizeMaterials();
		}
		this.rawMap.customData ??= {};
		this.rawMap.customData.fakeBombNotes ??= [];
		this.rawMap.customData.fakeBurstSliders ??= [];
		this.rawMap.customData.fakeColorNotes ??= [];
		this.rawMap.customData.fakeObstacles ??= [];
		this.rawMap.customData.customEvents ??= [];
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

		Deno.writeTextFileSync(this.outputDiff + ".dat", JSON.stringify(jsonDecimals(this.rawMap, this.optimize.precision), null, formatJSON ? 4 : undefined));
		if (this.trueInfo) {
			this.info.save();
		}
		LMLog("Map saved...");
		if (copyMapTo) {
			copyToDir(copyMapTo);
		}
	}
}

class Info {
	raw: infoJSON;
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
		Deno.writeTextFileSync("info.dat", JSON.stringify(this.raw, null, 4));
	}
}
