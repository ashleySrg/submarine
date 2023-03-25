const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('resources/submarines.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS submarine_list (server TEXT, numbering INTEGER, name TEXT, departure_time TEXT, required_time TEXT, arrival_time TEXT,  departure_show TEXT, duration_show TEXT,arrival_show TEXT)");
});

db.close();

console.log("\u001b[32mGenerating DB File Completed!\u001b[0m");