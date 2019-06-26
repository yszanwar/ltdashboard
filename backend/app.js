const express = require('express');
const app =express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });
const mongoose = require('mongoose');
const eventsRoutes = require('./routes/events');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://athujoshi:@12senna@node-rest-shop-9mino.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true });
mongoose.Promise=global.Promise;


app.use('/events',eventsRoutes);



module.exports=app;



