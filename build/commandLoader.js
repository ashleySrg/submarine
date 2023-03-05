"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCommands = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function loadCommands(client) {
    const commandPath = node_path_1.default.join(__dirname, 'commands');
    const commandFiles = node_fs_1.default.readdirSync(commandPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = node_path_1.default.join(commandPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`[SUCCESS] ${command.data.name} was successfully registered.`);
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a "data" or "execute" property.`);
        }
    }
}
exports.loadCommands = loadCommands;
