import { SpiderCli } from "./cli/SpiderCli";
import { SpiderScrapper } from "./scrapper/SpiderScrapper";

export class Spider {
	private readonly cli: SpiderCli = new SpiderCli()
    private readonly scrapper: SpiderScrapper
    private readonly linkList: string[] = []
    private readonly imageLinks: string[] = []

    constructor() {
        console.log("Initialising Spider" + (this.cli.opts.recursive ? " - Recursive Mode - Depth:" + this.cli.opts.length : "") + " - Output Directory: " + this.cli.opts.path + " - Target: " + this.cli.args[0])
        this.scrapper = new SpiderScrapper(this.cli.args[0], 0)
    }

    public async scrap(){
        await this.scrapper.scrap(this.linkList, this.imageLinks, (this.cli.opts.recursive ? this.cli.opts.length : 1))
        console.log("All unique links:")
        console.log(this.linkList)
    }

}