// This is the LM installation/setup script.
// You do not need this in order to run Lite-Mapper.
import { rgb, type DiffName } from "jsr:@aurellis/lite-mapper";
import pack from "./deno.json" with {type: "json"}

const warn = rgb(255,255,100);
const error = rgb(255,50,50);

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
	
}

/*
Format:
	`lm ${process}? ${...args}`

processs is a single word
boolean arg begins with --, it will have no param
param arg begins with -, it will have a string param with no quotes afterwards

if process isn't specified, it defaults to run
*/

const args = Deno.args;

const parsedOpts: {process: string; parameters?: Record<string, string>; bools?: Record<string, boolean>} = {process:"run", parameters:{}, bools:{}};

if(/^[^-]\w+/.test(args[0])){
	parsedOpts.process = args[0];
	args.splice(0,1);
}

let currentParamProp ="";
while(args.length){
	if(/^-[^-].+/.test(args[0])){
		if(currentParamProp.length && !parsedOpts.parameters![currentParamProp].length){
			console.log(`${warn}WARNING: ${parsedOpts.parameters![currentParamProp]} requires at least one param...`)
		}
		const parsed = args[0].substring(1);
		currentParamProp = parsed;
		parsedOpts.parameters![parsed] = "";
		args.splice(0,1);
	} else if(/--.+/.test(args[0])){
		const parsed = args[0].substring(2);
		parsedOpts.bools![parsed] = true;
		currentParamProp = "";
		args.splice(0,1)
	} else {
		if(currentParamProp.length){
			parsedOpts.parameters![currentParamProp] += " " + args[0];
		}
		else{
			console.log(`${warn}WARNING: Syntax error at param ${error + args[0] + warn}...\x1b[0m`);
			console.log("Skipping this input...")
		}
		args.splice(0,1);
	}
}

console.log(parsedOpts)