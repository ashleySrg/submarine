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
exports.checkTime = void 0;
const columnify_1 = __importDefault(require("columnify"));
const getSubmarineList_1 = require("../commands/functions/getSubmarineList");
const checkTime = () => __awaiter(void 0, void 0, void 0, function* () {
    process.stdout.write('\u001B[3J\u001B[H\u001B[2J');
    process.stdout.write('\r' + new Date().toString() + '\n');
    const submarineList = yield (0, getSubmarineList_1.getSubmarineList)('All');
    process.stdout.write((0, columnify_1.default)(submarineList, {
        columnSplitter: '|'
    }));
    process.stdout.write('\n\n');
    const nowTime = new Date();
    submarineList.forEach(submarine => {
        if (submarine.departure_time !== '0') {
            const departureTime = new Date(submarine.departure_time);
            const requiredTime = submarine.required_time;
            const arrivalTime = new Date(departureTime.getTime() + Number.parseInt(requiredTime));
            if (arrivalTime <= nowTime) {
                console.log(`NOTICE: ${submarine.server}#${submarine.numbering}`);
            }
        }
    });
});
exports.checkTime = checkTime;
