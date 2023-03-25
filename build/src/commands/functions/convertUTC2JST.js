"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertUTC2JST = void 0;
const convertUTC2JST = (utcDate) => {
    const jstOffset = 9 * 60 * 60 * 1000;
    const jstDate = new Date(utcDate.getTime() + jstOffset);
    return jstDate.toISOString().replace("Z", "+09:00");
};
exports.convertUTC2JST = convertUTC2JST;
