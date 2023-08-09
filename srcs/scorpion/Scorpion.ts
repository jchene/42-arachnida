import { ScorpionCli } from './ScorpionCli';
import * as col from '../utils/colors'
import { ScorpionReader } from './ScorpionReader';

export class Scorpion {
	private cli: ScorpionCli
	private reader: ScorpionReader = new ScorpionReader()

	constructor() {
		try { this.cli = new ScorpionCli() }
		catch (e) {
			console.log(col.red + "Error:", e)
			process.exit(1)
		}
		console.log(col.reset + "Initialising Scorpion on", this.cli.files)
	}

	public async extract(){
		for (let image of this.cli.files){
			console.log(col.green + `\nImage ${image}:` + col.reset)
			await this.reader.extract(image).catch((e) => {
				console.log(col.red + `Couldn't extract data from ${image}`)
				console.log(e + col.reset)
			})
		}
	}
}