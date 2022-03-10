const User = require('../models/user');
const jwt = require('jsonwebtoken');
const configDB = require('../config/db');


exports.login = (req, res) =>{

    const login = req.body.login
    const password = req.body.password

    User.getUserByLogin(login, (err, user)=>{
        if(err){
            res.json({error: err})
        }else{
            if(!user){
                return res.json({success: false, msg: "Пользователь не найден!"})
            }
            User.comparePass(password, user.password, (err, isAuth)=>{
                if(err){
                    res.json({error: err})
                }else{
                    if(isAuth){
                        
                        const token = jwt.sign(user.toJSON(), configDB.secretKey, {
                            expiresIn: 3600 * 12
                        });
                        res
                        .cookie("jwt", token, {
                            httpOnly: true,
                            secure: false
                        })
                        .json({msg:"Успешная авторизация"})
                        
                    }else{
                        return res.json({success: false, msg: "Пароль не совпадает!"})
                    }
                }
            })
        }
        
    });
};

exports.reg = (req, res) =>{
    let newUser = new User({
        name: req.body.name,
        login: req.body.login,
        password: req.body.password
    })

    User.getUserByLogin(newUser.login, (err, user)=>{
        if(!user){
            User.addUser(newUser, (err, user) =>{
                if(err){
                    res.json({success: false, msg: "Пользователь не был зарегистрирован!"});
                }
                else{
                    res.json({
                        success: true,
                        msg: "Пользователь был зарегистрирован!",
                        data:{
                            name: user.name,
                            login: user.login,
                        }
                    })
                }
            });
        }
        else{
            res.json({success:false, msg:"Такой логин уже используется!"})
        }
    })

    
};

exports.change = (req, res) =>{
    const oldlogin = req.body.login
    const newLogin = req.body.newLogin

    User.getUserByLogin(login, (err, login)=>{
        if(!login){
            User.changeLogin(oldlogin, newLogin, (err, changed)=>{
                if(changed){
                    res.json({success: true, msg:"Логин успешно изменен"})
                }
                else{
                    console.log(err);
                }
            })
        }
        else{
            res.json({success:false, msg:"Такой логин уже используется!"})
        }
    })

    

}

exports.deleteUser = (req, res) =>{
    const login = req.body.login
    User.deleteUser(login, (err, callback)=>{
        if(!err){
            res.json({success: true, msg: "Пользователь был удален!"})
        }
    })
}
