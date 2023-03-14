import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { serversPlusAll } from "./types/choices";
import { SubmarineInformation } from "./functions/myTypes";
import { getSubmarineList } from "./functions/getSubmarineList";
const wait = require('util').promisify(setTimeout);

const LoadingEmoji = ':arrows_counterclockwise:';
const CompleteEmoji = ':white_check_mark:';
const FailedEmoji = ':x:';

function createTableEmbed(submarineList: SubmarineInformation[]) {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('登録潜水艦一覧')
        .setDescription('The List of Registered Submarines');

    let fieldText = '●登録番号\t\t●潜水艦名\t\t●出発時刻\t\t●所要時間\n';
    submarineList.forEach((submarine) => {
        fieldText += `${submarine.server}:#${submarine.numbering}\t${submarine.name}\t${submarine.departure_time}\t${submarine.required_time}\n`;
    });

    embed.addFields(
        { name: 'ServerName', value: fieldText, inline: true }
    );

    return embed;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('現在DBに登録されている潜水艦の情報を表示します')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('リスト表示したいFCのサーバー')
                .setRequired(true)
                .addChoices(...serversPlusAll))
    ,
    async execute(interaction: ChatInputCommandInteraction) {
        const server: string | null = interaction.options.getString('server');
        await interaction.deferReply();
        await interaction.editReply(LoadingEmoji + 'Fecthing Data From DB');

        try {
            const result: SubmarineInformation[] = await getSubmarineList(server!);
            await interaction.editReply(CompleteEmoji + 'Fetching Data from DB\n' + LoadingEmoji + 'Generating Result Table');

            const embedMessage = createTableEmbed(result);
            await interaction.editReply(CompleteEmoji + 'Fetching Data from DB\n' + CompleteEmoji + 'Generating Result Table');
            await interaction.editReply({ embeds: [embedMessage] });
            await interaction.editReply(CompleteEmoji + 'Request Complete');
        } catch (err: any) {
            console.log(err);
            await interaction.editReply(FailedEmoji + 'Fecthing Data From DB');
            await interaction.deleteReply();
        } finally {
            await wait(5000);
            await interaction.deleteReply();
        }
    }
}

