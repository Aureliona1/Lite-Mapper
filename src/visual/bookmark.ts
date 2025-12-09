import { deepCopy, type Vec4 } from "@aurellis/helpers";
import type { BookmarkJSON } from "../core/core.ts";
import { currentDiff } from "../map/map.ts";
import { jsonPrune } from "../utility/utility.ts";

/**
 * A map bookmark object.
 * This is based on bookmarks from ChroMapper.
 */
export class Bookmark {
	/**
	 * Create a new bookmark that is visible in Chromapper (and other mapping software that supports this format).
	 * @param time The time of the bookmark.
	 * @param name The name that will appear for the bookmark.
	 * @param color The in-editor color of the bookmark.
	 */
	constructor(public time = 0, public name = "", public color: Vec4 = [1, 1, 1, 1]) {}
	/**
	 * Return the bookmark as valid bookmark JSON.
	 * @param dupe Whether to duplicate the object on return.
	 */
	return(dupe = true): BookmarkJSON {
		const temp = dupe ? deepCopy(this) : this;
		const out: BookmarkJSON = {
			b: temp.time,
			n: temp.name,
			c: temp.color
		};
		jsonPrune(out);
		return out;
	}
	/**
	 * Create an instance of a bookmark from bookmark JSON.
	 * @param x The JSON.
	 * @returns A bookmark.
	 */
	static from(x: BookmarkJSON): Bookmark {
		return new Bookmark(x.b, x.n, x.c);
	}
	/**
	 * Push the bookmark to the current diff.
	 * @param dupe Whether to copy the object on push.
	 */
	push(dupe = true) {
		currentDiff.bookmarks?.push(dupe ? deepCopy(this) : this);
	}
}
