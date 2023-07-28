import { OptionValues } from "commander";
import { SpiderCli } from "./SpiderCli";

export class Spider {
	private cli: SpiderCli = new SpiderCli()

	public options: OptionValues = this.cli.getOptions()
}