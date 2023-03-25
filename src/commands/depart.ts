import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getSubmarineList } from "./functions/getSubmarineList";
import { updateSubmarineList } from "./functions/updateSubmarineList";
const wait = require('util').promisify(setTimeout);
import { servers, numbers } from "./types/choices";
import { parseISO8601Duration } from "./functions/parseISO8601Duration";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('depart')
        .setDescription('登録されている潜水艦の出発操作をします')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('出発させたい潜水艦を所持しているFCのサーバー')
                .setRequired(true)
                .addChoices(...servers))
        
        .addStringOption(option => 
            option.setName('numbering')
                .setDescription('出発させたい潜水艦の登録番号')
                .setRequired(true)
                .addChoices(...numbers))
            
        .addStringOption(option => 
            option.setName('required_time')
                .setDescription('所要時間:PTxDxHxM (無指定は直前繰り返し')
                .setRequired(false))
    ,
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const server = interaction.options.getString('server');
        const numbering = interaction.options.getString('numbering');
        const requiredTime = interaction.options.getString('required_time');

        try {
            //引数が取得できなかった
            if (server === null || numbering === null) {
                await interaction.editReply("Error: NULL_PARAMETER");
                throw Error('NULL_PARAMETER');
            }

            //DBから潜水艦を取得する
            const submarine = await getSubmarineList(server, numbering);

            //DBに潜水艦が登録されていなかった
            if (submarine.length === 0) {
                await interaction.editReply("Error: SUBMARINE_NOT_FOUND");
                throw Error('SUBMARINE_NOT_FOUND');
            }

            //潜水艦が既に出発している
            const nowTime = new Date();
            const arrivalTime = new Date(submarine[0].arrival_time);
            if (submarine[0].arrival_time !== '0') {
                if (nowTime < arrivalTime) {
                    await interaction.editReply("Error: SUBMARINE_ALREADY_DEPARTED");
                    throw Error('SUBMARINE_ALREADY_DEPARTED');
                }
            }

            //出発処理をする
            await updateSubmarineList(server, numbering, regenerateRequiredTimeISO8601(requiredTime, submarine[0].required_time));     
            await interaction.editReply("Success to depart");

        } catch (error: any) {
            console.log(error);
        } finally {
            await wait(10 * 1000);
            await interaction.deleteReply();
        }
    }
}

const regenerateRequiredTimeISO8601 = (userInputRequiredTime: string | null, databaseHistoryRequiredTime: string): string => {
    if (userInputRequiredTime === null) {
        return databaseHistoryRequiredTime;
    } else {
        return parseISO8601Duration(userInputRequiredTime).toString();
    }
}