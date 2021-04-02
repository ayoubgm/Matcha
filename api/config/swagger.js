const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
        openapi: '3.0.1',
        info: {
        	version: '1.0.0',
            title: '[Matcha] API documentation',
            description: 'API documentation for matcha'
        },
        host: process.env.URL_SERVER
	},
    apis: ['./app/routes/*']
}

const swaggerDocs = swaggerJsDoc(options);

module.exports = ( app ) => {
	app.use(`/api/documentation`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}