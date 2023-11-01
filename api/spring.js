const axios = require("axios");

const instance = axios.create({
    baseURL: 'http://localhost:8080',  // Set the base URL for the requests
    timeout: 5000,  // Set a timeout of 5 seconds for requests
    headers: {
      'Content-Type': 'application/json',  // Set default headers for all requests
      'Access-Control-Allow-Origin': '*',
    },
  });
  
module.exports = instance;