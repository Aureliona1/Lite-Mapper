import { clog, rgb } from "@aurellis/helpers";
import pack from "../../deno.json" with { type: "json" };

/**
 * This is an internal LM function, you should never need to run this. All it will do is check for updates on JSR.io.
 */
export async function LMUpdateCheck() {
	try {
		const json = await (await fetch("https://raw.githubusercontent.com/Aureliona1/Lite-Mapper/main/deno.json")).json(),
			remoteVer = json.version;
		if (pack.version !== remoteVer) {
			clog(`A new update of Lite-Mapper is available (${remoteVer}):\n    ${rgb(0, 0, 255)}https://jsr.io/@aurellis/lite-mapper`, "Log", "UpdateChecker");
		}
	} catch (e) {
		clog(e, "Error", "UpdateChecker");
	}
}
