// set up all required environnement variables
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require("path");

// routes
const routes = require('./app/routes/index.js');

// Create a connection pooling
const pool = require('./database/database.js');

// Create an app
const app = express();

app.use(express.static(path.join(__dirname, "/build/")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use( express.urlencoded({ extended: true }) );

// parse requests of content-type - application/json
app.use( express.json() );

// Cors
app.use(cors({
	origin: process.env.URL_SERVER,
	credentials: true
}));

// Static folder for users image
app.use('/api/public/images/users', express.static( path.join( __dirname, '/public/images/users' ) ));

// routes
app.use('/api', routes);

// setup swagger doc
require('./config/swagger.js')(app);

// Handle 404 responses
app.use(( req, res, next ) => {
	let err = new Error("Sorry can't find that !");
	err.status = 404;
	next( err );
});

// Error handler
app.use(( err, req, res, next ) => {
    res.status( err.status || 500 );
    res.send({
        error: err.message || "Something goes wrong !"
    });
});

const server = http.createServer( app );
const io = require("socket.io")(server, {
	cors: { origin: '*' },
	pingInterval: 10,
	pingTimeout: 4000
});

// Setup the events
require("./libraries/sockets")(io);

server.listen( process.env.PORT, () => {
	console.log("\x1b[32m", `*** Server is listen on port ${process.env.PORT} ( ${new Date()} ) ***`, "\x1b[0m");
})
.on('error', (error) => {
	console.log(`Some error happend : ${ error }`);
});

module.exports = { server, pool }