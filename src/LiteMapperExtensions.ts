import { NoteType, thisDiff } from "./LiteMapper.ts";

export function filterNotes(condition: (x: NoteType) => boolean, action: (x: NoteType) => void) {
	thisDiff.notes.forEach(x => {
		if (condition(x)) {
			action(x);
		}
	});
}
