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
exports.updateSubmarineList = void 0;
const sqlite3 = require('sqlite3').verbose();
const settings_1 = require("../settings/settings");
const convertMs2DHM_1 = require("./convertMs2DHM");
const convertUTC2JST_1 = require("./convertUTC2JST");
const updateSubmarineList = (server, numbering, requiredTimeISO8601) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new sqlite3.Database(settings_1.databaseDirectory);
    const request = `UPDATE submarine_list SET departure_time = ?, required_time = ?, arrival_time = ?, departure_show = ?, duration_show = ?, arrival_show = ? WHERE server = ? AND numbering = ?`;
    const utc = new Date();
    const jstDeparture = (0, convertUTC2JST_1.convertUTC2JST)(utc);
    const jst = new Date(utc.getTime() + parseInt(requiredTimeISO8601, 10));
    const jstArrival = (0, convertUTC2JST_1.convertUTC2JST)(jst);
    const dhmDuration = (0, convertMs2DHM_1.convertMs2DHM)(requiredTimeISO8601);
    const params = [jstDeparture, requiredTimeISO8601, jstArrival, (jstDeparture.slice(5, 16)).replace('T', ' '), dhmDuration, (jstArrival.slice(5, 16)).replace('T', ' '), server, numbering];
    yield new Promise((resolve, reject) => {
        db.run(request, params, (err) => {
            if (err) {
                console.log(err);
                reject();
            }
            else {
                resolve();
            }
        });
    });
});
exports.updateSubmarineList = updateSubmarineList;
