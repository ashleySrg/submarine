import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
const wait = require('util').promisify(setTimeout);
import { insertNewSubmarine } from "./functions/insertNewSubmarine";
import { servers, numbers } from "./types/choices";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('新規の潜水艦をDBに登録します')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('登録したい潜水艦を所持しているFCのサーバー名')
                .setRequired(true)
                .addChoices(...servers))
        
        .addStringOption(option => 
            option.setName('numbering')
                .setDescription('登録したい潜水艦の登録番号')
                .setRequired(true)
                .addChoices(...numbers))
            
        .addStringOption(option => 
            option.setName('name')
                .setDescription('潜水艦の名前')
                .setRequired(true))
    ,
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const server: string | null = interaction.options.getString('server');
        const numbering: string | null = interaction.options.getString('numbering');
        const name: string | null = interaction.options.getString('name');

        if (server && numbering && name) {
            try {
                await insertNewSubmarine(server, numbering, name);
                await interaction.editReply(`登録完了:${server}#${numbering}:${name}`);
            } catch (err: any) {
                console.log('[add.ts]' + err)
                await interaction.editReply(`DBに登録できませんでした。`);
            } finally {
                await wait(10*1000);
                await interaction.deleteReply();
            }
        }
    }
}