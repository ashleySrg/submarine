const sqlite3 = require('sqlite3').verbose();
const columnify = require('columnify');

const exec = async () => {
	process.stdout.write('\u001B[3J\u001B[H\u001B[2J');
	process.stdout.write('\r' + new Date().toString() + '\n');

    const submarineList = await readDataFromDatabase();
    process.stdout.write(columnify(submarineList,{
        columnSplitter: ' | '
    }));

    process.stdout.write("\n\u001b[32mExtracting Records from DB Completed!\u001b[0m");
}

const readDataFromDatabase = async () => {
    const db = new sqlite3.Database('resources/submarines.db');
    const request = "SELECT server, numbering AS num, departure_show AS departure, duration_show AS duration, arrival_show AS arrival FROM submarine_list";
    const params = [];

    const listObj = await new Promise((resolve, reject) => {
        db.all(request, params, (err, rows) => {
            if (err){
                console.log(err);
                reject(err);
            }
            resolve(rows);
        });
    });
    return listObj;
};

exec();
