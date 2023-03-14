"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendClient = void 0;
const discord_js_1 = require("discord.js");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
class ExtendClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.Collection();
        this.loadCommands();
    }
    loadCommands() {
        const commandPath = node_path_1.default.join(__dirname, '..');
        const commandFiles = node_fs_1.default.readdirSync(commandPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = node_path_1.default.join(commandPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                this.commands.set(command.data.name, command);
                console.log(`\n\u001b[32m[SUCCESS] ${command.data.name} was successfully registered.\u001b[0m`);
            }
            else {
                console.log(`[WARNING] The command at ${filePath} is missing a "data" or "execute" property.`);
            }
        }
    }
}
exports.ExtendClient = ExtendClient;
