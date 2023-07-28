import { Command, OptionValues } from "commander";

export class SpiderCli {
    private readonly command: Command = new Command()
    public readonly opts: OptionValues
    public readonly args: string [] 
    constructor() {
        this.command
            .option('-r, --recursive')
            .option('-l, --length <value>')
            .option('-p, --path <value>')
            .argument('<url>')
            .parse(process.argv)
        this.opts = this.command.opts()
        this.args = this.command.args
        this.parseOptions()
    }

    private exitError(code: number, message: string): void {
        console.error(message)
        process.exit(code)
    }
    private parseOptions(): void {
        if (this.opts.recursive === undefined)
            this.opts.recursive = false
        if (this.opts.length === undefined)
            this.opts.length = '5'
        else if (!this.opts.recursive)
            this.exitError(1, 'error: option \'-r, --recursive\' must be provided when using \'-l, --length\'')
        else if (isNaN(Number(this.opts.length)))
            this.exitError(1, 'error: option \'-l, --length\' require a number as value')
        if (!this.opts.path)
            this.opts.path = 'dist'
    }
}