const express = require('express');
const app =express();
const mongoose = require('mongoose');
const eventsRoutes = require('./routes/events');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://athujoshi:@12senna@node-rest-shop-9mino.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true });
mongoose.Promise=global.Promise;


app.use('/events',eventsRoutes);



module.exports=app;



