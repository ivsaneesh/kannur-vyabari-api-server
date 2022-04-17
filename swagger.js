const swaggerAutogen = require('swagger-autogen')()


const doc = {
    info: {
        version: "1.0.0",
        title: "Kannur Vyapari Vyavasayi API",
        description: "Kannur Vyapari Vyavasayi "
    },
    host: "localhost:5090",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
    ],
    securityDefinitions: {
        apiKeyAuth:{
        }
    },
    definitions: {
        
    }
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./app')           // Your project's root file
})