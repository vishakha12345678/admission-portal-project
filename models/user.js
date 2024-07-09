const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    image:{
        public_id:{
            type:String,
            require:true
        },
        url:{
            type:String,
            require:true
        }
    },
    role:{
        type:String,
        default:'student'
    },
    is_verified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
       
    }
})
const UserModel = mongoose.model('user',userSchema)
module.exports= UserModel