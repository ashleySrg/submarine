"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseException = exports.ExtendClient = void 0;
const discord_js_1 = require("discord.js");
class ExtendClient extends discord_js_1.Client {
    constructor() {
        super(...arguments);
        this.commands = new discord_js_1.Collection();
    }
}
exports.ExtendClient = ExtendClient;
;
class DatabaseException extends Error {
}
exports.DatabaseException = DatabaseException;
DatabaseException.DUPLICATION_EXCEPTION = '[DATABASE] already_exists_in_database';
