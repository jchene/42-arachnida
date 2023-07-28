import { OptionValues } from "commander";
import { ScorpionCli } from "./ScorpionCli";

export class Scorpion {
	private cli: ScorpionCli = new ScorpionCli()

	public options: OptionValues = this.cli.getOptions()
}