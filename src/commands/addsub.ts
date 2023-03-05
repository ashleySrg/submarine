import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
const wait = require('util').promisify(setTimeout);
import fs from 'node:fs'
import { insertNewSubmarine } from "../insertNewSubmarine";
import { DatabaseException } from "../myTypes";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addsub')
        .setDescription('新規の潜水艦をDBに登録します')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('登録したい潜水艦を所持しているFCのサーバー名')
                .setRequired(true)
                .addChoices(
                    { name: 'Anima', value: 'Anima' },
                    { name: 'Asura', value: 'Asura' },
                    { name: 'Chocobo', value: 'Chocobo' },
                    { name: 'Hades', value: 'Hades' },
                    { name: 'Ixion', value: 'Ixion' },
                    { name: 'Masamune', value: 'Masamune' },
                    { name: 'Pandaemonium', value: 'Pandaemonium' },
                    { name: 'Titan', value: 'Titan' }
            ))
        
        .addIntegerOption(option => 
            option.setName('numbering')
                .setDescription('登録したい潜水艦の登録番号')
                .setRequired(true)
                .addChoices(
                    { name: '1', value: 1 },
                    { name: '2', value: 2 },
                    { name: '3', value: 3 },
                    { name: '4', value: 4 },
            ))
            
        .addStringOption(option => 
            option.setName('name')
                .setDescription('潜水艦の名前')
                .setRequired(true))
    ,
    async execute(interaction: ChatInputCommandInteraction) {
        interaction.deferReply();

        let server: string | null;
        let numbering: number | null;
        let name: string | null;

        try {
            server = interaction.options.getString('server');
            numbering = interaction.options.getInteger('numbering');
            name = interaction.options.getString('name');

            if (server && numbering && name) {
                const result = await insertNewSubmarine(server, numbering, name);
                if (result) {
                    await interaction.editReply(`${server}の${numbering}番目の潜水艦「${name}」をDBに登録しました`);
                } else {
                    await interaction.editReply('データベースへの登録に失敗しました');
                }
                await wait(5000);
                await interaction.deleteReply();
            }
        } catch (err: any) {
            console.error(err);
            fs.appendFile('error.log', `${new Date().toISOString()} ${err.stack}\n`, (err) => {
                if (err) console.error(err);
            });

            switch (err) {
                case DatabaseException.DUPLICATION_EXCEPTION:
                    await interaction.editReply(`サーバー名:${server!},潜水艦登録番号:#${numbering!}は既に登録されています。`);
                    break;
            
                default:
                    await interaction.editReply('予期しない例外が発生しました。')
                    break;
            }
        }
    },
}