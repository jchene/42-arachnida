import { Command } from "commander";

export class ScorpionCli {
	private readonly command: Command = new Command()
    public readonly args: string [] 

    constructor() {
        this.command
            .argument('<file>')
            .parse(process.argv)
        this.args = this.command.args
        this.parseOptions()
    }

	private exitError (code: number, message: string) {
		console.error(message)
		process.exit(code)
	}
	private parseOptions() {
	}
}