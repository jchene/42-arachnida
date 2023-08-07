import cheerio from 'cheerio'
import axios from 'axios'
import { AxiosResponse } from 'axios'
import { OptionValues } from 'commander'

import { ScrappedImage } from './ScrappedImage'
import { globalScrappingArrays } from '../../utils/types'
import * as col from '../../utils/colors'

export class SpiderScrapper {
	private readonly targetURL: URL
	private readonly opts: OptionValues
	private readonly inceptionLevel: number
	private currentImages: string[] = []
	private currentLinks: string[] = []

	constructor(targetURL: URL, options: OptionValues, inceptionLevel: number) {
		this.targetURL = targetURL
		this.opts = options
		this.inceptionLevel = inceptionLevel + 1
	}

	private printDepth(): string {
		let depthString = ""
		for (let i = 0; i < this.inceptionLevel; i++)
			depthString += "-"
		return depthString
	}

	private filterLink(rawLink: string): string | undefined {
		if (rawLink?.startsWith('http')) {
			let url: URL
			try { url = new URL(rawLink) }
			catch { return undefined }
			if (url.host != this.targetURL.host) return undefined
			else return rawLink
		}
		else if (rawLink?.startsWith('//')) return this.filterLink(this.targetURL.protocol + rawLink)
		else if (rawLink?.startsWith('/')) return this.targetURL.origin + rawLink
		else return undefined
	}

	private getObjects(data: cheerio.Root, beacon: string, attribute: string, currentArray: string[], globalArray: string[], rawArray: string[]) {
		let i = 0
		data(beacon).each((index: number, element: cheerio.Element) => {
			let object = data(element).attr(attribute)
			if (object) {
				if (rawArray.includes(object)) return
				rawArray.push(object)
				let filteredLink: string | undefined = this.filterLink(object)
				if (filteredLink) {
					if (!globalArray.includes(filteredLink)) {
						globalArray.push(filteredLink)
						currentArray.push(filteredLink)
						i++
					}
				}
			}
		})
		console.log(col.yellow, `${i} '${beacon}' objects were found`)
	}


	private async fetchPage(url: string): Promise<string> {
		let response: AxiosResponse<any, any>
		try { response = await axios.get(url, { validateStatus: (status) => status < 400 }) }
		catch { throw "Fetch failed at: " + url }
		if (response.headers['content-type'].includes('application'))
			throw "Downloader detected at: " + url
		return response.data
	}

	public async scrap(arr: globalScrappingArrays) {
		if (!this.targetURL) return
		let responseData: string
		responseData = await this.fetchPage(this.targetURL.href)
		const data = cheerio.load(responseData)
		console.log(col.cyan, "\n", this.printDepth(), "Link:" + this.targetURL.href)
		this.getObjects(data, 'img', 'src', this.currentImages, arr.imageLinks, arr.rawLinks)
		for (let image of this.currentImages) {
			if (image) {
				let scrappedImage: ScrappedImage
				try { scrappedImage = new ScrappedImage(image) }
				catch (e) { 
					console.log(col.red, "Couldn't scrap image", image + ":", e)
					continue
				}
				await scrappedImage.download(this.opts.path)
			}
		}
		this.getObjects(data, 'a', 'href', this.currentLinks, arr.filteredLinks, arr.rawLinks)
		for (let link of this.currentLinks) {
			if (link) {
				if (this.inceptionLevel + 1 > this.opts.length) { continue }
				let childScrapper = new SpiderScrapper(new URL(link), this.opts, this.inceptionLevel)
				try { await childScrapper.scrap(arr) }
				catch (e) { console.log(col.red, e) }
			}
		}
	}
}