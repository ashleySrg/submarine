const sqlite3 = require('sqlite3').verbose();
import { databaseDirectory } from '../settings/settings';
import { convertMs2DHM } from './convertMs2DHM';
import { convertUTC2JST } from './convertUTC2JST';

export const updateSubmarineList = async (server: string, numbering: string, requiredTimeISO8601: string) => {
    const db = new sqlite3.Database(databaseDirectory);

    const request = `UPDATE submarine_list SET departure_time = ?, required_time = ?, arrival_time = ?, departure_show = ?, duration_show = ?, arrival_show = ? WHERE server = ? AND numbering = ?`;
    const utc = new Date();
    const jstDeparture = convertUTC2JST(utc);
    const jst = new Date(utc.getTime() + parseInt(requiredTimeISO8601, 10));
    const jstArrival = convertUTC2JST(jst);
    const dhmDuration = convertMs2DHM(requiredTimeISO8601);
    const params = [jstDeparture, requiredTimeISO8601, jstArrival, (jstDeparture.slice(5, 16)).replace('T', ' '), dhmDuration, (jstArrival.slice(5, 16)).replace('T', ' '), server, numbering];
    
    await new Promise<void>((resolve, reject) => {
        db.run(request, params, (err: any) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve();
            }
        });
    });
}