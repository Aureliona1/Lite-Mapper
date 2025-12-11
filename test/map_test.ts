// Write Sample Files

import { BeatMap, deepCopy, V2_INFO_FALLBACK, V2InfoBeatmapSet, V3_MAP_FALLBACK } from "../mod.ts";
import { assert } from "./assert.ts";

const sampleInfo = deepCopy(V2_INFO_FALLBACK);
sampleInfo._difficultyBeatmapSets = [
	{
		_beatmapCharacteristicName: "Standard",
		_difficultyBeatmaps: [
			{
				_beatmapFilename: "ExpertStandard.dat",
				_difficulty: "Expert",
				_difficultyRank: 7,
				_noteJumpMovementSpeed: 15,
				_noteJumpStartBeatOffset: 1
			},
			{
				_beatmapFilename: "ExpertPlusStandard.dat",
				_difficulty: "ExpertPlus",
				_difficultyRank: 9,
				_noteJumpMovementSpeed: 17,
				_noteJumpStartBeatOffset: 1
			}
		]
	}
];

if (!Deno.cwd().endsWith("\\test")) {
	Deno.chdir("test");
}

await Deno.writeTextFile("info.dat", JSON.stringify(sampleInfo));
await Deno.writeTextFile("ExpertStandard.dat", JSON.stringify(V3_MAP_FALLBACK));
await Deno.writeTextFile("ExpertPlusStandard.dat", JSON.stringify(V3_MAP_FALLBACK));

// Open As BeatMap

const map = new BeatMap("ExpertStandard", "ExpertPlusStandard");

Deno.test({
	name: "Sample map is empty",
	fn: () => {
		assert(map.arcs.length === 0);
		assert(map.bombs.length === 0);
		assert(map.bookmarks.length === 0);
		assert(map.bpmEvents.length === 0);
		assert(map.bpmEvents.length === 0);
		assert(map.chains.length === 0);
		assert(map.colorBoostBeatmapEvents.length === 0);
		assert(map.customEvents.length === 0);
		assert(map.environments.length === 0);
		assert(map.events.length === 0);
		assert(map.fakeBombs.length === 0);
		assert(map.fakeChains.length === 0);
		assert(map.fakeNotes.length === 0);
		assert(map.fakeWalls.length === 0);
		assert(map.notes.length === 0);
		assert(map.walls.length === 0);
	}
});

// Cleanup

await Deno.remove("info.dat");
await Deno.remove("ExpertStandard.dat");
await Deno.remove("ExpertPlusStandard.dat");
await Deno.remove("LM_Cache.json");

if (Deno.cwd().endsWith("\\test")) {
	Deno.chdir("../");
}
