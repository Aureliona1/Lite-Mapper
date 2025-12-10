import type { CustomEventJSON, CustomEventName } from "../../core/core.ts";

/**
 * A generic Heck custom event.
 */
export class HeckCustomEvent {
	/**
	 * Create a new generic Heck custom event.
	 * @param t
	 * @param b
	 */
	constructor(protected t: CustomEventName, protected b = 0) {}

	/**
	 * The event data.
	 */
	protected d: {} = {};

	/**
	 * The time (in beats) of the start of the event.
	 */
	get time(): number {
		return this.b;
	}
	set time(x: number) {
		this.b = x;
	}

	/**
	 * The type of the custom event.
	 */
	get type(): CustomEventName {
		return this.t;
	}

	/**
	 * Return the raw JSON of te event.
	 */
	return(): CustomEventJSON {
		return { d: this.d, t: this.t, b: this.b };
	}
}
