import { SpiderCli } from "./cli/SpiderCli";
import { SpiderScrapper } from "./scrapper/SpiderScrapper";
import { globalScrappingArrays } from "../utils/types";
import * as col from "../utils/colors"

export class Spider {
	private readonly cli: SpiderCli
	private readonly scrapper: SpiderScrapper
	private readonly arrays: globalScrappingArrays = {
		imageTypes: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
		rawLinks: [],
		filteredLinks: [],
		imageLinks: []
	}

	constructor() {
		try { this.cli = new SpiderCli() }
		catch (e) { throw "CLI: " + e }
		console.log(col.green + "Initialising Spider" +
			(this.cli.opts.recursive ? " - Recursive Mode - Depth:" + this.cli.opts.length : "")
			+ " - Output Directory: " + this.cli.opts.path
			+ " - Target: " + this.cli.target)
		this.arrays.filteredLinks.push(this.cli.target.href)
		this.scrapper = new SpiderScrapper(this.cli.target, this.cli.opts, 0)
	}

	public async scrap() {
		await this.scrapper.scrap(this.arrays)
		console.log(col.green + "\nSpider finished it's work after browsing",
			col.yellow + this.arrays.filteredLinks.length,
			col.green + "different links inside",
			col.yellow + this.cli.target.hostname)
	}

}