import { SubmarineInformation } from "../../myTypes";
import { DatabaseException } from "./exceptionTypes";
const sqlite3 = require('sqlite3').verbose();

export const insertNewSubmarine = async (server: String, numbering: number, name: String): Promise<void> => {
    const db = new sqlite3.Database('submarines.db');
    const getDuplicateRows = "SELECT * FROM submarine_list WHERE server = ? AND numbering = ?"
    const params = [server, numbering];
    let result: SubmarineInformation | null;

    await new Promise<void>((resolove, reject) => {
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS submarine_list (server TEXT, numbering INTEGER, name TEXT, departure_time TEXT, required_time TEXT)");
            db.get(getDuplicateRows, params, (err: Error | null, row: SubmarineInformation | null) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    result = row;
                    resolove();
                }
            });
        });
    });

    if (result!) throw Error(DatabaseException.DUPLICATION_EXCEPTION);

    db.serialize(() => {
        db.run(`INSERT INTO submarine_list (server, numbering, name, departure_time, required_time) VALUES ('${server}', ${numbering}, '${name}', 0, 0)`);
        db.close();
    });
}

