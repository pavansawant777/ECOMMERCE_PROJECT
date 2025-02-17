var mysql = require("mysql");
var util = require("util");


var conn = mysql.createConnection({
    "host":"barsqbhlb24t28sjiq4p-mysql.services.clever-cloud.com",
    "user":"uj5e0h4hs69znn1k",
    "password":"wXXyCH6TIKBKh2aoTTAC",
    "database":"barsqbhlb24t28sjiq4p"
});
var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
