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
const exceptionTypes_1 = require("./exceptionTypes");
const sqlite3 = require('sqlite3').verbose();
const insertNewSubmarine = (server, numbering, name) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new sqlite3.Database('submarines.db');
    const getDuplicateRows = "SELECT * FROM submarine_list WHERE server = ? AND numbering = ?";
    const params = [server, numbering];
    let result;
    yield new Promise((resolove, reject) => {
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS submarine_list (server TEXT, numbering INTEGER, name TEXT, departure_time TEXT, required_time TEXT)");
            db.get(getDuplicateRows, params, (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    result = row;
                    resolove();
                }
            });
        });
    });
    if (result)
        throw Error(exceptionTypes_1.DatabaseException.DUPLICATION_EXCEPTION);
    db.serialize(() => {
        db.run(`INSERT INTO submarine_list (server, numbering, name, departure_time, required_time) VALUES ('${server}', ${numbering}, '${name}', 0, 0)`);
        db.close();
    });
});
exports.insertNewSubmarine = insertNewSubmarine;
