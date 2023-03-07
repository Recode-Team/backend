const express = require("express");
const helmet = require("helmet"); 
const app = express();

port = 3000;

app.use(helmet()); 

app.get('/', function(req, res) {
    res.send('hello Nodejs');
})

app.listen(port, () => console.log('Running..'))


