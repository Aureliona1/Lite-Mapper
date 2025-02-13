// deno-lint-ignore-file no-explicit-any
import { LM_CONST } from "./Consts.ts";
import { CEToJSON, JSONToCE } from "./CustomEvents.ts";
import { copy, copyToDir, decimals, hex2Rgba, jsonPrune, LMCache, LMLog, rgba2Obj, universalComparison } from "./Functions.ts";
import { LightEvent } from "./Lights.ts";
import { Arc, Bomb, Bookmark, Chain, Note, Wall } from "./Objects.ts";
import { optimizeMaterials } from "./Optimizers.ts";
import { ClassMap, DiffNames, HeckSettings, V2InfoBeatmap, V2InfoJSON, V3MapJSON, V4InfoJSON } from "./Types.ts";
import { LMUpdateCheck } from "./UpdateChecker.ts";

export let currentDiff: BeatMap,
	start = 0;

export class BeatMapParser {
	/**
	 * Convert raw V3JSON to a classmap.
	 * @param raw The json to import.
	 */
	static classify(raw: V3MapJSON) {
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
	 * Convert a classified map into valid BeatMapV3 json.
	 * @param classMap The map object.
	 */
	static JSONify(classMap: ClassMap) {
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
			}
		};

		classMap.colorNotes.forEach(n => {
			jsonPrune(n);
			rawMap.colorNotes.push(n.return());
		});
		classMap.bombNotes.forEach(n => {
			jsonPrune(n);
			rawMap.bombNotes.push(n.return());
		});
		classMap.obstacles.forEach(n => {
			jsonPrune(n);
			rawMap.obstacles.push(n.return());
		});
		classMap.sliders.forEach(n => {
			jsonPrune(n);
			rawMap.sliders.push(n.return());
		});
		classMap.burstSliders.forEach(n => {
			jsonPrune(n);
			rawMap.burstSliders.push(n.return());
		});
		classMap.basicBeatmapEvents.forEach(n => {
			jsonPrune(n);
			rawMap.basicBeatmapEvents.push(n.return());
		});

		if (classMap.customData) {
			rawMap.customData = { fakeBombNotes: [], fakeBurstSliders: [], fakeColorNotes: [], fakeObstacles: [], bookmarks: [], customEvents: [], environment: [], materials: {} };
			if (classMap.customData.fakeColorNotes) {
				classMap.customData.fakeColorNotes.forEach(n => {
					jsonPrune(n);
					rawMap.customData!.fakeColorNotes!.push(n.return());
				});
			}
			if (classMap.customData.fakeBombNotes) {
				classMap.customData.fakeBombNotes.forEach(n => {
					jsonPrune(n);
					rawMap.customData!.fakeBombNotes!.push(n.return());
				});
			}
			if (classMap.customData.fakeObstacles) {
				classMap.customData.fakeObstacles.forEach(n => {
					jsonPrune(n);
					rawMap.customData!.fakeObstacles!.push(n.return());
				});
			}
			if (classMap.customData.fakeBurstSliders) {
				classMap.customData.fakeBurstSliders.forEach(n => {
					jsonPrune(n);
					rawMap.customData!.fakeBurstSliders!.push(n.return());
				});
			}
			if (classMap.customData.customEvents) {
				classMap.customData.customEvents.forEach(n => {
					jsonPrune(n);
					rawMap.customData!.customEvents!.push(CEToJSON(n));
				});
			}
			if (classMap.customData.bookmarks) {
				classMap.customData.bookmarks.forEach(b => {
					jsonPrune(b);
					rawMap.customData!.bookmarks!.push(b.return());
				});
			}
			if (classMap.customData.environment) {
				rawMap.customData.environment = classMap.customData.environment;
			}
			if (classMap.customData.materials) {
				rawMap.customData.materials = classMap.customData.materials;
			}
			if (classMap.customData.bookmarksUseOfficialBpmEvents !== undefined) {
				rawMap.customData.bookmarksUseOfficialBpmEvents = classMap.customData.bookmarksUseOfficialBpmEvents;
			}
			if (classMap.customData.time) {
				rawMap.customData.time = classMap.customData.time;
			}
		}

		rawMap.basicEventTypesWithKeywords = classMap.basicEventTypesWithKeywords;
		rawMap.bpmEvents = classMap.bpmEvents;
		rawMap.colorBoostBeatmapEvents = classMap.colorBoostBeatmapEvents;
		rawMap.lightColorEventBoxGroups = classMap.lightColorEventBoxGroups;
		rawMap.lightRotationEventBoxGroups = classMap.lightRotationEventBoxGroups;
		rawMap.lightTranslationEventBoxGroups = classMap.lightTranslationEventBoxGroups;
		rawMap.rotationEvents = classMap.rotationEvents;
		rawMap.useNormalEventsAsCompatibleEvents = classMap.useNormalEventsAsCompatibleEvents;
		rawMap._fxEventsCollection = classMap._fxEventsCollection;
		rawMap.vfxEventBoxGroups = classMap.vfxEventBoxGroups;
		jsonPrune(rawMap.customData!);

		return rawMap;
	}
}

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

		this.internalMap = BeatMapParser.classify(rawMap);

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
		const classMap = BeatMapParser.classify(input);

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
		if (this.optimize.materials) {
			optimizeMaterials();
		}
		const rawMap = BeatMapParser.JSONify(this.internalMap);
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
	static v4ToV2(v4: V4InfoJSON): V2InfoJSON {
		const v2: V2InfoJSON = copy(LM_CONST.V2_INFO_FALLBACK);
		v2._songName = v4.song.title;
		v2._songSubName = v4.song.subTitle;
		v2._songAuthorName = v4.song.author;
		v2._beatsPerMinute = v4.audio.bpm;
		v2._previewDuration = v4.audio.previewDuration;
		v2._previewStartTime = v4.audio.previewStartTime;
		v2._songFilename = v4.audio.audioDataFilename;
		v2._coverImageFilename = v4.coverImageFilename;
		v2._environmentName = v4.environmentNames[0];
		v2._environmentNames = copy(v4.environmentNames);
		v2._colorSchemes = v4.colorSchemes.map(x => {
			return {
				useOverride: x.useOverride,
				colorScheme: {
					colorSchemeId: x.colorSchemeName,
					saberAColor: rgba2Obj(hex2Rgba(x.saberAColor)),
					saberBColor: rgba2Obj(hex2Rgba(x.saberBColor)),
					obstaclesColor: rgba2Obj(hex2Rgba(x.obstaclesColor)),
					environmentColor0: rgba2Obj(hex2Rgba(x.environmentColor0)),
					environmentColor1: rgba2Obj(hex2Rgba(x.environmentColor1)),
					environmentColor0Boost: rgba2Obj(hex2Rgba(x.environmentColor0Boost)),
					environmentColor1Boost: rgba2Obj(hex2Rgba(x.environmentColor1Boost))
				}
			};
		});
		if (v4.customData) {
			v2._customData = copy(v4.customData);
		}

		// Get authors from beatmaps
		const authors: string[] = [];

		// Add beatmaps
		v4.difficultyBeatmaps.forEach(bm => {
			authors.push(...bm.beatmapAuthors.lighters, ...bm.beatmapAuthors.mappers);
			const translatedDiff: V2InfoBeatmap = {
				_difficulty: bm.difficulty,
				_difficultyRank: LM_CONST.difficultyRankMap.get(bm.difficulty),
				_beatmapFilename: bm.beatmapDataFilename,
				_noteJumpMovementSpeed: bm.noteJumpMovementSpeed,
				_noteJumpStartBeatOffset: bm.noteJumpStartBeatOffset,
				_environmentNameIdx: bm.environmentNameIdx
			};
			if (bm.beatmapColorSchemeIdx) {
				translatedDiff._beatmapColorSchemeIdx = bm.beatmapColorSchemeIdx;
			}
			if (bm.customData) {
				translatedDiff._customData = bm.customData;
			}
			// Check if we already have this characteristic
			let i = 0;
			for (; i < v2._difficultyBeatmapSets.length && bm.characteristic !== v2._difficultyBeatmapSets[i]._beatmapCharacteristicName; i++);
			if (v2._difficultyBeatmapSets[i]._beatmapCharacteristicName !== bm.characteristic) {
				// Add it if we don't
				v2._difficultyBeatmapSets.push({ _beatmapCharacteristicName: bm.characteristic, _difficultyBeatmaps: [translatedDiff] });
			} else {
				// Add to the char if we do
				v2._difficultyBeatmapSets[i]._difficultyBeatmaps.push(translatedDiff);
			}
		});

		// Add the authors
		v2._levelAuthorName = [...new Set(authors)].join(", ");

		return v2;
	}

	private infoVersion: number = 0;
	raw: V2InfoJSON = copy(LM_CONST.V2_INFO_FALLBACK);
	/**
	 * Initialise the info file reader.
	 */
	constructor() {
		let inputRaw: Record<string, any>;
		try {
			inputRaw = JSON.parse(Deno.readTextFileSync("info.dat"));
		} catch (e) {
			LMLog("Error reading info file:\n" + e, "Error");
			LMLog("Writing temporary fallback info file...");
			inputRaw = copy(LM_CONST.V2_INFO_FALLBACK);
			this.save();
			LMLog("Fallback info.dat written...\n\x1b[38;2;255;0;0mIMPORTANT: Save you map in a map editor and fill out required info fields!\nYour map probably will not load in-game until you do this!\x1b[0m");
		}
		if (inputRaw.version) {
			if (/4\.\d\.\d/.test(inputRaw.version)) {
				LMLog("Your info file is in version 4, Lite-Mapper only has very basic support for V4 info files, you will be able to read some properties from the info file however any changes will not be saved!", "Warning");
				this.raw = Info.v4ToV2(inputRaw as V4InfoJSON);
				this.infoVersion = 4;
			} else {
				LMLog("ERROR: Info file contains an unsupported version, please adjust your info file to version 2.1.0 for full support.\nAny info processes will not work!", "Error");
			}
		} else if (inputRaw._version) {
			if (/2\.\d\.\d/.test(inputRaw._version)) {
				this.raw = inputRaw as V2InfoJSON;
				this.infoVersion = 2;

				// Make sure we are using the templated format
				if (!this.raw._environmentNames) {
					this.raw._environmentNames = [this.raw._environmentName];
					this.raw._difficultyBeatmapSets.forEach(set => {
						set._difficultyBeatmaps.forEach(bm => {
							bm._environmentNameIdx = 0;
						});
					});
				}

				// Enforce newer version
				this.raw._version = "2.1.0";
			} else {
				LMLog("ERROR: Info file contains an unsupported version, please adjust your info file to version 2.1.0 for full support.\nAny info processes will not work!", "Error");
			}
		} else {
			LMLog("ERROR: Unable to read info file version!\nCheck that the file is not corrupted. Info processes will not work as intended.", "Error");
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
		if (this.infoVersion == 2) {
			if (this.isModified) {
				Deno.writeTextFileSync("info.dat", JSON.stringify(this.raw, null, 4));
			}
		}
	}
}
