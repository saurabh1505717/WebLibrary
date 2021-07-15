const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/RegisterAndLoginData", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log(`conection successful`);
}).catch(() => {
    console.log(`no connection`);
});