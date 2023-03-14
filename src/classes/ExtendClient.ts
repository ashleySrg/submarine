import { Collection, Client, ClientOptions } from "discord.js";
import fs from 'node:fs';
import path from 'node:path';

type Command = {
    data: {
        name: string;
        description: string;
        options: Array<any>;
    },
    execute: Function
};

export class ExtendClient extends Client {
    constructor(options: ClientOptions) {
        super(options);
        this.loadCommands();

    }
    public commands: Collection<string, Command> = new Collection();
    private loadCommands() {
        const commandPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
        console.log(commandPath);

        for (const file of commandFiles) {
            const filePath = path.join(commandPath, file);
            const command = require(filePath);

            if ('data' in command && 'execute' in command) {
                this.commands.set(command.data.name, command);
                console.log(`(/)${command.data.name} was successfully registered.`)
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a "data" or "execute" property.`);
            }
        }
    }
}