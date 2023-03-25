const sqlite3 = require("sqlite3").verbose();
const columnify = require("columnify");
const cron = require("node-cron");

const readDatabase = async () => {
    const db = new sqlite3.Database('resources/submarines.db');
    const request = "SELECT server, numbering AS num, departure_show AS departure, duration_show AS duration, arrival_show AS arrival FROM submarine_list";
    const params = [];

    const listObj = await new Promise((resolve, reject) => {
        db.all(request, params, (err, rows) => {
            if (err){
                console.log(err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
    return listObj;
};

const exec = async () => {
    process.stdout.write('\u001B[3J\u001B[H\u001B[2J');
	process.stdout.write('\r' + new Date().toString() + '\n');

    const submarines = await readDatabase();
    console.log(columnify(submarines,{
            columnSplitter : '|'
        }));

    console.log("\n\u001b[32mExtracting DB-Records Was Completed!\u001b[0m");
}

exec();
cron.schedule('*/10 * * * * *', exec);