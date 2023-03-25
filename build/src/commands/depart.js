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
const getSubmarineList_1 = require("./functions/getSubmarineList");
const updateSubmarineList_1 = require("./functions/updateSubmarineList");
const wait = require('util').promisify(setTimeout);
const choices_1 = require("./types/choices");
const parseISO8601Duration_1 = require("./functions/parseISO8601Duration");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('depart')
        .setDescription('登録されている潜水艦の出発操作をします')
        .addStringOption(option => option.setName('server')
        .setDescription('出発させたい潜水艦を所持しているFCのサーバー')
        .setRequired(true)
        .addChoices(...choices_1.servers))
        .addStringOption(option => option.setName('numbering')
        .setDescription('出発させたい潜水艦の登録番号')
        .setRequired(true)
        .addChoices(...choices_1.numbers))
        .addStringOption(option => option.setName('required_time')
        .setDescription('所要時間:PTxDxHxM (無指定は直前繰り返し')
        .setRequired(false)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const server = interaction.options.getString('server');
            const numbering = interaction.options.getString('numbering');
            const requiredTime = interaction.options.getString('required_time');
            try {
                //引数が取得できなかった
                if (server === null || numbering === null) {
                    yield interaction.editReply("Error: NULL_PARAMETER");
                    throw Error('NULL_PARAMETER');
                }
                //DBから潜水艦を取得する
                const submarine = yield (0, getSubmarineList_1.getSubmarineList)(server, numbering);
                //DBに潜水艦が登録されていなかった
                if (submarine.length === 0) {
                    yield interaction.editReply("Error: SUBMARINE_NOT_FOUND");
                    throw Error('SUBMARINE_NOT_FOUND');
                }
                //潜水艦が既に出発している
                const nowTime = new Date();
                const arrivalTime = new Date(submarine[0].arrival_time);
                if (submarine[0].arrival_time !== '0') {
                    if (nowTime < arrivalTime) {
                        yield interaction.editReply("Error: SUBMARINE_ALREADY_DEPARTED");
                        throw Error('SUBMARINE_ALREADY_DEPARTED');
                    }
                }
                //出発処理をする
                yield (0, updateSubmarineList_1.updateSubmarineList)(server, numbering, regenerateRequiredTimeISO8601(requiredTime, submarine[0].required_time));
                yield interaction.editReply("Success to depart");
            }
            catch (error) {
                console.log(error);
            }
            finally {
                yield wait(10 * 1000);
                yield interaction.deleteReply();
            }
        });
    }
};
const regenerateRequiredTimeISO8601 = (userInputRequiredTime, databaseHistoryRequiredTime) => {
    if (userInputRequiredTime === null) {
        return databaseHistoryRequiredTime;
    }
    else {
        return (0, parseISO8601Duration_1.parseISO8601Duration)(userInputRequiredTime).toString();
    }
};
