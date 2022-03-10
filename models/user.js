const mongoose   = require('mongoose');
const bcrypt     = require('bcrypt');
const configDB   = require('../config/db');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    login:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
});

const User = module.exports = mongoose.model("User", userSchema);

module.exports.getUserByLogin = function(login, callback){
    const query = {login: login};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.addUser = function(newUser, callback){

    bcrypt.genSalt(10, (err, salt) =>{
        bcrypt.hash(newUser.password, salt, (err, hash) =>{
            if(!err){
                newUser.password = hash;
                newUser.save(callback);
            }
            else{
                console.log(err);
            }
        });
    });
    
};

module.exports.getAllUsers = function(callback){
    User.find({}, callback)
}

module.exports.deleteUser = function(login, callback){
    const query = {login: login}
    User.findOneAndDelete(query, callback)
}

module.exports.changeLogin = function(oldLogin, newLogin, callback){
    const query = {login: oldLogin}
    const change = {$set: {login: newLogin}}
    User.findOneAndUpdate(query, change, callback)
}

module.exports.comparePass = function(passFormUser, passFromDB, callback){
    bcrypt.compare(passFormUser, passFromDB, (err, isAuth)=>{
        if(err){
            res.json({error: err})
        }else{
            callback(null, isAuth);
        };
    });
};


