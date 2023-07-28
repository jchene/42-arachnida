import axios from 'axios'

export class SpiderScrapper {
    private targetURL: string

    constructor() {
        this.targetURL = ''
    }

    public setTarget(url: string){
        this.targetURL = url
    }

    public async dig() {
        try {
            const response = await axios.get(this.targetURL)
            console.log(response)
        }
        catch {
            console.log("error: couldn't get", this.targetURL, "content")
        }
    }
}