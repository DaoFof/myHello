const mongoose =  require('mongoose');

mongoose.connect("mongodb://localhost:27017/helloApp");

module.exports = {mongoose};
