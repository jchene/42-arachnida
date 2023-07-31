import { ustring } from "../../typedefs/types"
import { v4 as uuidv4 } from "uuid"
import axios from 'axios'
import fs from 'fs'

export class ScrappedImage {
    public readonly url: URL | undefined

    /*constructor(url: ustring) {
        if (!url) return
        this.url = new URL(url)
        this.fullName = array[array.length - 1]
        array = this.fullName.split(".")
        this.extension = array[array.length - 1]
        this.name = this.fullName.slice(0, this.fullName.length - (this.extension.length + 1))
        this.uri = uri
        console.log("New image:", this.uri, '\nname:', this.name, "\next:", this.extension, "\nfull name:", this.fullName)
    }

    public async download() {
        const id = uuidv4()
        try {
            const response = await axios({
                method: 'GET',
                url: this.url,
                responseType: 'stream',
            });
            const writer = response.data.pipe(fs.createWriteStream(`./dist/${this.name}_${id}_${this.extension}`));
            return new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    console.log("Succesfully downloaded image", this.fullName)
                    resolve
                });
                writer.on('error', reject);
            });
        }
        catch (e) {
            if (this.url && this.fullName)
                console.log("Couldn't downlod image:", this.url)
            console.log(e)
        }
    }*/
}