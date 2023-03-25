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
exports.getSubmarineListForDisplay = void 0;
const settings_1 = require("../settings/settings");
const sqlite3 = require('sqlite3').verbose();
const getSubmarineListForDisplay = (server, numbering) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new sqlite3.Database(settings_1.databaseDirectory);
    const submarineList = yield new Promise((resolve, reject) => {
        const requestSqlParams = getRowsSQL(server, numbering);
        db.all(requestSqlParams.request, requestSqlParams.params, (err, rows) => {
            if (err) {
                console.log(`Error: ${err}`);
                reject(new Error('Cannot Access to Database.'));
            }
            else {
                db.close();
                resolve(rows);
            }
        });
    });
    return submarineList;
});
exports.getSubmarineListForDisplay = getSubmarineListForDisplay;
const getRowsSQL = (server, numbering) => {
    let requestSqlParams = {
        request: "",
        params: []
    };
    if (server === 'All') {
        requestSqlParams.request = "SELECT server, numbering AS num, name, departure_show AS departure, duration_show AS duration, arrival_show AS arrival FROM submarine_list";
        requestSqlParams.params = [];
    }
    else if (numbering !== undefined) {
        requestSqlParams.request = `SELECT server, numbering AS num, name, departure_show AS departure, duration_show AS duration, arrival_show AS arrival WHERE server = ? AND numbering = ?`;
        requestSqlParams.params = [server, numbering];
    }
    else {
        requestSqlParams.request = `SELECT server, numbering AS num, name, departure_show AS departure, duration_show AS duration, arrival_show AS arrival WHERE server = ?`;
        requestSqlParams.params = [server];
    }
    return requestSqlParams;
};
