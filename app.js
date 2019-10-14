const express = require('express'); //bring in express to app js file

const app = express(); //initialize app variable with express

const PORT = process.env.PORT || 5000; //create port to run app on

app.listen(PORT, console.log(`Server Started on Port ${PORT}`)); //runs a server, and see what port it's running on