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
const wait = require('util').promisify(setTimeout);
const insertNewSubmarine_1 = require("./functions/insertNewSubmarine");
const choices_1 = require("./types/choices");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('add')
        .setDescription('新規の潜水艦をDBに登録します')
        .addStringOption(option => option.setName('server')
        .setDescription('登録したい潜水艦を所持しているFCのサーバー名')
        .setRequired(true)
        .addChoices(...choices_1.servers))
        .addIntegerOption(option => option.setName('numbering')
        .setDescription('登録したい潜水艦の登録番号')
        .setRequired(true)
        .addChoices(...choices_1.numbers))
        .addStringOption(option => option.setName('name')
        .setDescription('潜水艦の名前')
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const server = interaction.options.getString('server');
            const numbering = interaction.options.getInteger('numbering');
            const name = interaction.options.getString('name');
            if (server && numbering && name) {
                try {
                    yield (0, insertNewSubmarine_1.insertNewSubmarine)(server, numbering, name);
                    yield interaction.editReply(`${server}の${numbering}番目の潜水艦「${name}」をDBに登録しました`);
                }
                catch (err) {
                    console.log('[add.ts]' + err);
                    yield interaction.editReply(`DBに登録できませんでした。`);
                }
                finally {
                    yield wait(5000);
                    yield interaction.deleteReply();
                }
            }
        });
    }
};
