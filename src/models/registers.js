const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerSchema = new mongoose.Schema({
    yourname : {
        type:String,
        required:true
    },
    emailid : {
        type:String,
        required:true, 
        unique:true
    }, 
    password : {
        type:String,
        required:true
    },
    confirmpassword : {
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

// Generating Tokens
registerSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part" + error);
        console.log("the error part" + error);
    }
}

// Converting Password Into Hash
registerSchema.pre("save", async function (next) {

    if(this.isModified("password")){
        
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
        
    }

    next();   
} )



// Now we need to create a Collection

const Register = new mongoose.model("Register", registerSchema);

module.exports = Register;