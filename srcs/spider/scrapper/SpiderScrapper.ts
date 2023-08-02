import { OptionValues } from 'commander'
import cheerio from 'cheerio'
import axios from 'axios'
import { ScrappedImage } from './ScrappedImage'
import { ustring, globalScrappingArrays } from '../../utils/types'
import * as col from '../../utils/colors'

export class SpiderScrapper {
    private readonly targetURL: URL
    private readonly opts: OptionValues
    private readonly inceptionLevel: number

    private currentImages: ustring[] = []
    private currentLinks: ustring[] = []

    constructor(targetURL: URL, options: OptionValues, inceptionLevel: number) {
        this.targetURL = targetURL
        this.opts = options
        this.inceptionLevel = inceptionLevel + 1
    }

    private filterLink(rawLink: ustring): ustring {
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

    private getObjects(data: cheerio.Root, beacon: string, attribute: string, currentArray: ustring[], globalArray: ustring[], rawArray: ustring[]) {
        let i = 0
        data(beacon).each((index: number, element: cheerio.Element) => {
            let object = data(element).attr(attribute)
            if (object) {
                if (rawArray.includes(object)) return
                rawArray.push(object)
                let filteredLink = this.filterLink(object)
                if (filteredLink) {
                    if (!globalArray.includes(filteredLink)) {
                        col.log(col.green, "Filtered:" + filteredLink)
                        globalArray.push(filteredLink)
                        currentArray.push(filteredLink)
                        i++
                    }
                }
            }
        })
        col.log(col.yellow, `${i} '${beacon}' objects were found`)
    }


    private async fetchPage(url: string): Promise<string | undefined> {
        try {
            const response = await axios.get(url, { validateStatus: (status) => status < 400 })
            if (response.headers['content-type'].includes('application')) { return }
            return response.data
        }
        catch { return }
    }


    public async scrap(arr: globalScrappingArrays) {
        if (!this.targetURL) return
        const responseData = await this.fetchPage(this.targetURL.href)
        if (!responseData) return
        const data = cheerio.load(responseData)
        col.log(col.cyan, "\n\nLink:" + this.targetURL.href)
        this.getObjects(data, 'img', 'src', this.currentImages, arr.imageLinks, arr.rawLinks)
        for (let image of this.currentImages) {
            if (image) {
                let scrappedImage: ScrappedImage = new ScrappedImage(image)
                await scrappedImage.download(this.opts.path)
            }
        }
        this.getObjects(data, 'a', 'href', this.currentLinks, arr.filteredLinks, arr.rawLinks)
        for (let link of this.currentLinks) {
            if (link) {
                if (this.inceptionLevel + 1 > this.opts.length) { continue }
                try {
                    let childScrapper = new SpiderScrapper(new URL(link), this.opts, this.inceptionLevel)
                    await childScrapper.scrap(arr)
                }
                catch { return }
            }
        }
    }
}