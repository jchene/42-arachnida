import { ustring } from "../../utils/types"
import * as col from '../../utils/colors'
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
        console.log("name:", this.name, "ext:", this.ext)
    }

    public async download(path: ustring) {
        const id = uuidv4();
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: this.url?.href,
                responseType: 'stream',
            })
            .then(response => {
                const writer = response.data.pipe(fs.createWriteStream(`./${path}/${this.name}_${id}.${this.ext}`));
                writer.on('finish', () => {
                    col.log(col.green, "Successfully downloaded image " + this.url?.pathname);
                    resolve(null);
                });
                writer.on('error', reject);
            })
            .catch(e => {
                col.log(col.red, "Couldn't download image: " + this.url);
                reject(e);
            });
        });
    }    
}