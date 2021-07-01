export interface Flags {
    server?: string;
    subject: string;
    payload: any;
    options: { [key: string]: string };
}

class ArgParser {
    args: string[];
    // tslint:disable-next-line:ban-types
    usage: Function;
    flags?: string[];

    // tslint:disable-next-line:ban-types
    constructor(args: string[], usage: Function, flags: string[]) {
        this.args = args;
        this.usage = usage;
        this.flags = flags;
    }

    getOpt(flag: string): string | undefined {
        const si = this.args.indexOf(flag);
        if (si !== -1) {
            const v = this.args[si + 1];
            this.args.splice(si, 2);
            return v;
        }
        return undefined;
    }

    parseFlags(): Flags {
        const opts = {} as Flags;
        opts.server = this.getOpt('-s');

        if (this.flags) {
            opts.options = {} as { [key: string]: string };
            this.flags.forEach((f) => {
                const v = this.getOpt('-' + f);
                if (v) {
                    opts.options[f] = v;
                }
            });
        }

        // should have one or two elements left
        if (this.args.length < 1) {
            this.usage();
        }
        opts.subject = this.args[0] || '';
        opts.payload = this.args[1] || '';

        return opts;
    }
}

// tslint:disable-next-line:ban-types
export function parseFlags(args: string[], usage: Function, flags: string[]): Flags {
    const p = new ArgParser(args, usage, flags);
    return p.parseFlags();
}
