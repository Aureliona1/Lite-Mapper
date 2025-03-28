const ver = "1.3.2";
import { LMLog, rgb } from "./Functions.ts";

/**
 * This is an internal LM function, you should never need to run this. All it will do is check for updates on GitHub.
 */
export async function LMUpdateCheck() {
	try {
		const json = await (await fetch("https://raw.githubusercontent.com/Aureliona1/Lite-Mapper/main/Lite-Mapper/src/UpdateChecker.ts")).json(),
			remoteVer = json.version;
		if (ver !== remoteVer) {
			LMLog(`A new update of Lite-Mapper is available (${remoteVer}):\n    ${rgb(0, 0, 255)}https://jsr.io/@aurellis/lite-mapper`, "Log", "UpdateChecker");
		}
	} catch (e) {
		LMLog(e, "Error", "UpdateChecker");
	}
}
