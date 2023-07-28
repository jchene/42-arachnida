import { OptionValues } from "commander";
import { ScorpionCli } from "./ScorpionCli";

export class Scorpion {
	private cli: ScorpionCli = new ScorpionCli()

	constructor() {
        console.log("Initialising Scorpion on " + this.cli.args[0])
    }
}