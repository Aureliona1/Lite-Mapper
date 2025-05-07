// This is the LM installation/setup script.
// You do not need this in order to run Lite-Mapper.
import { rgb, type DiffName } from "jsr:@aurellis/lite-mapper";

// import pack from "./deno.json" with {type: "json"}

type DenonJsonObject = {
	allow?: string[];
	scripts?: Record<string, Record<string, string>>;
	watcher?: {
		exts: string[];
		legacy?: boolean;
	};
};

const warnColor = rgb(255, 255, 100);
const errorColor = rgb(255, 50, 50);

const diffNames: DiffName[] = [
	"Easy360Degree",
	"Easy90Degree",
	"EasyLawless",
	"EasyLightshow",
	"EasyNoArrows",
	"EasyOneSaber",
	"EasyStandard",
	"Expert360Degree",
	"Expert90Degree",
	"ExpertLawless",
	"ExpertLightshow",
	"ExpertNoArrows",
	"ExpertOneSaber",
	"ExpertStandard",
	"ExpertPlus360Degree",
	"ExpertPlus90Degree",
	"ExpertPlusLawless",
	"ExpertPlusLightshow",
	"ExpertPlusNoArrows",
	"ExpertPlusOneSaber",
	"ExpertPlusStandard",
	"Hard360Degree",
	"Hard90Degree",
	"HardLawless",
	"HardLightshow",
	"HardNoArrows",
	"HardOneSaber",
	"HardStandard",
	"Normal360Degree",
	"Normal90Degree",
	"NormalLawless",
	"NormalLightshow",
	"NormalNoArrows",
	"NormalOneSaber",
	"NormalStandard"
];

/*
Format:
	`lm ${process}? ${...args}`

process is a single word
boolean arg begins with --, it will have no param
param arg begins with -, it will have a string param with no quotes afterwards

if process isn't specified, it defaults to run
*/

// Parse cmd args

const args = Deno.args;

const parsedOpts: { process: string; parameters?: Record<string, string>; bools?: Record<string, boolean> } = { process: "run", parameters: {}, bools: {} };

if (/^[^-]\w+/.test(args[0])) {
	parsedOpts.process = args[0];
	args.splice(0, 1);
}

let currentParamProp = "";
while (args.length) {
	if (/^-[^-].+/.test(args[0])) {
		if (currentParamProp.length && !parsedOpts.parameters![currentParamProp].length) {
			console.log(`${warnColor}WARNING: ${parsedOpts.parameters![currentParamProp]} requires at least one param...`);
		}
		const parsed = args[0].substring(1);
		currentParamProp = parsed;
		parsedOpts.parameters![parsed] = "";
		args.splice(0, 1);
	} else if (/--.+/.test(args[0])) {
		const parsed = args[0].substring(2);
		parsedOpts.bools![parsed] = true;
		currentParamProp = "";
		args.splice(0, 1);
	} else {
		if (currentParamProp.length) {
			parsedOpts.parameters![currentParamProp] += " " + args[0];
		} else {
			console.log(`${warnColor}WARNING: Syntax error at param ${errorColor + args[0] + warnColor}...\x1b[0m`);
			console.log("Skipping this input...");
		}
		args.splice(0, 1);
	}
}

// Help message
if (parsedOpts.process == "?" || parsedOpts.process == "help") {
	console.log(rgb(150, 100, 255) + "Welcome to the Lite-Mapper Command Line Interface!");
	console.log("\x1b[0m\n\nUsage:");
	console.log(`    ${rgb(100, 200, 100)}lm <process> [...args]\x1b[0m\n`);
	console.log("Example Usage:");
	console.log(`    ${rgb(100, 200, 100)}lm setup --denon -in ExpertPlusStandard -out ExpertPlusLawless\x1b[0m\n`);
	console.log(`This will setup Lite-Mapper in the current directory for use with denon with ${rgb(100, 100, 255)}ExpertPlusStandard\x1b[0m as the input, and ${rgb(100, 100, 255)}ExpertPlusLawless\x1b[0m as the output.`);
	console.log("\nProcesses:");
	console.log("    help -> Display this help message.");
	console.log("    ? -> Display this help message.");
	console.log("    setup -> Sets up the working directory for Lite-Mapper.");
	console.log(`      ${rgb(255, 255, 50)}setup options:`);
	console.log("        --denon -> add scripts.json and set up for denon.");
	console.log("        -in -> specify the input difficulty (no .dat).");
	console.log("        -out -> specify the output difficulty (no .dat).");
	console.log("        NOTE: You can omit -in and -out to set them to ExpertStandard and ExpertPlusStandard respectively.");
	console.log("        -update-freq -> DAILY WEEKLY NEVER -> Set the update checker frequency, this can be changed later in your script.ts.\x1b[0m");
	console.log("    run -> Run Lite-Mapper in the working directory. Lite-Mapper isn't setup here, it will run setup.");
	console.log(`      ${rgb(255, 255, 50)}run options:`);
	console.log("        -script -> set the name of the script to run, defaults to script.ts\x1b[0m");
	console.log("    export -> Exports the current map as a zip folder to be uploaded to BeatSaver.com");
	console.log("\n\nWhen running setup, the acceptable difficulty names are as follows:");
	console.log("    " + diffNames.join("\n    "));
	prompt("Press enter to exit...");
	Deno.exit(0);
}

if (parsedOpts.process == "run") {
	let script = "script.ts";
	if (parsedOpts.parameters!.script !== undefined) {
		script = parsedOpts.parameters!.script;
	}
	let denon = false;
	try {
		const scriptsJSON: DenonJsonObject = JSON.parse(Deno.readTextFileSync("scripts.json"));
		if (scriptsJSON.scripts) {
			if (scriptsJSON.scripts["lm"] !== undefined) {
				denon = true;
			}
		}
	} catch (_) {
		console.log("Denon script not found...");
	}
	if (denon) {
		console.log("Running with denon...");
		const cmd = new Deno.Command("denon", { args: ["lm"] });
		cmd.spawn();
	} else {
		console.log("Running without denon...\nIf you would like to use denon, run:\n    lm setup --denon");
		const cmd = new Deno.Command("deno", { args: ["run", "--allow-all", script] });
		cmd.spawn();
	}
	Deno.exit(0);
}
