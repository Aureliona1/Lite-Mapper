// This is the LM installation/setup script.
// You do not need this in order to run Lite-Mapper.
import type { DiffName } from "jsr:@aurellis/lite-mapper";

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

function displayHelp() {
	console.clear();
	console.log("Lite-Mapper setup tool manual page:");
	console.log("This tool can be used to initialize a Lite-Mapper workspace for the first time.");
	console.log("If you are seeing this message, either you didn't supply any arguments to the command, or you used --help.");
	console.log("\n\nCommand usage:");
	console.log("\nStandard: lm-init [ ...ARGS ] input output");
	console.log("\nAlternative: lm-init [ ...ARGS ]    <-- input and output will be set to ExpertStandard and ExpertPlusStandard respectively.");
	console.log("\n\nArguments:");
	console.log("    -help:        Display this help message, or just run lm-init with no args.");
	console.log("    -denon:       Create a scripts.json file for use with denon.");
	console.log("    -no-update:   Adds a line to the generated script to prevent Lite-Mapper from checking for updates.");
	console.log("    --update-freq: [Daily, Weekly]: Overrides -no-update, adds a line to the generated code to set the update frequency.");
	console.log("\n\nDifficulty labels:");
	console.log("    " + diffNames.join("\n    "));
	prompt("\n\nPress enter to continue...");
	Deno.exit(0);
}

type SetupArgs = {
	"-help": boolean;
	"-denon": boolean;
	"-no-update": boolean;
	"--update-freq"?: "Daily" | "Weekly";
	input: DiffName;
	output: DiffName;
} & Record<string, string | boolean | number>;

const opts: SetupArgs = {
	"-help": false,
	"-denon": false,
	"-no-update": false,
	input: "ExpertStandard",
	output: "ExpertPlusStandard"
};

if (Deno.args.length == 0) {
	displayHelp();
}

let nextArgIsParam = false;
Deno.args.forEach((arg, i) => {
	if (nextArgIsParam) {
		opts[Deno.args[i - 1]] = arg;
		nextArgIsParam = false;
	} else if (/^--/.test(arg)) {
		nextArgIsParam = true;
	} else if (/^-[^-]/.test(arg)) {
		opts[arg] = true;
	} else if (i == Deno.args.length - 2) {
		if (diffNames.includes(arg as DiffName)) {
			opts.input = arg as DiffName;
		} else {
			console.error("Arguments formatted incorrectly...");
			console.log("Input will be set to ExpertStandard...");
		}
	} else if (i == Deno.args.length - 1) {
		if (diffNames.includes(arg as DiffName)) {
			opts.output = arg as DiffName;
		} else {
			console.error("Arguments formatted incorrectly...");
			console.log("Output will be set to ExpertPlusStandard...");
		}
	}
});

if (opts.help) {
	displayHelp();
}

if (opts["-denon"]) {
	try {
		const denonObject = {
			allow: ["all"],
			scripts: {
				lm: {
					cmd: "deno run --no-check script.ts",
					desc: "Run Lite-Mapper"
				}
			},
			watcher: {
				exts: ["ts"],
				legacy: false
			}
		};
		Deno.writeTextFileSync("scripts.json", JSON.stringify(denonObject));
	} catch (_) {
		console.error("Error writing denon scripts.json file...");
		console.log("Check folder and Deno write permissions...");
		Deno.exit(1);
	}
}

const scriptString = `import { BeatMap } from "jsr:@aurellis/lite-mapper@1.3.1"\n\nconst map = new BeatMap("${opts.input}", "${opts.output}", ${opts["--update-freq"] ?? opts["-no-update"] ? "Never" : ""});\n// Write your map code here\nmap.save();\n`;
try {
	Deno.writeTextFileSync("script.ts", scriptString);
} catch (_) {
	console.error("Error writing script.ts...");
	console.log("Check folder and Deno write permissions...");
	Deno.exit(1);
}

console.log("Lite-Mapper has been set up. Open script.ts to begin mapping.\nFor any issues, please contact me on discord @aurellis, or post an issue on the Lite-Mapper github :)");
