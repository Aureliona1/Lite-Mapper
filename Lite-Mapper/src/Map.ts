// deno-lint-ignore-file no-explicit-any
import { CEToJSON, JSONToCE } from "./CustomEvents.ts";
import { copy, copyToDir, decimals, jsonPrune, LMCache, LMLog, universalComparison } from "./Functions.ts";
import { LightEvent } from "./Lights.ts";
import { Bomb, Chain, Note, Wall, Arc, Bookmark } from "./Objects.ts";
import { optimizeMaterials } from "./Optimizers.ts";
import { V3MapJSON, ClassMap, DiffNames, HeckSettings, InfoJSON } from "./Types.ts";
import { LMUpdateCheck } from "./UpdateChecker.ts";

export let currentDiff: BeatMap,
	start = 0;

export class BeatMap {
	private internalMap: ClassMap = {
		version: "3.3.0",
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
		vfxEventBoxGroups: [],
		_fxEventsCollection: {
			_fl: [],
			_il: []
		},
		customData: { environment: [], customEvents: [], materials: {}, fakeBombNotes: [], fakeBurstSliders: [], fakeColorNotes: [], fakeObstacles: [], bookmarks: [] }
	};
	info = new Info();
	/**
	 * Initialise a new map.
	 * @param inputDiff The input difficulty, this will be unmodified.
	 * @param outputDiff The output difficulty, this file will be overwritten by the input diff and whateever you add in your script.
	 * @param checkForUpdate Whether to run Lite-Mapper's update checker.
	 */
	constructor(public readonly inputDiff: DiffNames = "ExpertStandard", public readonly outputDiff: DiffNames = "ExpertPlusStandard", updateCheckFrequency: "Daily" | "Weekly" | "Never" = "Weekly") {
		start = Date.now();
		const rawMap: V3MapJSON = JSON.parse(Deno.readTextFileSync(inputDiff + ".dat"));

		this.internalMap = this.classify(rawMap);

		// Set current diff
		currentDiff = this;

		this.chromapperValues.bookmarksUseOfficialBPMEvents = this.internalMap.customData?.bookmarksUseOfficialBpmEvents ?? true;
		this.chromapperValues.mappingTime = this.internalMap.customData?.time ?? 0;

		// Check that the map is V3, we probably wouldn't get here anyway if the map was V2
		if (/[^3]\.\d\.\d/.test(this.version)) {
			LMLog(`Map not in V3 format, Lite-Mapper will not work for your map. Read here to learn about updating your map with ChroMapper: https://chromapper.atlassian.net/wiki/spaces/UG/pages/806682666/Frequently+Asked+Questions+FAQ#How-do-I-use-new-v3-features%3F`, "Error");
		}

		// Make sure the input and outputs actually exist
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
		if (updateCheckFrequency !== "Never") {
			const timeout = LMCache("Read", "updateCheckTimeout") ?? 0;
			if (Date.now() > timeout) {
				LMUpdateCheck();
				const timeOffset = updateCheckFrequency == "Daily" ? 1000 * 3600 * 24 : 1000 * 3600 * 24 * 7;
				LMCache("Write", "updateCheckTimeout", Date.now() + timeOffset);
			}
		}
	}

	private classify(raw: V3MapJSON) {
		const classMap: ClassMap = {
			version: "3.3.0",
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
			vfxEventBoxGroups: [],
			_fxEventsCollection: {
				_fl: [],
				_il: []
			},
			customData: { environment: [], customEvents: [], materials: {}, fakeBombNotes: [], fakeBurstSliders: [], fakeColorNotes: [], fakeObstacles: [], bookmarks: [] }
		};

		function deepPush<T extends Record<string, any>>(obj: T, arr: T[]) {
			const temp = copy(obj);
			jsonPrune(temp);
			arr.push(temp);
		}

		// Classify vanilla items
		raw.basicBeatmapEvents.forEach(e => {
			deepPush(new LightEvent().JSONToClass(e), classMap.basicBeatmapEvents);
		});
		raw.bombNotes.forEach(n => {
			deepPush(new Bomb().JSONToClass(n), classMap.bombNotes);
		});
		raw.burstSliders.forEach(n => {
			deepPush(new Chain().JSONToClass(n), classMap.burstSliders);
		});
		raw.colorNotes.forEach(n => {
			deepPush(new Note().JSONToClass(n), classMap.colorNotes);
		});
		raw.obstacles.forEach(n => {
			deepPush(new Wall().JSONToClass(n), classMap.obstacles);
		});
		raw.sliders.forEach(n => {
			deepPush(new Arc().JSONToClass(n), classMap.sliders);
		});

		// Check for custom data
		if (raw.customData) {
			if (raw.customData.customEvents) {
				raw.customData.customEvents.forEach(n => {
					deepPush(JSONToCE(n), classMap.customData!.customEvents!);
				});
			}
			if (raw.customData.environment) {
				classMap.customData!.environment! = raw.customData.environment;
			}
			if (raw.customData.fakeBombNotes) {
				raw.customData.fakeBombNotes.forEach(n => {
					deepPush(new Bomb().JSONToClass(n), classMap.customData!.fakeBombNotes!);
				});
			}
			if (raw.customData.fakeBurstSliders) {
				raw.customData.fakeBurstSliders.forEach(n => {
					deepPush(new Chain().JSONToClass(n), classMap.customData!.fakeBurstSliders!);
				});
			}
			if (raw.customData.fakeColorNotes) {
				raw.customData.fakeColorNotes.forEach(n => {
					deepPush(new Note().JSONToClass(n), classMap.customData!.fakeColorNotes!);
				});
			}
			if (raw.customData.fakeObstacles) {
				raw.customData.fakeObstacles.forEach(n => {
					deepPush(new Wall().JSONToClass(n), classMap.customData!.fakeObstacles!);
				});
			}
			if (raw.customData.bookmarks) {
				raw.customData.bookmarks.forEach(b => {
					deepPush(new Bookmark().JSONToClass(b), classMap.customData!.bookmarks!);
				});
			}
			if (raw.customData.time) {
				classMap.customData!.time = raw.customData.time;
			}
			if (raw.customData.bookmarksUseOfficialBpmEvents) {
				classMap.customData!.bookmarksUseOfficialBpmEvents = raw.customData.bookmarksUseOfficialBpmEvents;
			}
			if (raw.customData.materials) {
				classMap.customData!.materials = raw.customData.materials;
			}
		}

		// Pass over direct values
		classMap.version = raw.version;
		classMap.bpmEvents = raw.bpmEvents;
		classMap.basicEventTypesWithKeywords = raw.basicEventTypesWithKeywords;
		classMap.colorBoostBeatmapEvents = raw.colorBoostBeatmapEvents;
		classMap.lightColorEventBoxGroups = raw.lightColorEventBoxGroups;
		classMap.lightRotationEventBoxGroups = raw.lightRotationEventBoxGroups;
		classMap.lightTranslationEventBoxGroups = raw.lightTranslationEventBoxGroups;
		classMap.rotationEvents = raw.rotationEvents;
		classMap.useNormalEventsAsCompatibleEvents = raw.useNormalEventsAsCompatibleEvents;
		classMap._fxEventsCollection = raw._fxEventsCollection;
		classMap.vfxEventBoxGroups = raw.vfxEventBoxGroups;
		classMap.waypoints = raw.waypoints;

		return classMap;
	}

	/**
	 * Add a mod suggestion to the map.
	 * @param mod The mod to suggest.
	 */
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

	/**
	 * Add a mod requirement to the map.
	 * @param mod The mod requirement to add.
	 */
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
		return this.internalMap.version;
	}

	set basicEventTypesWithKeywords(x) {
		this.internalMap.basicEventTypesWithKeywords = x;
	}
	get basicEventTypesWithKeywords() {
		return this.internalMap.basicEventTypesWithKeywords;
	}

	set bpmEvents(x) {
		this.internalMap.bpmEvents = x;
	}
	get bpmEvents() {
		return this.internalMap.bpmEvents;
	}

	set rotationEvents(x) {
		this.internalMap.rotationEvents = x;
	}
	get rotationEvents() {
		return this.internalMap.rotationEvents;
	}

	set notes(x) {
		this.internalMap.colorNotes = x;
	}
	get notes() {
		return this.internalMap.colorNotes;
	}

	set bombs(x) {
		this.internalMap.bombNotes = x;
	}
	get bombs() {
		return this.internalMap.bombNotes;
	}

	set walls(x) {
		this.internalMap.obstacles = x;
	}
	get walls() {
		return this.internalMap.obstacles;
	}

	set arcs(x) {
		this.internalMap.sliders = x;
	}
	get arcs() {
		return this.internalMap.sliders;
	}

	set chains(x) {
		this.internalMap.burstSliders = x;
	}
	get chains() {
		return this.internalMap.burstSliders;
	}

	set events(x) {
		this.internalMap.basicBeatmapEvents = x;
	}
	get events() {
		return this.internalMap.basicBeatmapEvents;
	}

	set colorBoostBeatmapEvents(x) {
		this.internalMap.colorBoostBeatmapEvents = x;
	}
	get colorBoostBeatmapEvents() {
		return this.internalMap.colorBoostBeatmapEvents;
	}

	set lightColorEventBoxGroups(x) {
		this.internalMap.lightColorEventBoxGroups = x;
	}
	get lightColorEventBoxGroups() {
		return this.internalMap.lightColorEventBoxGroups;
	}

	set lightRotationEventBoxGroups(x) {
		this.internalMap.lightRotationEventBoxGroups = x;
	}
	get lightRotationEventBoxGroups() {
		return this.internalMap.lightRotationEventBoxGroups;
	}

	set lightTranslationEventBoxGroups(x) {
		this.internalMap.lightTranslationEventBoxGroups = x;
	}
	get lightTranslationEventBoxGroups() {
		return this.internalMap.lightTranslationEventBoxGroups;
	}

	set vfxEventBoxGroups(x) {
		this.internalMap.vfxEventBoxGroups = x;
	}
	get vfxEventBoxGroups() {
		return this.internalMap.vfxEventBoxGroups;
	}

	set floatFxEvents(x) {
		this.internalMap._fxEventsCollection._fl = x;
	}
	get floatFxEvents() {
		return this.internalMap._fxEventsCollection._fl;
	}

	set integerFxEvents(x) {
		this.internalMap._fxEventsCollection._il = x;
	}
	get integerFxEvents() {
		return this.internalMap._fxEventsCollection._il;
	}

	set customData(x) {
		this.internalMap.customData = x;
	}
	get customData() {
		return this.internalMap.customData ?? {};
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

	set bookmarks(x) {
		this.customData.bookmarks = x;
	}
	get bookmarks() {
		return this.customData.bookmarks ?? [];
	}

	readonly chromapperValues = {
		mappingTime: 0,
		bookmarksUseOfficialBPMEvents: true
	};

	set useNormalEventsAsCompatibleEvents(x) {
		this.internalMap.useNormalEventsAsCompatibleEvents = x;
	}
	get useNormalEventsAsCompatibleEvents() {
		return this.internalMap.useNormalEventsAsCompatibleEvents;
	}

	/**
	 * Optimizer settings.
	 *
	 * Currently supports:
	 *
	 * * `precision` -  Decimal rounding (Defualt - 5).
	 * * `materials` - Material optimization (Default - true)
	 */
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
		const classMap = this.classify(input);

		this.bpmEvents.push(...classMap.bpmEvents);
		this.events.push(...classMap.basicBeatmapEvents);
		this.floatFxEvents.push(...classMap._fxEventsCollection._fl);
		this.integerFxEvents.push(...classMap._fxEventsCollection._il);
		this.bombs.push(...classMap.bombNotes);
		this.chains.push(...classMap.burstSliders);
		this.colorBoostBeatmapEvents.push(...classMap.colorBoostBeatmapEvents);
		this.notes.push(...classMap.colorNotes);
		this.lightColorEventBoxGroups.push(...classMap.lightColorEventBoxGroups);
		this.lightRotationEventBoxGroups.push(...classMap.lightRotationEventBoxGroups);
		this.lightTranslationEventBoxGroups.push(...classMap.lightTranslationEventBoxGroups);
		this.walls.push(...classMap.obstacles);
		this.rotationEvents.push(...classMap.rotationEvents);
		this.arcs.push(...classMap.sliders);
		this.useNormalEventsAsCompatibleEvents = classMap.useNormalEventsAsCompatibleEvents;
		this.vfxEventBoxGroups.push(...classMap.vfxEventBoxGroups);
		this.internalMap.waypoints.push(...classMap.waypoints);

		if (classMap.customData) {
			if (classMap.customData.bookmarks) {
				this.bookmarks.push(...classMap.customData.bookmarks);
			}
			if (classMap.customData.bookmarksUseOfficialBpmEvents !== undefined) {
				this.chromapperValues.bookmarksUseOfficialBPMEvents = classMap.customData.bookmarksUseOfficialBpmEvents;
			}
			if (classMap.customData.time !== undefined) {
				this.chromapperValues.mappingTime += classMap.customData.time;
			}
			if (classMap.customData.customEvents) {
				this.customEvents.push(...classMap.customData.customEvents);
			}
			if (classMap.customData.environment) {
				this.environments.push(...classMap.customData.environment);
			}
			if (classMap.customData.fakeBombNotes) {
				this.fakeBombs.push(...classMap.customData.fakeBombNotes);
			}
			if (classMap.customData.fakeBurstSliders) {
				this.fakeChains.push(...classMap.customData.fakeBurstSliders);
			}
			if (classMap.customData.fakeColorNotes) {
				this.fakeNotes.push(...classMap.customData.fakeColorNotes);
			}
			if (classMap.customData.fakeObstacles) {
				this.fakeWalls.push(...classMap.customData.fakeObstacles);
			}
			if (classMap.customData.materials) {
				Object.keys(classMap.customData.materials).forEach(m => {
					this.materials[m] = classMap.customData!.materials![m];
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
		const rawMap: V3MapJSON = {
			version: "3.3.0",
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
			vfxEventBoxGroups: [],
			_fxEventsCollection: {
				_fl: [],
				_il: []
			},
			customData: {}
		};
		if (this.optimize.materials) {
			optimizeMaterials();
		}
		rawMap.customData!.fakeBombNotes ??= [];
		rawMap.customData!.fakeBurstSliders ??= [];
		rawMap.customData!.fakeColorNotes ??= [];
		rawMap.customData!.fakeObstacles ??= [];
		rawMap.customData!.customEvents ??= [];
		rawMap.customData!.bookmarks ??= [];
		this.notes.forEach(n => {
			jsonPrune(n);
			rawMap.colorNotes.push(n.return());
		});
		this.bombs.forEach(n => {
			jsonPrune(n);
			rawMap.bombNotes.push(n.return());
		});
		this.walls.forEach(n => {
			jsonPrune(n);
			rawMap.obstacles.push(n.return());
		});
		this.arcs.forEach(n => {
			jsonPrune(n);
			rawMap.sliders.push(n.return());
		});
		this.chains.forEach(n => {
			jsonPrune(n);
			rawMap.burstSliders.push(n.return());
		});
		this.fakeNotes.forEach(n => {
			jsonPrune(n);
			rawMap.customData?.fakeColorNotes?.push(n.return());
		});
		this.fakeBombs.forEach(n => {
			jsonPrune(n);
			rawMap.customData?.fakeBombNotes?.push(n.return());
		});
		this.fakeWalls.forEach(n => {
			jsonPrune(n);
			rawMap.customData?.fakeObstacles?.push(n.return());
		});
		this.fakeChains.forEach(n => {
			jsonPrune(n);
			rawMap.customData?.fakeBurstSliders?.push(n.return());
		});
		this.events.forEach(n => {
			jsonPrune(n);
			rawMap.basicBeatmapEvents.push(n.return());
		});
		this.customEvents?.forEach(n => {
			jsonPrune(n);
			rawMap.customData?.customEvents?.push(CEToJSON(n));
		});
		this.bookmarks.forEach(b => {
			jsonPrune(b);
			rawMap.customData?.bookmarks?.push(b.return());
		});

		rawMap.basicEventTypesWithKeywords = this.basicEventTypesWithKeywords;
		rawMap.bpmEvents = this.bpmEvents;
		rawMap.colorBoostBeatmapEvents = this.colorBoostBeatmapEvents;
		rawMap.customData!.environment = this.environments;
		rawMap.customData!.materials = this.materials;
		rawMap.lightColorEventBoxGroups = this.lightColorEventBoxGroups;
		rawMap.lightRotationEventBoxGroups = this.lightRotationEventBoxGroups;
		rawMap.lightTranslationEventBoxGroups = this.lightTranslationEventBoxGroups;
		rawMap.rotationEvents = this.rotationEvents;
		rawMap.useNormalEventsAsCompatibleEvents = this.useNormalEventsAsCompatibleEvents;
		rawMap._fxEventsCollection = {
			_fl: this.floatFxEvents,
			_il: this.integerFxEvents
		};
		rawMap.vfxEventBoxGroups = this.vfxEventBoxGroups;
		jsonPrune(rawMap.customData!);

		Deno.writeTextFileSync(this.outputDiff + ".dat", JSON.stringify(decimals(rawMap, this.optimize.precision), null, formatJSON ? 4 : undefined));
		if (this.info.isModified) {
			this.info.save();
		}
		LMLog("Map saved...");
		if (copyMapTo) {
			copyToDir(copyMapTo);
		}
	}
}

class Info {
	raw: InfoJSON;
	/**
	 * Initialise the info file reader.
	 */
	constructor() {
		try {
			this.raw = JSON.parse(Deno.readTextFileSync("info.dat"));
		} catch (e) {
			LMLog("Error reading info file:\n" + e, "Error");
			LMLog("Writing temporary fallback info file...");
			this.raw = {
				_version: "2.0.0",
				_songName: "",
				_songSubName: "",
				_songAuthorName: "",
				_levelAuthorName: "",
				_beatsPerMinute: 100,
				_shuffle: 0,
				_shufflePeriod: 0.5,
				_previewStartTime: 0,
				_previewDuration: 10,
				_songFilename: "song.ogg",
				_coverImageFilename: "cover.jpg",
				_environmentName: "DefaultEnvironment",
				_allDirectionsEnvironmentName: "GlassDesertEnvironment",
				_songTimeOffset: 0,
				_difficultyBeatmapSets: [
					{
						_beatmapCharacteristicName: "Standard",
						_difficultyBeatmaps: [
							{
								_difficulty: "Expert",
								_difficultyRank: 7,
								_beatmapFilename: "ExpertStandard.dat",
								_noteJumpMovementSpeed: 16,
								_noteJumpStartBeatOffset: 0
							},
							{
								_difficulty: "ExpertPlus",
								_difficultyRank: 9,
								_beatmapFilename: "ExpertPlusStandard.dat",
								_noteJumpMovementSpeed: 16,
								_noteJumpStartBeatOffset: 0
							}
						]
					}
				]
			};
			this.save();
			LMLog("Fallback info.dat written...\n\x1b[38;2;255;0;0mIMPORTANT: Save you map in a map editor and fill out required info fields!\nYour map probably will not load in-game until you do this!\x1b[0m");
		}
	}
	get isModified() {
		return !universalComparison(JSON.parse(Deno.readTextFileSync("info.dat")), this.raw);
	}
	/**
	 * Write to the info file.
	 */
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
