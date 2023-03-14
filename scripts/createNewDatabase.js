const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('resources/submarines.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS submarine_list (server TEXT, numbering INTEGER, name TEXT, departure_time DATETIME, required_time TIME)")
});

db.close();

console.log("\u001b[32mGenerating DB File Completed!\u001b[0m");