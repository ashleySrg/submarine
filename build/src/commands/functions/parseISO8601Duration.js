"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseISO8601Duration = void 0;
const parseISO8601Duration = (duration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = regex.exec(duration);
    if (!matches)
        throw new Error('Invalid duration format');
    const hours = parseInt(matches[1] || '0');
    const minutes = parseInt(matches[2] || '0');
    const seconds = parseInt(matches[3] || '0');
    return ((hours * 60 + minutes) * 60 + seconds) * 1000;
};
exports.parseISO8601Duration = parseISO8601Duration;
