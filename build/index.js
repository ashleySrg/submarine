"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const ExtendClient_1 = require("./src/classes/ExtendClient");
const node_cron_1 = __importDefault(require("node-cron"));
dotenv_1.default.config();
//潜水艦の一覧を取得し、時間が迫っているか通知する。
node_cron_1.default.schedule('*/10 * * * * *', () => {
    console.log(`定期実行 @ ${new Date().toString()}`);
});
const client = new ExtendClient_1.ExtendClient({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ],
});
client.once(discord_js_1.Events.ClientReady, (c) => {
    var _a;
    console.log(`\n\u001b[32mReady! Logged in as ${(_a = c.user) === null || _a === void 0 ? void 0 : _a.tag}\u001b[0m`);
});
client.on(discord_js_1.Events.MessageCreate, (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot) {
        return;
    }
}));
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isChatInputCommand())
        return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        yield command.execute(interaction);
    }
    catch (error) {
        console.error(`[index.js]Error executing ${interaction.commandName}`);
        console.error(error);
    }
}));
client.login(process.env.TOKEN);
