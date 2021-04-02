// set up all required environnement variables
require('dotenv').config();
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const config = require('../config/dbconfig.js');
const { user } = require('../config/dbconfig.js');
const { forEach, forEachRight } = require('lodash');
const { query } = require('express');
const { image } = require('faker');
const conn = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	multipleStatements: true
});

const queries = ( fs.existsSync( path.join(__dirname, '/setup.sql') ) ) ? fs.readFileSync( path.join(__dirname, '/setup.sql') ).toString() : null;
const usersJSON = ( fs.existsSync( path.join(__dirname, '/users.json') ) ) ? fs.readFileSync( path.join(__dirname, "/users.json") ) : null;
const citiesJSON = ( fs.existsSync( path.join( __dirname, "/morocan-cities.json" ) ) ) ? fs.readFileSync( path.join(__dirname, "/morocan-cities.json") ) : null;

let dataUsers = JSON.parse( usersJSON );
let dataCities = JSON.parse( citiesJSON );


const				connect = () => {
	return new Promise((resolve, reject) => {
		conn.connect( (err) => {
			if ( err ) {
				switch( err.code ) {
					case "ER_BAD_HOST_ERROR":
						reject(`--- Can't get hostname for your address ( ${ process.env.DB_HOST } ) ! ---`);
						break;
					case "ER_OUTOFMEMORY":
						reject(`--- Out of memory; restart server and try again ! ---`);
						break;
					case "ER_CON_COUNT_ERROR":
						reject(`--- Too many connections ! ---`);
						break;
					case "ER_HANDSHAKE_ERROR":
						reject(`--- Bad handshake ! ---`);
						break;
					case "ER_ACCESS_DENIED_ERROR":
						reject(`--- Access denied for user ${ process.env.DB_USER } ! ---`);
						break;
					case "ER_DBACCESS_DENIED_ERROR":
						reject(`--- Access denied for user ${ process.env.DB_USER }@${ process.env.DB_HOST } to database ${ process.env.DB_NAME }' ! ---`);
						break;
					case "ER_NO_DB_ERROR":
						reject(`--- No database selected ! ---`);
						break;
					case " ER_NO_SUCH_DB":
						reject(`--- Database ${ process.env.DB_NAME } doesn't exist ! ---`);
						break;
					case "ER_BAD_DB_ERROR":
						reject(`--- Unknown database ! ---`);
						break;
					case "ER_SERVER_SHUTDOWN":
						reject(`--- Server shutdown in progress ! ---`);
						break;
					default:
						reject(`--- ${ err } ---`);
						break;
				} 
			} else {
				resolve();
			}
		});
	});
}

const					randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

// PREPARE QUERY INSERT USERS
const					prepareUsers = ( usersData, cities ) => {
	let query = "INSERT INTO `users` ( `firstname`, `lastname`, `email`, `username`, `password`, `gender`, `bio`, `looking`, `birthday`, `age`, `lat`, `lag`, `country`, `city`, `fame`, `verified` ) VALUES ";
	let users = "";
	let random;

	usersData.forEach((user, index) => {
		let random = randomIntFromInterval( 0, 57 );
		
		users += '( "'+ user.firstname.toLowerCase()+'", "'+ user.lastname.toLowerCase() +'", "'+ user.email.toLowerCase() +'", "'+ user.username.substring(0, 10) +'", "'+ user.password +'", "'+ user.gender.toLowerCase() +'", "'+ user.bio +'", "'+ user.looking.toLowerCase() +'", "'+ user.birthday +'", '+ user.age;
		users += ', '+ dataCities[ random ].lat +','+ cities[ random ].lng +', "'+ cities[ random ].country.toLowerCase() +'", "'+ cities[ random ].city.toLowerCase();
		users += '", '+ user.fame +', 1';
		users += ( index != 499 ) ? ' ), \n' : ' );';
	});
	query += users;
	return query;
}

// PREPARE QUERY INSERT USERS IMAGES
const					prepareProfileImages = ( usersData ) => {
	let query = "INSERT INTO `images` ( `url`, `profile`, `user_id` ) VALUES ";
	let images = "";

	usersData.forEach((user, index) => {
		images += '( "public/images/users/user'+ randomIntFromInterval(1, 90) +'-profile-265651855.jpg", 1, ' + (index+1);
		images += ( index != 499 ) ? ' ), \n' : ' );';
	});
	query += images;
	return query;
}

// PREPARE QUERY INSERT USERS TAGS
const					prepareUserstags = ( users ) => {
	let query = "INSERT INTO `users_tags` ( `user_id`, `tag_id` ) VALUES ";
	let userstags = "";
	
	users.forEach((user, index) => {
		userstags += '( '+ (index+1) +', ' + randomIntFromInterval( 1, 18 );
		userstags += ( index != 499 ) ? ' ), \n' : ' );';
	});
	query += userstags;
	return query;
}

// CREATE Database
const					DB_Seeder = ( sqlQueries ) => {
	return new Promise((resolve, reject) => {
		try {
			connect()
			.then(() => {
				// CREATE Database
				conn.query( sqlQueries, (error, result) => {
					if ( error ) { reject( error ); }
					else { resolve(); }
				});
			})
			.catch(( err ) => {
				reject( err );
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

// CREATE Users
const					USERS_Seeder = ( users, cities ) => {
	const queryINSERTUsers = prepareUsers( users, cities );

	return new Promise((resolve, reject) => {
		try {
			conn.query( queryINSERTUsers, ( error, result ) => {
				if ( error ) { reject( error ); }
				else { resolve(); }
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

// CREATE Users images
const					IMAGES_Seeder = ( users ) => {
	let queryINSERTImages = prepareProfileImages( users );

	return new Promise((resolve, reject) => {
		try {
			conn.query( queryINSERTImages, ( error, result ) => {
				if ( error ) { reject( error ); }
				else { resolve(); }
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

// CREATE Users tags
const					USERSTAGS_Seeder = ( users ) => {
	let queryINSERTUserTags = prepareUserstags( users );

	return new Promise((resolve, reject) => {
		try {
			conn.query( queryINSERTUserTags, ( error, result ) => {
				if ( error ) { reject( error ); }
				else { resolve(); }
			});
		} catch ( e ) {
			reject( e );
		}
	});
}

if ( queries ) {
	// Prepare DATABASE
	DB_Seeder( queries )
	.then(() => {
		console.log("\x1b[32m", " *** Database created successfully ! *** ", "\x1b[0m");
		// INSERT USERS
		USERS_Seeder( dataUsers, dataCities )
		.then(() => {
			console.log("\x1b[32m", " *** Users seeder DONE ! *** ", "\x1b[0m");
			// INSERT Users Images
			IMAGES_Seeder( dataUsers )
			.then(() => {
				console.log("\x1b[32m", " *** Users images seeder DONE ! *** ", "\x1b[0m");
				USERSTAGS_Seeder ( dataUsers )
				.then(() => {
					console.log("\x1b[32m", " *** Users tags seeder DONE ! *** ", "\x1b[0m");
					conn.end();
					process.exit(0);
				})
				.catch((error) => {
					console.log("\x1b[31m", "ERROR while seed users images  : ", error, "\x1b[0m");
				});
			})
			.catch((error) => {
				console.log("\x1b[31m", "ERROR while seed users images  : ", error, "\x1b[0m");
			});
		})
		.catch((error) => {
			console.log("\x1b[31m", "ERROR while seed users : ", error, "\x1b[0m");
		});
	})
	.catch((error) => {
		console.log("\x1b[31m", "ERROR while create database : ", error, "\x1b[0m");
	});
}