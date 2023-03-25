import { RequestSQLParams, SubmarineInformation } from "./myTypes";
import { databaseDirectory } from "../settings/settings";
const sqlite3 = require('sqlite3').verbose();

export const insertNewSubmarine = async (server: string, numbering: string, name: string): Promise<void> => {
    const db = new sqlite3.Database(databaseDirectory);
    const getDuplicateRowsSQL = "SELECT * FROM submarine_list WHERE server = ? AND numbering = ?"
    const params = [server, numbering];
    let result: SubmarineInformation | null;

    await new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.get(getDuplicateRowsSQL, params, (err: Error | null, row: SubmarineInformation | null) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    result = row;
                    resolve();
                }
            });
        });
    });

    if (result!) throw Error('Already Exits in Database');

    db.serialize(() => {
        const requestSqlParams: RequestSQLParams = {
            request: 'INSERT INTO submarine_list (server, numbering, name, departure_time, required_time, arrival_time, departure_show, duration_show, arrival_show) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            params: [server, numbering, name, '0', '0', '0', '0', '0', '0']
        };

        db.run(requestSqlParams.request, requestSqlParams.params, (err: any) => {
            if (err) {
                console.log(err);
                throw new Error('Registration of Request Was Failed.');
            } else {
                console.log('A New Submarine Was Registered.')
            }
        });
        db.close();
    });
}

