const ver = "beta-0.1.2";
import { LMLog } from "./LiteMapper.ts";

export async function LMUpdateCheck() {
	try {
		const raw = (await fetch("https://raw.githubusercontent.com/Aureliona1/Lite-Mapper/main/Lite-Mapper/src/UpdateChecker.ts")).text(),
			remoteVer = eval(`${/".+";/.exec(await raw)}`),
			localVer = ver;
		if (localVer !== remoteVer) {
			LMLog(`A new update of Lite-Mapper is available (${remoteVer}):\n    \x1b[94mhttps://github.com/Aureliona1/Lite-Mapper/releases/latest\x1b[37m`);
		}
	} catch (e) {
		LMLog(e, "Error");
		LMLog("This error is fine, it generally just indicates a wifi error for Lite-Mapper's update checker");
	}
}
