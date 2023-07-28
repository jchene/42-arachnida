import { SpiderCli } from "./SpiderCli";
import { SpiderScrapper } from "./SpiderScrapper";

export class Spider {
	private readonly cli: SpiderCli = new SpiderCli()
    private readonly scrapper: SpiderScrapper = new SpiderScrapper()

    constructor() {
        this.scrapper.setTarget(this.cli.args[0])
        console.log("Initialising Spider" + (this.cli.opts.recursive ? " - Recursive Mode - Depth:" + this.cli.opts.length : "") + " - Output Directory: " + this.cli.opts.path + " - Target: " + this.cli.args[0])
    }

    public scrap(){
        this.scrapper.dig()
    }
}