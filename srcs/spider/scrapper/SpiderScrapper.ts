import { OptionValues } from 'commander'
import cheerio from 'cheerio'
import axios from 'axios'
import { ScrappedImage } from './ScrappedImage';
import { ustring } from '../../typedefs/types'

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
        if (rawLink?.startsWith('#'))
            return undefined
        else if (rawLink?.startsWith('http')) {
            let url: URL = new URL(rawLink)
            if (url.host != this.targetURL.host)
                return undefined
            else
                return rawLink
        }
        else if (rawLink?.startsWith('//')) {
            let completeLink: ustring = this.targetURL.protocol + rawLink
            return this.filterLink(completeLink)
        }
        else if (rawLink?.startsWith('/')) {
            return this.targetURL.origin + rawLink
        }
    }

    private getObjects(data: cheerio.Root, beacon: string, attribute: string, currentArray: ustring[], globalArray: ustring[]) {
        let i = 0
        data(beacon).each((index: number, element: cheerio.Element) => {
            let object = data(element).attr(attribute)
            if (object) {
                let filteredLink = this.filterLink(object)
                if (filteredLink) {
                    if (!globalArray.includes(filteredLink)) {
                        globalArray.push(filteredLink)
                        currentArray.push(filteredLink)
                        i++
                    }
                }
            }
        })
        console.log(`\n${i} '${beacon}' objects were found`)
    }

    public async scrap(linkList: ustring[], imageLinks: ustring[]) {
        if (this.targetURL === undefined) return
        let response
        try { response = await axios.get(this.targetURL.toString()) }
        catch {
            console.log("Couldn't reach", this.targetURL.toString())
            return
        }
        const data = cheerio.load(response.data)
        console.log("\n-------------------------------------------------------------\nLink:", this.targetURL)
        this.getObjects(data, 'img', 'src', this.currentImages, imageLinks)
        for (let image of this.currentImages) {
            console.log("img:", image)
            /*if (image) {
                let scrappedImage: ScrappedImage = new ScrappedImage(image)
                await scrappedImage.download()
            }*/
        }
        this.getObjects(data, 'a', 'href', this.currentLinks, linkList)
        for (let link of this.currentLinks)
            console.log("link:", link)
        for (let link of this.currentLinks) {
            if (link) {
                if (this.inceptionLevel + 1 > this.opts.length) { continue }
                let childScrapper = new SpiderScrapper(new URL(link), this.opts, this.inceptionLevel)
                await childScrapper.scrap(linkList, imageLinks)
            }
        }
    }
}