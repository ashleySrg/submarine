import {DatabaseException, SubmarineInformation } from "./myTypes";
const sqlite3 = require('sqlite3').verbose();

export const insertNewSubmarine = async (server: String, numbering: number, name: String): Promise<boolean> => {
    debugger;

    try{
        const db = new sqlite3.Database('sampile.db');

        db.serialize(() => {
            const getDuplicateRows = "SELECT * FROM submarine_list WHERE server = ? AND numbering = ?"
            const params = [server, numbering];

            db.get(getDuplicateRows, params, (err: Error | null, row: SubmarineInformation | null) => {
                if (err) {
                    console.log(err);
                    return false;
                } else {
                    debugger;
                    if (row) {
                        console.log("Duplicated!");
                        throw new Error(DatabaseException.DUPLICATION_EXCEPTION);
                    }
                }
            });

            db.run("CREATE TABLE IF NOT EXISTS submarine_list (server TEXT, numbering INTEGER, name TEXT, departure_time TEXT, required_time TEXT)");
            db.run(`INSERT INTO submarine_list (server, numbering, name, departure_time, required_time) VALUES ('${server}', ${numbering}, '${name}', 0, 0)`);
            db.each("SELECT * FROM submarine_list", (err: Error | null, row: SubmarineInformation) => {
                console.log(`${row.server}, ${row.numbering}, ${row.name}, ${row.departure_time}, ${row.required_time}`);
            });
            console.log('------------------------------------')
            db.close();
        });
        return true;
    } catch (err:any) {
        console.log(err);
        return false;
    }
}

