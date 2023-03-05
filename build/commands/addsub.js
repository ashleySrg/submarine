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
const wait = require('util').promisify(setTimeout);
const node_fs_1 = __importDefault(require("node:fs"));
const insertNewSubmarine_1 = require("../insertNewSubmarine");
const myTypes_1 = require("../myTypes");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('addsub')
        .setDescription('新規の潜水艦をDBに登録します')
        .addStringOption(option => option.setName('server')
        .setDescription('登録したい潜水艦を所持しているFCのサーバー名')
        .setRequired(true)
        .addChoices({ name: 'Anima', value: 'Anima' }, { name: 'Asura', value: 'Asura' }, { name: 'Chocobo', value: 'Chocobo' }, { name: 'Hades', value: 'Hades' }, { name: 'Ixion', value: 'Ixion' }, { name: 'Masamune', value: 'Masamune' }, { name: 'Pandaemonium', value: 'Pandaemonium' }, { name: 'Titan', value: 'Titan' }))
        .addIntegerOption(option => option.setName('numbering')
        .setDescription('登録したい潜水艦の登録番号')
        .setRequired(true)
        .addChoices({ name: '1', value: 1 }, { name: '2', value: 2 }, { name: '3', value: 3 }, { name: '4', value: 4 }))
        .addStringOption(option => option.setName('name')
        .setDescription('潜水艦の名前')
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            interaction.deferReply();
            let server;
            let numbering;
            let name;
            try {
                server = interaction.options.getString('server');
                numbering = interaction.options.getInteger('numbering');
                name = interaction.options.getString('name');
                if (server && numbering && name) {
                    const result = yield (0, insertNewSubmarine_1.insertNewSubmarine)(server, numbering, name);
                    if (result) {
                        yield interaction.editReply(`${server}の${numbering}番目の潜水艦「${name}」をDBに登録しました`);
                    }
                    else {
                        yield interaction.editReply('データベースへの登録に失敗しました');
                    }
                    yield wait(5000);
                    yield interaction.deleteReply();
                }
            }
            catch (err) {
                console.error(err);
                node_fs_1.default.appendFile('error.log', `${new Date().toISOString()} ${err.stack}\n`, (err) => {
                    if (err)
                        console.error(err);
                });
                switch (err) {
                    case myTypes_1.DatabaseException.DUPLICATION_EXCEPTION:
                        yield interaction.editReply(`サーバー名:${server},潜水艦登録番号:#${numbering}は既に登録されています。`);
                        break;
                    default:
                        yield interaction.editReply('予期しない例外が発生しました。');
                        break;
                }
            }
        });
    },
};
