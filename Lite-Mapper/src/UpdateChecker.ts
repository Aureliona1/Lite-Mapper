const ver = "1.3.1";
import { LMLog, rgb } from "./Functions.ts";

/**
 * This is an internal LM function, you should never need to run this. All it will do is check for updates on GitHub.
 */
export async function LMUpdateCheck() {
	try {
		const raw = (await fetch("https://raw.githubusercontent.com/Aureliona1/Lite-Mapper/main/Lite-Mapper/src/UpdateChecker.ts")).text(),
			remoteVer = eval(`${/".+";/.exec(await raw)}`),
			localVer = ver;
		if (localVer !== remoteVer) {
			LMLog(`A new update of Lite-Mapper is available (${remoteVer}):\n    ${rgb(0, 0, 255)}https://github.com/Aureliona1/Lite-Mapper/releases/latest`, "Log", "UpdateChecker");
		}
	} catch (e) {
		LMLog(e, "Error", "UpdateChecker");
	}
}
