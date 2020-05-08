const http = require('http');
require('dotenv').config();  // Requiring .env File
const app = require('./app');
const port = process.env.PORT;

// Create Server
const server = http.createServer(app);

// Listen to Port
server.listen(port, () => {
    console.log("Server is running on Port: "+port);
    
});