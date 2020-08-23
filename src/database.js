const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notes-db-app',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log('error'));




