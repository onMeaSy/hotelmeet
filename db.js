const mongoose = require("mongoose");
var mongoURL = 'mongodb+srv://motumanlove:motumanlove@cluster0.98z8i.mongodb.net/mernhotels'
mongoose.connect(mongoURL,{useUnifiedTopology:true,useNewUrlParser:true})

var connection = mongoose.connection

connection.on('error',()=>{
    console.log('Mongo DB Connection failed')
})

connection.on('connected',()=>{
    console.log('Mongo DB Connection Successful')
})

module.exports = mongoose