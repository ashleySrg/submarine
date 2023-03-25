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
exports.insertNewSubmarine = void 0;
const settings_1 = require("../settings/settings");
const sqlite3 = require('sqlite3').verbose();
const insertNewSubmarine = (server, numbering, name) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new sqlite3.Database(settings_1.databaseDirectory);
    const getDuplicateRowsSQL = "SELECT * FROM submarine_list WHERE server = ? AND numbering = ?";
    const params = [server, numbering];
    let result;
    yield new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get(getDuplicateRowsSQL, params, (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    result = row;
                    resolve();
                }
            });
        });
    });
    if (result)
        throw Error('Already Exits in Database');
    db.serialize(() => {
        const requestSqlParams = {
            request: 'INSERT INTO submarine_list (server, numbering, name, departure_time, required_time, arrival_time, departure_show, duration_show, arrival_show) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            params: [server, numbering, name, '0', '0', '0', '0', '0', '0']
        };
        db.run(requestSqlParams.request, requestSqlParams.params, (err) => {
            if (err) {
                console.log(err);
                throw new Error('Registration of Request Was Failed.');
            }
            else {
                console.log('A New Submarine Was Registered.');
            }
        });
        db.close();
    });
});
exports.insertNewSubmarine = insertNewSubmarine;
