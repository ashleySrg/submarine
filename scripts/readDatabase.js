const sqlite3 = require('sqlite3').verbose();
const columnify = require('columnify');

const exec = async () => {
    const submarineList = await readDataFromDatabase();

    console.log(columnify(submarineList,{
        columnSplitter: ' | '
    }));
    console.log("\n\u001b[32mExtracting Records from DB Completed!\u001b[0m");
}

const readDataFromDatabase = async () => {
    const db = new sqlite3.Database('./resources/submarines.db');
    var listObj = [];

    await new Promise((resolve, reject) => {
        db.each("SELECT * FROM submarine_list", (err, row) => {
            listObj.push(row);
        }, (err, numRows) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    return listObj;
};

exec();
