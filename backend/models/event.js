const mongoose = require('mongoose');

const eventsSchema= new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    client:{type:String},
    driver:{type:String},
    driver_status:{type:String}
});

module.exports = mongoose.model('Events',eventsSchema);