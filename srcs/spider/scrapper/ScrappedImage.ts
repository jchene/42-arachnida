import { ustring } from "../../utils/types"
import { v4 as uuidv4 } from "uuid"
import axios from 'axios'
import fs from 'fs'

export class ScrappedImage {
    public readonly url: URL | undefined
    public readonly name: string | undefined
    public readonly ext: string | undefined

    constructor(url: ustring) {
        if (!url) return
        try { 
            this.url = new URL(url)
            let tmp = this.url.pathname.split('/')
            let fullName = tmp[tmp.length - 1]
            this.name = fullName.slice(0, fullName.length - 4)
            tmp = fullName.split('.')
            this.ext = tmp[tmp.length - 1]
        }
        catch { return }
        console.log("name:", this.name, "ext:", this.ext, "\nURL:", this.url)
    }

    public async download() {
        const id = uuidv4()
        try {
            const response = await axios({
                method: 'GET',
                url: this.url?.href,
                responseType: 'stream',
            });
            const writer = response.data.pipe(fs.createWriteStream(`./dist/${this.name}_${id}.${this.ext}`));
            return new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    console.log("Succesfully downloaded image", this.url?.hostname)
                    resolve
                });
                writer.on('error', reject);
            });
        }
        catch (e) {
            if (this.url && this.url?.hostname)
                console.log("Couldn't downlod image:", this.url)
            console.log(e)
        }
    }
}