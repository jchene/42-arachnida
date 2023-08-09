import { Command } from "commander"
import * as col from '../utils/colors'
import fs from 'fs'

export class ScorpionCli {
	private readonly command: Command = new Command()
	private readonly imageTypes: string[] = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
	private readonly args: string[]

	public readonly files: string[] = []

	constructor() {
		this.command
			.argument('<file>')
			.parse(process.argv)
		this.args = this.command.args
		for (let arg of this.args) {
			if (!fs.existsSync(arg)){
				console.log(col.red + `${arg}: Bad path`)
				continue
			}
			if (!fs.lstatSync(arg).isFile()){
				console.log(col.red + `${arg}: Not a file`)
				continue
			}
			let split = arg.split('.')
			if (!split.length || !this.imageTypes.includes(split[split.length - 1])){
				console.log(col.red + `${arg}: Not an image`)
				continue
			}
			if (!this.files.includes(arg))
				this.files.push(arg)
		}
		if (!this.files.length)
			throw `None of the provided files were images`
	}
}
