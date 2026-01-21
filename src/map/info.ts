import { clog, compare, deepCopy, rgb } from "@aurellis/helpers";
import { V2_INFO_FALLBACK, difficultyRankMap } from "../core/internal.ts";
import type { V2InfoBeatmap, V2InfoJSON, V4InfoJSON } from "../core/types.ts";
import { hex2Rgba, jsonPrune, rgba2Obj } from "../utility/helpers.ts";

/**
 * The time (ms since epoch) of the start of this lm instance.
 */
export let lMInitTime = 0;

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
			clog("Error reading info file: " + e, "Error", "InfoHandler");
			clog("Writing blank info file...", "Log", "InfoHandler");

			inputRaw = deepCopy(V2_INFO_FALLBACK);
			try {
				Deno.writeTextFileSync("info.dat", JSON.stringify(inputRaw));
			} catch (e2) {
				clog(e2, "Error", "InfoHandler");
				clog("Check the read and write permissions of your map folder and ensure that Lite-Mapper is being run with --allow-all.", "Error");
				Deno.exit(1);
			}

			clog(`Fallback info.dat written...`, "Log", "InfoHandler");
			clog(`${rgb(0, 0, 255)}IMPORTANT: Save you map in a map editor and fill out required fields!\nLite-Mapper won't work properly and your map will not load in-game until you do this.`, "Log", "InfoHandler");
			Deno.exit(1);
		}
		if (inputRaw.version) {
			if (/4\.\d\.\d/.test(inputRaw.version)) {
				clog("Your info file is in version 4, Lite-Mapper only has very basic support for V4 info files, you will be able to read some properties from the info file however any changes will not be saved!", "Warning", "InfoHandler");
				this.raw = Info.v4ToV2(inputRaw as V4InfoJSON);
				this.infoVersion = 4;
			} else {
				clog("ERROR: Info file contains an unsupported version, please adjust your info file to version 2.1.0 for full support.\nAny info processes will not work!", "Error", "InfoHandler");
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
				clog("ERROR: Info file contains an unsupported version, please adjust your info file to version 2.1.0 for full support.\nAny info processes will not work!", "Error", "InfoHandler");
			}
		} else {
			clog("ERROR: Unable to read info file version!\nCheck that the file is not corrupted. Info processes will not work as intended.", "Error", "InfoHandler");
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
