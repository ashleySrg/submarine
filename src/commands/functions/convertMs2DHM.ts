export const convertMs2DHM = (ms: string): string => {
    const milliseconds = parseInt(ms, 10);
    const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
    const hours = Math.floor((milliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));

    return `${days}日${hours}時間${minutes}分`;
}
