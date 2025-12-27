import { clogSettingsUpdate } from "@aurellis/helpers";
import { Arc, BeatMap, Bomb, Chain, clog, compare, deepCopy, Note, V2_INFO_FALLBACK, V3_MAP_FALLBACK, Wall } from "../mod.ts";
import { assert } from "./assert.ts";

/*
Test file description

Since LM runs in a "pipeline", where some actions and code don't work without other things being initialised.
This file acts as a sample use-case for LM to test feature usage.

*/

// Write Sample Files

clogSettingsUpdate({ timeFormat: "This Script Run" });

clog("Creating sample files...", "Log", "Test Env");

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

clog("Test environment initialised, begin tests...", "Log", "Test Env");

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

Deno.test({
	name: "Arc",
	fn: () => {
		const a = new Arc();
		a.push();
		assert(map.arcs.length === 1);
		assert(compare(map.arcs.at(0), a));
	}
});

Deno.test({
	name: "Bomb",
	fn: () => {
		const b = new Bomb();
		b.push();
		assert(map.bombs.length === 1);
		assert(compare(map.bombs.at(0), b));
		b.interactable = false;
		b.push(true);
		assert(map.fakeBombs.length === 1);
		assert(compare(map.fakeBombs.at(0), b));
		assert(!compare(map.fakeBombs.at(0), map.bombs.at(0)));
	}
});

Deno.test({
	name: "Chain",
	fn: () => {
		const c = new Chain();
		c.push();
		assert(map.chains.length === 1);
		assert(compare(map.chains.at(0), c));
		c.interactable = false;
		c.push(true);
		assert(map.fakeChains.length === 1);
		assert(compare(map.fakeChains.at(0), c));
		assert(!compare(map.fakeChains.at(0), map.chains.at(0)));
	}
});

Deno.test({
	name: "Note",
	fn: () => {
		const n = new Note();
		n.push();
		assert(map.notes.length === 1);
		assert(compare(map.notes.at(0), n));
		n.interactable = false;
		n.push(true);
		assert(map.fakeNotes.length === 1);
		assert(compare(map.fakeNotes.at(0), n));
		assert(!compare(map.fakeNotes.at(0), map.notes.at(0)));
	}
});

Deno.test({
	name: "Wall",
	fn: () => {
		const w = new Wall();
		w.push();
		assert(map.walls.length === 1);
		assert(compare(map.walls.at(0), w));
		w.interactable = false;
		w.push(true);
		assert(map.fakeWalls.length === 1);
		assert(compare(map.fakeWalls.at(0), w));
		assert(!compare(map.fakeWalls.at(0), map.walls.at(0)));
	}
});

// Cleanup

clog("Map tests complete, begin cleanup...", "Log", "Test Env");

await Deno.remove("info.dat");
await Deno.remove("ExpertStandard.dat");
await Deno.remove("ExpertPlusStandard.dat");
await Deno.remove("LM_Cache.json");

if (Deno.cwd().endsWith("\\test")) {
	Deno.chdir("../");
}
