import { Command, OptionValues } from "commander";

export class SpiderCli {
	private readonly command: Command = new Command()
	public readonly opts: OptionValues
	public readonly target: URL
	
	constructor() {
		this.command
			.option('-r, --recursive')
			.option('-l, --length <value>')
			.option('-p, --path <value>')
			.argument('<url>')
			.parse(process.argv)
		this.opts = this.command.opts()
		try { this.target = new URL(this.command.args[0]) }
		catch { throw `${this.command.args[0]}: Bad URL` }
		if (this.opts.recursive === undefined)
			this.opts.recursive = false
		if (this.opts.length === undefined)
			this.opts.length = '5'
		else if (!this.opts.recursive)
			throw 'Option \'-r, --recursive\' must be provided when using \'-l, --length\''
		else if (isNaN(Number(this.opts.length)))
			throw 'Option \'-l, --length\' require a number as value'
		if (!this.opts.path)
			this.opts.path = 'dist'
	}
}