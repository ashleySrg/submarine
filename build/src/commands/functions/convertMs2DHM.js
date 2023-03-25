"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMs2DHM = void 0;
const convertMs2DHM = (ms) => {
    const milliseconds = parseInt(ms, 10);
    const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
    const hours = Math.floor((milliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
    return `${days}日${hours}時間${minutes}分`;
};
exports.convertMs2DHM = convertMs2DHM;
