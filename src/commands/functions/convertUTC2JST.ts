export const convertUTC2JST = (utcDate: Date):string => {
    const jstOffset = 9 * 60 * 60 * 1000;
    const jstDate = new Date(utcDate.getTime() + jstOffset);
    return jstDate.toISOString().replace("Z", "+09:00");
}