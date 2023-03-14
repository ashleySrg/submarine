import { Message, Client, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { ExtendClient } from './src/classes/ExtendClient';
import cron from 'node-cron';

dotenv.config();

//潜水艦の一覧を取得し、時間が迫っているか通知する。
cron.schedule('*/10 * * * * *', () => {
	console.log(`定期実行 @ ${new Date().toString()}`);
});

const client = new ExtendClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
	],
});

client.once(Events.ClientReady, (c: Client) => {
    console.log(`\n\u001b[32mReady! Logged in as ${c.user?.tag}\u001b[0m`);
});

client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) {
        return;
    }
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error: any) {
		console.error(`[index.js]Error executing ${interaction.commandName}`);
		console.error(error);
	}
});

client.login(process.env.TOKEN);