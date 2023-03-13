import { SubmarineInformation } from "../../myTypes";
const sqlite3 = require('sqlite3').verbose();

export const getSubmarineList = async (server: string): Promise<SubmarineInformation[]> => {
    const db = new sqlite3.Database('submarines.db');
    let submarineList: SubmarineInformation[] = [];
    let request: string;

    if (server === 'All') {
        request = "SELECT * FROM submarine_list";
    } else {
        request = `SELECT * FROM submarine_list WHERE server = '${server}'`;
    }

    await new Promise<void>((resolove, reject) => {
        db.serialize(() => {
            db.each(request, (err: Error | null, row: SubmarineInformation) => {
                submarineList.push(row);
            });
            db.close();
        });
        resolove();
    });
    
    return submarineList;
}

