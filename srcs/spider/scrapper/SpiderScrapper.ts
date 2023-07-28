import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'
import { ustring } from '../../typedefs/types'

export class SpiderScrapper {
    private readonly targetURL: ustring
    private readonly inceptionLevel: number

    private currentImages: ustring[] = []
    private currentLinks: ustring[] = []

    constructor(targetURL: ustring, inceptionLevel: number) {
        this.targetURL = targetURL
        this.inceptionLevel = inceptionLevel + 1
    }

    private getObjects(data: cheerio.Root, beacon: string, attribute: string, currentArray: ustring[], globalArray: ustring[]) {
        data(beacon).each((index: number, element: cheerio.Element) => {
            let object = data(element).attr(attribute)
            if (!globalArray.includes(object)) {
                globalArray.push(object)
                currentArray.push(object)
            }
        })  
    }

    private async downloadImage(url: string, imagePath: string) {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
        });
        const writer = response.data.pipe(fs.createWriteStream(imagePath));
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    };


    public async scrap(linkList: ustring[], imageLinks: ustring[], depth: number) {
        if (this.targetURL === undefined)
            return
        try {
            const response = await axios.get(this.targetURL)
            const data = cheerio.load(response.data)
            this.getObjects(data, 'img', 'src', this.currentImages, imageLinks)
            console.log("\nLink:", this.targetURL)
            for (let image of this.currentImages) {
                console.log("Image:", image)
                try {
                    await this.downloadImage(this.targetURL + image, './dist' + image)
                }
                catch (e){
                    console.log("Couldn't downlod image:", this.targetURL + image)
                    console.log(e)
                }
            }
            this.getObjects(data, 'a', 'href', this.currentLinks, linkList)
            for (let link of this.currentLinks) {
                if (this.inceptionLevel + 1 > depth) { continue }
                let childScrapper = new SpiderScrapper(link, this.inceptionLevel)
                await childScrapper.scrap(linkList, imageLinks, depth)
            }
        }
        catch {
            console.log("Couldn't reach", this.targetURL)
        }
    }
}