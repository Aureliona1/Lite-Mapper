const ver = "beta-0.0.1";
import { LMLog } from "./LiteMapper.ts";

export async function LMUpdateCheck() {
	try {
		const raw = (await fetch("https://raw.githubusercontent.com/Aureliona1/Lite-Mapper/main/src/LiteMapper/updateChecker.ts")).text(),
			remoteVer = eval(await raw).ver as string,
			localVer = ver;
		if (localVer !== remoteVer) {
			LMLog(`A new update of Lite-Mapper is available (${remoteVer}):\n    \x1b[94mhttps://github.com/Aureliona1/Lite-Mapper/releases/latest\x1b[37m`);
		}
	} catch (e) {
		LMLog(e, "Error");
	}
}
