import { deepCopy } from "@aurellis/helpers";
import type { V3MapJSON, ClassMap } from "../core/core.ts";
import { Arc, Bomb, Chain, Note, Wall } from "../gameplay/gameplay.ts";
import { jsonPrune } from "../utility/utility.ts";
import { Bookmark, Environment, LightEvent } from "../visual/visual.ts";
import { JSONToCE, CEToJSON } from "./map.ts";

export class BMJSON {
	/**
	 * Convert raw V3JSON to a classmap.
	 * @param raw The json to import.
	 */
	static classify(raw: V3MapJSON): ClassMap {
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
			customData: {
				environment: [],
				customEvents: [],
				materials: {},
				fakeBombNotes: [],
				fakeBurstSliders: [],
				fakeColorNotes: [],
				fakeObstacles: [],
				bookmarks: []
			}
		};

		function deepPush<T extends Record<string, any>>(obj: T, arr: T[]) {
			const temp = deepCopy(obj);
			jsonPrune(temp);
			arr.push(temp);
		}

		// Classify vanilla items
		raw.basicBeatmapEvents.forEach(e => {
			deepPush(LightEvent.from(e), classMap.basicBeatmapEvents);
		});
		raw.bombNotes.forEach(n => {
			deepPush(Bomb.from(n), classMap.bombNotes);
		});
		raw.burstSliders.forEach(n => {
			deepPush(Chain.from(n), classMap.burstSliders);
		});
		raw.colorNotes.forEach(n => {
			deepPush(Note.from(n), classMap.colorNotes);
		});
		raw.obstacles.forEach(n => {
			deepPush(Wall.from(n), classMap.obstacles);
		});
		raw.sliders.forEach(n => {
			deepPush(Arc.from(n), classMap.sliders);
		});

		// Check for custom data
		if (raw.customData) {
			if (raw.customData.customEvents) {
				raw.customData.customEvents.forEach(n => {
					deepPush(JSONToCE(n), classMap.customData!.customEvents!);
				});
			}
			if (raw.customData.environment) {
				raw.customData.environment.forEach(e => {
					deepPush(Environment.from(e), classMap.customData!.environment!);
				});
				// classMap.customData!.environment! = raw.customData.environment;
			}
			if (raw.customData.fakeBombNotes) {
				raw.customData.fakeBombNotes.forEach(n => {
					deepPush(Bomb.from(n), classMap.customData!.fakeBombNotes!);
				});
			}
			if (raw.customData.fakeBurstSliders) {
				raw.customData.fakeBurstSliders.forEach(n => {
					deepPush(Chain.from(n), classMap.customData!.fakeBurstSliders!);
				});
			}
			if (raw.customData.fakeColorNotes) {
				raw.customData.fakeColorNotes.forEach(n => {
					deepPush(Note.from(n), classMap.customData!.fakeColorNotes!);
				});
			}
			if (raw.customData.fakeObstacles) {
				raw.customData.fakeObstacles.forEach(n => {
					deepPush(Wall.from(n), classMap.customData!.fakeObstacles!);
				});
			}
			if (raw.customData.bookmarks) {
				raw.customData.bookmarks.forEach(b => {
					deepPush(Bookmark.from(b), classMap.customData!.bookmarks!);
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
	static JSONify(classMap: ClassMap): V3MapJSON {
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
			rawMap.colorNotes.push(n.return());
		});
		classMap.bombNotes.forEach(n => {
			rawMap.bombNotes.push(n.return());
		});
		classMap.obstacles.forEach(n => {
			rawMap.obstacles.push(n.return());
		});
		classMap.sliders.forEach(n => {
			rawMap.sliders.push(n.return());
		});
		classMap.burstSliders.forEach(n => {
			rawMap.burstSliders.push(n.return());
		});
		classMap.basicBeatmapEvents.forEach(n => {
			rawMap.basicBeatmapEvents.push(n.return());
		});

		if (classMap.customData) {
			rawMap.customData = {
				fakeBombNotes: [],
				fakeBurstSliders: [],
				fakeColorNotes: [],
				fakeObstacles: [],
				bookmarks: [],
				customEvents: [],
				environment: [],
				materials: {}
			};
			if (classMap.customData.fakeColorNotes) {
				classMap.customData.fakeColorNotes.forEach(n => {
					rawMap.customData!.fakeColorNotes!.push(n.return());
				});
			}
			if (classMap.customData.fakeBombNotes) {
				classMap.customData.fakeBombNotes.forEach(n => {
					rawMap.customData!.fakeBombNotes!.push(n.return());
				});
			}
			if (classMap.customData.fakeObstacles) {
				classMap.customData.fakeObstacles.forEach(n => {
					rawMap.customData!.fakeObstacles!.push(n.return());
				});
			}
			if (classMap.customData.fakeBurstSliders) {
				classMap.customData.fakeBurstSliders.forEach(n => {
					rawMap.customData!.fakeBurstSliders!.push(n.return());
				});
			}
			if (classMap.customData.customEvents) {
				classMap.customData.customEvents.forEach(n => {
					rawMap.customData!.customEvents!.push(CEToJSON(n));
				});
			}
			if (classMap.customData.bookmarks) {
				classMap.customData.bookmarks.forEach(b => {
					rawMap.customData!.bookmarks!.push(b.return());
				});
			}
			if (classMap.customData.environment) {
				classMap.customData.environment.forEach(e => {
					rawMap.customData!.environment!.push(e.return());
				});
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
