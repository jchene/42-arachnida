import { SpiderCli } from "./cli/SpiderCli";
import { SpiderScrapper } from "./scrapper/SpiderScrapper";

export class Spider {
	private readonly cli: SpiderCli = new SpiderCli()
    private readonly scrapper: SpiderScrapper
    private readonly linkList: string[] = []
    private readonly imageLinks: string[] = []

    constructor() {
        console.log("Initialising Spider" + (this.cli.opts.recursive ? " - Recursive Mode - Depth:" + this.cli.opts.length : "") + " - Output Directory: " + this.cli.opts.path + " - Target: " + this.cli.target)
        this.linkList.push(this.cli.target.href)
        this.scrapper = new SpiderScrapper(this.cli.target, this.cli.opts, 0)
    }

    public async scrap(){
        await this.scrapper.scrap(this.linkList, this.imageLinks)
        console.log("All unique links:")
        console.log(this.linkList)
    }

}