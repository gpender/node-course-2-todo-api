var mongoose = require('mongoose');


mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGOLAB_AMBER_URI || 'mongodb://localhost:27017/TodoApp');
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};
