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
exports.getSubmarineList = void 0;
const sqlite3 = require('sqlite3').verbose();
const getSubmarineList = (server) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new sqlite3.Database('submarines.db');
    let submarineList = [];
    let request;
    if (server === 'All') {
        request = "SELECT * FROM submarine_list";
    }
    else {
        request = `SELECT * FROM submarine_list WHERE server = '${server}'`;
    }
    yield new Promise((resolove, reject) => {
        db.serialize(() => {
            db.each(request, (err, row) => {
                submarineList.push(row);
            });
            db.close();
        });
        resolove();
    });
    return submarineList;
});
exports.getSubmarineList = getSubmarineList;
