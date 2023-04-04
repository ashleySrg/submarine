import { RequestSQLParams, SubmarineInformation } from "./myTypes";
import { databaseDirectory } from "../settings/settings";
const sqlite3 = require('sqlite3').verbose();

export const getSubmarineList = async (server: string, numbering?: string): Promise<SubmarineInformation[]> => {
    const db = new sqlite3.Database(databaseDirectory);
    const submarineList: SubmarineInformation[] = await new Promise<SubmarineInformation[]>((resolve, reject) => {
        const requestSqlParams = getRowsSQL(server, numbering);
        db.all(requestSqlParams.request, requestSqlParams.params, (err: any, rows: SubmarineInformation[]) => {
            if (err) {
                console.log(`Error: ${err}`);
                reject(new Error('Cannot Access to Database.'));
            } else {
                db.close();
                resolve(rows);
            }
        });
    });
    return submarineList;
}

const getRowsSQL = (server: string, numbering?: string): RequestSQLParams => {
    let requestSqlParams: RequestSQLParams = {
        request: "",
        params: []
    };

    if (server === 'All') {
        requestSqlParams.request = "SELECT server, numbering, name, departure_time, required_time, arrival_time FROM submarine_list";
        requestSqlParams.params = [];
    } else if (numbering !== undefined) {
        requestSqlParams.request = `SELECT server, numbering, name, departure_time, required_time, arrival_time FROM submarine_list WHERE server = ? AND numbering = ?`;
        requestSqlParams.params = [server, numbering];
    } else {
        requestSqlParams.request = `SELECT server, numbering, name, departure_time, required_time, arrival_time FROM submarine_list WHERE server = ?`;
        requestSqlParams.params = [server];
    }

    return requestSqlParams;
}

