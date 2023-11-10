import { LMLog } from "./LiteMapper.ts";

export async function LMUpdateCheck() {
	try {
		const raw = (await fetch("https://raw.githubusercontent.com/Aureliona1/Lite-Mapper/main/src/LiteMapper/LMVER.json")).json(),
			ver = (await raw)["version"];
		if (JSON.parse(Deno.readTextFileSync("LMVER.json"))["version"] !== ver) {
			LMLog("A new update of Lite-Mapper is available:\n    \x1b[94mhttps://github.com/Aureliona1/Lite-Mapper/releases/latest\x1b[37m");
		}
	} catch (e) {
		LMLog(e, "Error");
	}
}
