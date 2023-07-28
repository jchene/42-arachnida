import { Command, OptionValues } from "commander";

export class SpiderCli {
	private readonly command: Command = new Command()
	constructor() {
		this.command
			.option('-r, --recursive')
			.option('-l, --length <value>')
			.option('-p, --path <value>')
			.parse(process.argv)
		this.parseOptions()
	}

	private exitError(code: number, message: string): void {
		console.error(message)
		process.exit(code)
	}
	private parseOptions(): void {
		let options: OptionValues = this.command.opts()
		if (options.recursive === undefined)
			options.recursive = false
		if (options.length === undefined)
			options.length = '5'
		else if (!options.recursive)
			this.exitError(1, 'error: option \'-r, --recursive\' must be provided when using \'-l, --length\'')
		else if (isNaN(Number(options.length)))
			this.exitError(1, 'error: option \'-l, --length\' require a number as value')
		if (!options.path)
			options.path = 'dist'
	}

	public getOptions(): OptionValues {
		return this.command.opts()
	}
}