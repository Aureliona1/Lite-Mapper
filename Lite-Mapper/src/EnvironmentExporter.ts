import { Environment } from "./Environment.ts";
import { copy, LMLog } from "./Functions.ts";
import { currentDiff } from "./Map.ts";
import { LightEventJSON } from "./Types.ts";

export type USESettings = {
	name?: string;
	author?: string;
	environmentVersion?: string;
	description?: string;
	copyLightEvents?: "All Events" | "Events At Beat 0";
	features?: {
		forceEffectsFilter?: "AllEffects" | "StrobeFilter" | "NoEffects";
		useChromaEvents?: boolean;
		basicBeatMapEvents?: LightEventJSON[];
	};
};

export function exportShareableEnv(settings: USESettings) {
	// Add light events
	if (settings.copyLightEvents) {
		settings.features ??= {};
		if (settings.copyLightEvents == "All Events") {
			currentDiff.events.forEach(ev => {
				((settings.features ?? {}).basicBeatMapEvents ?? []).push(ev.return());
			});
		} else if (settings.copyLightEvents == "Events At Beat 0") {
			currentDiff.events.forEach(ev => {
				if (ev.time == 0) {
					((settings.features ?? {}).basicBeatMapEvents ?? []).push(ev.return());
				}
			});
		}
	}
	// Convert the type and material to their underscored counterparts and remove tracks
	const envArray: Environment[] = [];
	currentDiff.environments.forEach(e => {
		const nu = copy(e);
		if (nu.track) {
			delete nu.track;
		}
		envArray.push(nu.return());
	});
	if (envArray.length == 0) {
		LMLog("Map doesn't contain eny environments! Shareable env will be empty...", "Warning");
	}
	//Create the file
	try {
		Deno.writeTextFileSync(
			`${settings.name}.dat`,
			JSON.stringify({
				version: "1.0.0",
				name: settings.name ?? `${currentDiff.info.raw._songName} environment`,
				author: settings.author ?? currentDiff.info.raw._levelAuthorName,
				environmentVersion: settings.environmentVersion ?? "0.0.1",
				environmentName: currentDiff.info.raw._environmentName,
				description: settings.description ?? "Empty description...",
				features: settings.features,
				environment: envArray,
				materials: currentDiff.materials
			})
		);
	} catch (error) {
		LMLog(error, "Error");
	}
	LMLog(`Exported ${envArray.map.length} environments to "${settings.name}.dat"...`);
}
