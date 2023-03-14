"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseException = void 0;
class DatabaseException extends Error {
}
exports.DatabaseException = DatabaseException;
DatabaseException.DUPLICATION_EXCEPTION = '[DATABASE] Already exists in database';
