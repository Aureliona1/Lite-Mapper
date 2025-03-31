import { assertEquals } from "jsr:@std/assert";
import { BeatMap, Note, type V3MapJSON } from "../src/mod.ts";

Deno.chdir("test");

const map = new BeatMap("ExpertStandard", "ExpertPlusStandard");

Deno.test({
	name: "Map importing",
	fn: () => {
		assertEquals(map.notes.length, 1);
		assertEquals(map.arcs.length, 0);
		assertEquals(map.bombs.length, 0);
		assertEquals(map.chains.length, 0);
		assertEquals(map.events.length, 0);
		assertEquals(map.walls.length, 0);
	}
});

new Note().push();

Deno.test({
	name: "Object creation and push",
	fn: () => {
		assertEquals(map.notes.length, 1);
		assertEquals(map.notes[0].time, 0);
	}
});

Deno.test({
	name: "Settings",
	fn: () => {
		// Imported setting
		assertEquals(map.settings._playerOptions?._noTextsAndHuds, false);
		map.settings._modifiers = {
			_noBombs: false,
			_energyType: "Battery"
		};
		// Modified setting
		assertEquals(map.settings._modifiers._energyType, "Battery");
	}
});

map.save();

const rawOut = Deno.readTextFileSync("ExpertPlusStandard.dat");

Deno.test({
	name: "Write",
	permissions: { read: true },
	fn: () => {
		// note length should be 1
		assertEquals((JSON.parse(rawOut) as V3MapJSON).colorNotes.length, 1);
	}
});

Deno.chdir("../");
