import { SpiderCli } from "./cli/SpiderCli";
import { SpiderScrapper } from "./scrapper/SpiderScrapper";
import { globalScrappingArrays } from "../utils/types";
import * as col from '../utils/colors'

export class Spider {
    private readonly cli: SpiderCli = new SpiderCli()
    private readonly scrapper: SpiderScrapper
    private readonly arrays: globalScrappingArrays = {
        rawLinks: [],
        filteredLinks: [],
        imageLinks: []
    }

    constructor() {
        console.log("Initialising Spider" + (this.cli.opts.recursive ? " - Recursive Mode - Depth:" + this.cli.opts.length : "") + " - Output Directory: " + this.cli.opts.path + " - Target: " + this.cli.target)
        this.arrays.filteredLinks.push(this.cli.target.href)
        this.scrapper = new SpiderScrapper(this.cli.target, this.cli.opts, 0)
    }

    public async scrap() {
        await this.scrapper.scrap(this.arrays)
        col.log(col.yellow, "All unique links:")
        for (let filteredLink of this.arrays.filteredLinks) {
            col.log(col.magenta, filteredLink)
        }
    }

}