const bcrypt = require("bcrypt");
const crypto = require("crypto");

const 		hashPassword = ( text ) => {
	const hash = bcrypt.hashSync( text, 11 );
	return hash;
}

const 		compareHash = async ( text, hash ) => {
	const match = await bcrypt.compare( text, hash );
	return match;
}

const 		hash = ( text ) => {
	let salt = crypto.randomBytes( 16 ).toString( 'hex' );
	let hash = crypto.pbkdf2Sync( text, salt, 875492, 64, `sha512` ).toString(`hex`);

	return hash;
}


module.exports = {
	generatePasswordToken: ( password ) => {
		return hashPassword( password );
	},
	generateToken: ( text ) => {
		return hash( text ); 
	},
	compare: ( password, hash ) => {
		return compareHash( password, hash );
	}
}