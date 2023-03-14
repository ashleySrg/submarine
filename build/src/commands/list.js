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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const choices_1 = require("./types/choices");
const getSubmarineList_1 = require("./functions/getSubmarineList");
const wait = require('util').promisify(setTimeout);
const LoadingEmoji = ':arrows_counterclockwise:';
const CompleteEmoji = ':white_check_mark:';
const FailedEmoji = ':x:';
function createTableEmbed(submarineList) {
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('登録潜水艦一覧')
        .setDescription('The List of Registered Submarines');
    let fieldText = '●登録番号\t\t●潜水艦名\t\t●出発時刻\t\t●所要時間\n';
    submarineList.forEach((submarine) => {
        fieldText += `${submarine.server}:#${submarine.numbering}\t${submarine.name}\t${submarine.departure_time}\t${submarine.required_time}\n`;
    });
    embed.addFields({ name: 'ServerName', value: fieldText, inline: true });
    return embed;
}
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('list')
        .setDescription('現在DBに登録されている潜水艦の情報を表示します')
        .addStringOption(option => option.setName('server')
        .setDescription('リスト表示したいFCのサーバー')
        .setRequired(true)
        .addChoices(...choices_1.serversPlusAll)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = interaction.options.getString('server');
            yield interaction.deferReply();
            yield interaction.editReply(LoadingEmoji + 'Fecthing Data From DB');
            try {
                const result = yield (0, getSubmarineList_1.getSubmarineList)(server);
                yield interaction.editReply(CompleteEmoji + 'Fetching Data from DB\n' + LoadingEmoji + 'Generating Result Table');
                const embedMessage = createTableEmbed(result);
                yield interaction.editReply(CompleteEmoji + 'Fetching Data from DB\n' + CompleteEmoji + 'Generating Result Table');
                yield interaction.editReply({ embeds: [embedMessage] });
                yield interaction.editReply(CompleteEmoji + 'Request Complete');
            }
            catch (err) {
                console.log(err);
                yield interaction.editReply(FailedEmoji + 'Fecthing Data From DB');
                yield interaction.deleteReply();
            }
            finally {
                yield wait(5000);
                yield interaction.deleteReply();
            }
        });
    }
};
