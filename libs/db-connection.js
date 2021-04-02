const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/doan3-mang', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.connection
    .once('open', () => console.log('Connected to the database'))
    .on('error', err => console.error(err));