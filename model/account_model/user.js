/**
 * Created by gunjoe on 2017/2/28.
 */
const mongoose = require('mongoose');

let userSchema = mongoose.Schema;

let temp = new userSchema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("User",temp);