import { Command, OptionValues } from "commander";

export class ScorpionCli {
	private readonly command: Command = new Command()
	constructor() {
		
	}

	private exitError (code: number, message: string) {
		console.error(message)
		process.exit(code)
	}
	private parseOptions() {
		
	}

	public getOptions(): OptionValues {
		return this.command.opts()
	}
}