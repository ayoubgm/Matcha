require('dotenv').config();
const mysql = require('mysql');
// config database
const config = require('../config/dbconfig');
// connection to the database
const pool = mysql.createPool(config);

pool.getConnection(( err, connection ) => {
	if ( err ) {
		switch( err.code ) {
			case "ER_BAD_HOST_ERROR":
				console.log("\x1b[31m", `--- Can't get hostname for your address ( ${ process.env.DB_HOST } ) ! ---`, "\x1b[0m");
				break;
			case "ER_OUTOFMEMORY":
				console.log("\x1b[31m", `--- Out of memory; restart server and try again ! ---`, "\x1b[0m");
				break;
			case "ER_CON_COUNT_ERROR":
				console.log("\x1b[31m", `--- Too many connections ! ---`, "\x1b[0m");
				break;
			case "ER_HANDSHAKE_ERROR":
				console.log("\x1b[31m", `--- Bad handshake ! ---`, "\x1b[0m");
				break;
			case "ER_ACCESS_DENIED_ERROR":
				console.log("\x1b[31m", `--- Access denied for user ${ process.env.DB_USER } ! ---`, "\x1b[0m");
				break;
			case "ER_DBACCESS_DENIED_ERROR":
				console.log("\x1b[31m", `--- Access denied for user ${ process.env.DB_USER }@${ process.env.DB_HOST } to database ${ process.env.DB_NAME }' ! ---`, "\x1b[0m");
				break;
			case "ER_NO_DB_ERROR":
				console.log("\x1b[31m", `--- No database selected ! ! ---`, "\x1b[0m");
				break;
			case " ER_NO_SUCH_DB":
				console.log("\x1b[31m", `--- Database ${ process.env.DB_NAME } doesn't exist ! ! ---`, "\x1b[0m");
				break;
			case "ER_BAD_DB_ERROR":
				console.log("\x1b[31m", `--- Unknown database ! ! ---`, "\x1b[0m");
				break;
			case "ER_SERVER_SHUTDOWN":
				console.log("\x1b[31m", `--- Server shutdown in progress ! ! ---`, "\x1b[0m");
				break;
			default:
				console.log("\x1b[31m", `--- ${ err }`, "\x1b[0m");
				throw err;
				break;
		} 
	} else if ( connection ) {
		connection.release();
	}
});

pool.on('connection', (connection) => {
	// console.log("\x1b[33m", `*** New connection ( ${new Date()} ) ! ***`, "\x1b[0m");
});

pool.on('enqueue', () => {
 	// console.log("\x1b[33m", '*** Waiting for available connection slot ! ***', "\x1b[0m");
});

module.exports = pool;