import { Message, Client, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import { ExtendClient } from './myTypes';
import { loadCommands } from './commandLoader';

dotenv.config();

const client: ExtendClient = new ExtendClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

loadCommands(client);

client.once(Events.ClientReady, (c: Client) => {
    console.log(`Ready! Logged in as ${c.user?.tag}`);
});

client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) {
        return;
    }
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

    const extendClient = interaction.client as ExtendClient;
	const command = extendClient.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(`Error executing ${interaction.commandName}`);
		console.error(error);
	}
});

client.login(process.env.TOKEN);