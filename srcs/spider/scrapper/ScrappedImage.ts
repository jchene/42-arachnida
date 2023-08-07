import * as col from '../../utils/colors'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import fs from 'fs'

export class ScrappedImage {
	private readonly extensionWhitelist: string[]
	public readonly url: URL
	public readonly name: string
	public readonly ext: string

	constructor(url: string) {
		this.extensionWhitelist = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
		try { this.url = new URL(url) }
		catch { throw "Bad URL" }
		let tmp = this.url?.pathname.split('/')
		let fullName = tmp[tmp.length - 1]
		tmp = fullName.split('.')
		if (tmp.length < 2)
			throw "Bad name"
		this.name = tmp[0]
		this.ext = tmp[tmp.length - 1]
		if (!this.extensionWhitelist.includes(this.ext))
			throw "Bad extension"
	}

	public async download(path: string) {
		const id = uuidv4();
		return new Promise((resolve, reject) => {
			axios({
				method: 'GET',
				url: this.url?.href,
				responseType: 'stream',
			})
				.then(response => {
					try {
						const writer = response.data.pipe(fs.createWriteStream(`${path}/${this.name}_${id}.${this.ext}`))
						writer.on('finish', () => {
							console.log(col.green, "Successfully downloaded image", this.url?.pathname)
							resolve(null)
						});
						writer.on('error', reject)
					}
					catch {
						console.log(col.red, "Couldn't write image to path:", path)
						return
					}
				})
				.catch(e => {
					console.log(col.red, "Couldn't download image", this.url + ": Get failed")
					reject(e);
				});
		});
	}
}