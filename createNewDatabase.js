const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    //db.run("CREATE TABLE lorem (info TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS submarine_list (server TEXT, numbering INTEGER, name TEXT, departure_time DATETIME, required_time TIME)")

    // db.run("INSERT INTO submarine_list (server, numbering, name, departure_time, required_time) VALUES ('Masamune', 1, 'Fortuna', '2023-03-04 12:34:56', '12:33:33')");
    // db.run("INSERT INTO submarine_list (server, numbering, name, departure_time, required_time) VALUES ('Masamune', 2, 'Little', '2023-03-04 12:34:56', '12:33:33')");
    const stmt = db.prepare("INSERT INTO submarine_list (server, numbering, name, departure_time, required_time) VALUES (?,?,?,?,?)");

    for (let i = 0; i < 10; i++) {
        stmt.run('Masamune', i, 'Fortuna', '2023-03-04 12:34:56', '12:33:33');
    }
    stmt.finalize();

    // db.each("SELECT rowid AS id, server, numbering FROM submarine_list", (err, row) => {
    db.each("SELECT * FROM submarine_list", (err, row) => {
        console.log(`${row.id} : ${row.server}, ${row.numbering}, ${row.name}, ${row.departure_time}, ${row.required_time}`);
    });
});

db.close();