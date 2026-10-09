import { SpiderCli } from "./SpiderCli";
import { SpiderScraper } from "./SpiderScraper";
import { globalScrapingArrays } from "./types/types";
import * as col from "../utils/colors"

export class Spider {
	private readonly cli: SpiderCli
	private readonly scraper: SpiderScraper
	private readonly arrays: globalScrapingArrays = {
		imageTypes: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
		rawLinks: [],
		filteredLinks: [],
		filteredImageLinks: []
	}

	constructor() {
		try { this.cli = new SpiderCli() }
		catch (e) { 
			console.log(col.red + e + col.reset)
			process.exit(1)
		}
		console.log(col.green + "Initialising Spider" +
			(this.cli.opts.recursive ? " - Recursive Mode - Depth:" + this.cli.opts.length : "")
			+ " - Output Directory: " + this.cli.opts.path
			+ " - Target: " + this.cli.target + col.reset)
		this.arrays.filteredLinks.push(this.cli.target.href)
		this.scraper = new SpiderScraper(this.cli.target, this.cli.opts, '1')
	}

	public async scrape() {
		await this.scraper.scrape(this.arrays)
		console.log(col.green + "\nSpider finished it's work after browsing",
			col.yellow + this.arrays.filteredLinks.length,
			col.green + "different links inside",
			col.yellow + this.cli.target.hostname + col.reset)
	}

}