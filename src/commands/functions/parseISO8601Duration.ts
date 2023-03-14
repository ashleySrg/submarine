export const parseISO8601Duration = (duration: string): number => {
    const regex: RegExp = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches: RegExpExecArray | null = regex.exec(duration);
    if (!matches) throw new Error('Invalid duration format');

    const hours = parseInt(matches[1] || '0');
    const minutes = parseInt(matches[2] || '0');
    const seconds = parseInt(matches[3] || '0');

    return ((hours * 60 + minutes) * 60 + seconds) * 1000;
}
