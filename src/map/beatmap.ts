import { compare, decimals, deepCopy, rgb } from "@aurellis/helpers";
import { V2_INFO_FALLBACK, V3_MAP_FALLBACK, difficultyRankMap } from "../core/internal.ts";
import type {
	BeatmapFxEvent,
	BpmEventJSON,
	ClassMap,
	ColorBoostEventJSON,
	ColorEventBoxGroupJSON,
	DiffName,
	GeometryMaterialJSON,
	HeckSettings,
	MapCustomData,
	RotationEventBoxGroupJSON,
	RotationEventJSON,
	TranslationEventBoxGroupJSON,
	V2InfoBeatmap,
	V2InfoJSON,
	V3MapJSON,
	V3ValidVersion,
	V4InfoJSON,
	VfxEventBoxGroupJSON
} from "../core/types.ts";
import { LMUpdateCheck } from "../core/update.ts";
import type { Arc } from "../gameplay/arc.ts";
import type { Bomb } from "../gameplay/bomb.ts";
import type { Chain } from "../gameplay/chain.ts";
import type { Note } from "../gameplay/note.ts";
import type { Wall } from "../gameplay/wall.ts";
import { LMCache, LMLog, copyToDir, hex2Rgba, jsonPrune, rgba2Obj } from "../utility/helpers.ts";
import { optimizeMaterials } from "../utility/optimize.ts";
import type { Bookmark } from "../visual/bookmark.ts";
import type { Environment } from "../visual/environment.ts";
import type { LightEvent } from "../visual/light.ts";
import type { HeckCustomEvent } from "./events/custom_event.ts";
import { BMJSON } from "./json.ts";

// deno-lint-ignore-file no-explicit-any
/**
 * The currently active difficulty.
 */
export let _currentDiff: BeatMap | null,
	/**
	 * The time (ms since epoch) of the start of this lm instance.
	 */
	lMInitTime = 0;

/**
 * Safely get the current diff.
 */
export function currentDiff(): BeatMap {
	if (!_currentDiff) throw new Error("You haven't opened any map file!\nPlease create a new BeatMap before trying to push objects!");
	return _currentDiff;
}

/**
 * A map, this should be the first thing you call when starting a Lite-Mapper project.
 */
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

	/**
	 * A link to the map's info file and related fields.
	 */
	info: Info = new Info();

	/**
	 * Initialise a new map.
	 * @param inputDiff The input difficulty, this will be unmodified.
	 * @param outputDiff The output difficulty, this file will be overwritten by the input diff and whateever you add in your script.
	 * @param checkForUpdate Whether to run Lite-Mapper's update checker.
	 */
	constructor(public readonly inputDiff: DiffName = "ExpertStandard", public readonly outputDiff: DiffName = "ExpertPlusStandard", updateCheckFrequency: "Daily" | "Weekly" | "Never" = "Weekly") {
		let rawMap: V3MapJSON = deepCopy(V3_MAP_FALLBACK);
		try {
			rawMap = JSON.parse(Deno.readTextFileSync(inputDiff + ".dat"));
		} catch (e) {
			LMLog(e, "Error", "MapHandler");
			LMLog("Ensure that you have selected the correct difficulty as your input difficulty, and make sure that the file exists...", "Warning", "MapHandler");
			LMLog("Writing empty map as fallback...", "Warning", "MapHandler");
			try {
				Deno.writeTextFileSync(inputDiff + ".dat", JSON.stringify(rawMap));
			} catch (e2) {
				LMLog(e2, "Error", "MapHandler");
				LMLog("Check the read and write permissions of your map folder and ensure that Lite-Mapper is being run with --allow-all.", "Error");
				Deno.exit(1);
			}
		}

		// Check the version before attempting to classify
		if (!/3\.\d+\.\d+/.test(rawMap.version)) {
			LMLog(
				`Map not in V3 format, Lite-Mapper will not work for your map. Read here to learn about updating your map with ChroMapper: https://chromapper.atlassian.net/wiki/spaces/UG/pages/806682666/Frequently+Asked+Questions+FAQ#How-do-I-use-new-v3-features%3F`,
				"Error",
				"MapHandler"
			);
		}

		this.internalMap = BMJSON.classify(rawMap);

		this.chromapperValues.bookmarksUseOfficialBPMEvents = this.internalMap.customData?.bookmarksUseOfficialBpmEvents ?? true;
		this.chromapperValues.mappingTime = this.internalMap.customData?.time ?? 0;

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
			LMLog(`Input difficulty ${inputDiff} does not exist in info.dat, make sure to save your info in Chromapper or MMA2 before continuing...`, "Warning", "MapHandler");
		}
		if (!outExists) {
			LMLog(`Output difficulty ${outputDiff} does not exist in info.dat, make sure to save your info in Chromapper or MMA2 before continuing...`, "Warning", "MapHandler");
		}
		if (updateCheckFrequency !== "Never") {
			const timeout = LMCache("Read", "updateCheckTimeout") ?? 0;
			if (Date.now() > timeout) {
				LMUpdateCheck();
				const timeOffset = updateCheckFrequency == "Daily" ? 1000 * 3600 * 24 : 1000 * 3600 * 24 * 7;
				LMCache("Write", "updateCheckTimeout", Date.now() + timeOffset);
			}
		}

		// Stats
		LMLog(`${inputDiff} has been imported, map initialized...`);

		// Set current diff
		_currentDiff = this;
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

	/**
	 * The map version. Lite-Mapper only supports versions `3.x.x`.
	 */
	get version(): V3ValidVersion {
		return this.internalMap.version;
	}

	/**
	 * These are copyright protected events that trigger certain actions on specific environments. They are not officially documented anywhere, so use wisely.
	 */
	get basicEventTypesWithKeywords(): Record<string, unknown> | unknown {
		return this.internalMap.basicEventTypesWithKeywords;
	}
	set basicEventTypesWithKeywords(x: Record<string, unknown> | unknown) {
		this.internalMap.basicEventTypesWithKeywords = x;
	}

	/**
	 * All BPM changes.
	 */
	get bpmEvents(): BpmEventJSON[] {
		return this.internalMap.bpmEvents;
	}
	set bpmEvents(x: BpmEventJSON[]) {
		this.internalMap.bpmEvents = x;
	}

	/**
	 * All rotation events. (V3 system)
	 */
	get rotationEvents(): RotationEventJSON[] {
		return this.internalMap.rotationEvents;
	}
	set rotationEvents(x: RotationEventJSON[]) {
		this.internalMap.rotationEvents = x;
	}

	/**
	 * All map note objects.  (excl. fake notes)
	 */
	get notes(): Note[] {
		return this.internalMap.colorNotes;
	}
	set notes(x: Note[]) {
		this.internalMap.colorNotes = x;
	}

	/**
	 * All map bomb objects. (excl. fake bombs)
	 */
	get bombs(): Bomb[] {
		return this.internalMap.bombNotes;
	}
	set bombs(x: Bomb[]) {
		this.internalMap.bombNotes = x;
	}

	/**
	 * All map walls. (excl. fake walls)
	 */
	get walls(): Wall[] {
		return this.internalMap.obstacles;
	}
	set walls(x: Wall[]) {
		this.internalMap.obstacles = x;
	}

	/**
	 * All map arc objects.
	 */
	get arcs(): Arc[] {
		return this.internalMap.sliders;
	}
	set arcs(x: Arc[]) {
		this.internalMap.sliders = x;
	}

	/**
	 * All map chain objects. (excl. fake chains)
	 */
	get chains(): Chain[] {
		return this.internalMap.burstSliders;
	}
	set chains(x: Chain[]) {
		this.internalMap.burstSliders = x;
	}

	/**
	 * All classic light events.
	 */
	get events(): LightEvent[] {
		return this.internalMap.basicBeatmapEvents;
	}
	set events(x: LightEvent[]) {
		this.internalMap.basicBeatmapEvents = x;
	}

	/**
	 * All light boost events, these will have different effects depending on which environment they arte used on.
	 */
	get colorBoostBeatmapEvents(): ColorBoostEventJSON[] {
		return this.internalMap.colorBoostBeatmapEvents;
	}
	set colorBoostBeatmapEvents(x: ColorBoostEventJSON[]) {
		this.internalMap.colorBoostBeatmapEvents = x;
	}

	/**
	 * All light color events. (V3 system)
	 */
	get lightColorEventBoxGroups(): ColorEventBoxGroupJSON[] {
		return this.internalMap.lightColorEventBoxGroups;
	}
	set lightColorEventBoxGroups(x: ColorEventBoxGroupJSON[]) {
		this.internalMap.lightColorEventBoxGroups = x;
	}

	/**
	 * All light rotation events. (V3 system0)
	 */
	get lightRotationEventBoxGroups(): RotationEventBoxGroupJSON[] {
		return this.internalMap.lightRotationEventBoxGroups;
	}
	set lightRotationEventBoxGroups(x: RotationEventBoxGroupJSON[]) {
		this.internalMap.lightRotationEventBoxGroups = x;
	}

	/**
	 * All light translation events. (V3 system)
	 */
	get lightTranslationEventBoxGroups(): TranslationEventBoxGroupJSON[] {
		return this.internalMap.lightTranslationEventBoxGroups;
	}
	set lightTranslationEventBoxGroups(x: TranslationEventBoxGroupJSON[]) {
		this.internalMap.lightTranslationEventBoxGroups = x;
	}

	/**
	 * All vfx events. (V3 system)
	 */
	get vfxEventBoxGroups(): VfxEventBoxGroupJSON[] {
		return this.internalMap.vfxEventBoxGroups;
	}
	set vfxEventBoxGroups(x: VfxEventBoxGroupJSON[]) {
		this.internalMap.vfxEventBoxGroups = x;
	}

	/**
	 * FX events that use float numbers. (V3 system)
	 */
	get floatFxEvents(): BeatmapFxEvent[] {
		return this.internalMap._fxEventsCollection._fl;
	}
	set floatFxEvents(x: BeatmapFxEvent[]) {
		this.internalMap._fxEventsCollection._fl = x;
	}

	/**
	 * FX events that use integers only (no floats). (V3 system)
	 */
	get integerFxEvents(): BeatmapFxEvent[] {
		return this.internalMap._fxEventsCollection._il;
	}
	set integerFxEvents(x: BeatmapFxEvent[]) {
		this.internalMap._fxEventsCollection._il = x;
	}

	/**
	 * Map custom data section. This contains modded map content.
	 */
	get customData(): MapCustomData {
		this.internalMap.customData ??= {};
		return this.internalMap.customData;
	}
	set customData(x: MapCustomData) {
		this.internalMap.customData = x;
	}

	/**
	 * All map {@link HeckCustomEvent CustomEvents} in the map.
	 */
	get customEvents(): HeckCustomEvent[] {
		this.customData.customEvents ??= [];
		return this.customData.customEvents;
	}
	set customEvents(x: HeckCustomEvent[]) {
		this.customData.customEvents = x;
	}

	/**
	 * All environment objects for the map.
	 */
	get environments(): Environment[] {
		this.customData.environment ??= [];
		return this.customData.environment;
	}
	set environments(x: Environment[]) {
		this.customData.environment = x;
	}

	/**
	 * All registered materials for geometry.
	 *
	 * This will not include materials that are defined directly on geometry objects.
	 */
	get materials(): Record<string, GeometryMaterialJSON> {
		this.customData.materials ??= {};
		return this.customData.materials;
	}
	set materials(x: Record<string, GeometryMaterialJSON>) {
		this.customData.materials = x;
	}

	/**
	 * Map note objects that don't count to score.
	 */
	get fakeNotes(): Note[] {
		this.customData.fakeColorNotes ??= [];
		return this.customData.fakeColorNotes;
	}
	set fakeNotes(x: Note[]) {
		this.customData.fakeColorNotes = x;
	}

	/**
	 * Map bomb objects that don't count to score.
	 */
	get fakeBombs(): Bomb[] {
		this.customData.fakeBombNotes ??= [];
		return this.customData.fakeBombNotes;
	}
	set fakeBombs(x: Bomb[]) {
		this.customData.fakeBombNotes = x;
	}

	/**
	 * Map wall objects that don't count to score.
	 */
	get fakeWalls(): Wall[] {
		this.customData.fakeObstacles ??= [];
		return this.customData.fakeObstacles;
	}
	set fakeWalls(x: Wall[]) {
		this.customData.fakeObstacles = x;
	}

	/**
	 * Map chain objects that don't count to score.
	 */
	get fakeChains(): Chain[] {
		this.customData.fakeBurstSliders ??= [];
		return this.customData.fakeBurstSliders;
	}
	set fakeChains(x: Chain[]) {
		this.customData.fakeBurstSliders = x;
	}

	/**
	 * Collection of bookmarks from chromapper.
	 */
	get bookmarks(): Bookmark[] {
		this.customData.bookmarks ??= [];
		return this.customData.bookmarks;
	}
	set bookmarks(x: Bookmark[]) {
		this.customData.bookmarks = x;
	}

	/**
	 * Custom values used by chromapper for editing the map.
	 *
	 * Beat Saber will ignore these values.
	 */
	readonly chromapperValues = {
		mappingTime: 0,
		bookmarksUseOfficialBPMEvents: true
	};

	/**
	 * Whether the lighting of the map is compatible with other environments than the one in the info file.
	 */
	get useNormalEventsAsCompatibleEvents(): boolean {
		return this.internalMap.useNormalEventsAsCompatibleEvents;
	}
	set useNormalEventsAsCompatibleEvents(x: boolean) {
		this.internalMap.useNormalEventsAsCompatibleEvents = x;
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

	/**
	 * The custom settings overrides of this difficulty.
	 */
	get settings(): HeckSettings {
		for (let i = 0; i < this.info.raw._difficultyBeatmapSets.length; i++) {
			const bms = this.info.raw._difficultyBeatmapSets[i];
			for (let j = 0; j < bms._difficultyBeatmaps.length; j++) {
				const bm = bms._difficultyBeatmaps[j];
				if (bm._beatmapFilename == this.outputDiff + ".dat") {
					bm._customData ??= {};
					return (bm._customData._settings ?? {}) as HeckSettings;
				}
			}
		}
		return {} as HeckSettings;
	}

	set settings(x: HeckSettings) {
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
	addInputDiff(diff: DiffName) {
		let input: V3MapJSON = deepCopy(V3_MAP_FALLBACK);
		try {
			input = JSON.parse(Deno.readTextFileSync(diff + ".dat"));
		} catch (e) {
			LMLog(`Unable to add ${diff} to your map...`, "Error", "addInputDiff");
			LMLog(e, "Error", "addInputDiff");
		}

		const classMap = BMJSON.classify(input);

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
		const rawMap = BMJSON.JSONify(this.internalMap);
		try {
			Deno.writeTextFileSync(this.outputDiff + ".dat", JSON.stringify(decimals(rawMap, this.optimize.precision), null, formatJSON ? 4 : undefined));
		} catch (e) {
			LMLog(e, "Error");
		}
		if (this.info.isModified) {
			this.info.save();
		}
		LMLog("Map saved...");
		if (copyMapTo) {
			copyToDir(copyMapTo);
		}
	}
}

/**
 * An interface to the map's info file.
 */
export class Info {
	/**
	 * Convert a raw v4 info file into v2 info JSON.
	 */
	static v4ToV2(v4: V4InfoJSON): V2InfoJSON {
		const v2: V2InfoJSON = deepCopy(V2_INFO_FALLBACK);
		v2._songName = v4.song.title;
		v2._songSubName = v4.song.subTitle;
		v2._songAuthorName = v4.song.author;
		v2._beatsPerMinute = v4.audio.bpm;
		v2._previewDuration = v4.audio.previewDuration;
		v2._previewStartTime = v4.audio.previewStartTime;
		v2._songFilename = v4.audio.audioDataFilename;
		v2._coverImageFilename = v4.coverImageFilename;
		v2._environmentName = v4.environmentNames[0];
		v2._environmentNames = deepCopy(v4.environmentNames);
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
			v2._customData = deepCopy(v4.customData);
		}

		// Get authors from beatmaps
		const authors: string[] = [];

		// Add beatmaps
		v4.difficultyBeatmaps.forEach(bm => {
			authors.push(...bm.beatmapAuthors.lighters, ...bm.beatmapAuthors.mappers);
			const translatedDiff: V2InfoBeatmap = {
				_difficulty: bm.difficulty,
				_difficultyRank: difficultyRankMap.get(bm.difficulty),
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
	/**
	 * Raw info JSON contents.
	 */
	raw: V2InfoJSON = deepCopy(V2_INFO_FALLBACK);
	private initialRaw: V2InfoJSON = deepCopy(V2_INFO_FALLBACK);
	/**
	 * Initialise the info file reader. This class should not be initialised by itself. Use info {@link BeatMap.info info} property on {@link BeatMap}.
	 */
	constructor() {
		lMInitTime = Date.now();
		let inputRaw: Record<string, any>;
		try {
			inputRaw = JSON.parse(Deno.readTextFileSync("info.dat"));
		} catch (e) {
			LMLog("Error reading info file: " + e, "Error", "InfoHandler");
			LMLog("Writing blank info file...", "Log", "InfoHandler");

			inputRaw = deepCopy(V2_INFO_FALLBACK);
			try {
				Deno.writeTextFileSync("info.dat", JSON.stringify(inputRaw));
			} catch (e2) {
				LMLog(e2, "Error", "InfoHandler");
				LMLog("Check the read and write permissions of your map folder and ensure that Lite-Mapper is being run with --allow-all.", "Error");
				Deno.exit(1);
			}

			LMLog(`Fallback info.dat written...`, "Log", "InfoHandler");
			LMLog(`${rgb(0, 0, 255)}IMPORTANT: Save you map in a map editor and fill out required fields!\nLite-Mapper won't work properly and your map will not load in-game until you do this.`, "Log", "InfoHandler");
			Deno.exit(1);
		}
		if (inputRaw.version) {
			if (/4\.\d\.\d/.test(inputRaw.version)) {
				LMLog("Your info file is in version 4, Lite-Mapper only has very basic support for V4 info files, you will be able to read some properties from the info file however any changes will not be saved!", "Warning", "InfoHandler");
				this.raw = Info.v4ToV2(inputRaw as V4InfoJSON);
				this.infoVersion = 4;
			} else {
				LMLog("ERROR: Info file contains an unsupported version, please adjust your info file to version 2.1.0 for full support.\nAny info processes will not work!", "Error", "InfoHandler");
			}
		} else if (inputRaw._version) {
			if (/2\.\d\.\d/.test(inputRaw._version)) {
				this.raw = inputRaw as V2InfoJSON;
				this.initialRaw = deepCopy(inputRaw) as V2InfoJSON;
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
				LMLog("ERROR: Info file contains an unsupported version, please adjust your info file to version 2.1.0 for full support.\nAny info processes will not work!", "Error", "InfoHandler");
			}
		} else {
			LMLog("ERROR: Unable to read info file version!\nCheck that the file is not corrupted. Info processes will not work as intended.", "Error", "InfoHandler");
		}
	}
	/**
	 * Get whether the info file was modified. This will determine whether the file will be written to on save.
	 */
	get isModified(): boolean {
		return !compare(this.initialRaw, this.raw);
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
