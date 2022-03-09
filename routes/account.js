const express = require('express');
const routerAccount  = express.Router();
const account_controller = require('../controllers/accountController');


routerAccount.post('/login', account_controller.login);

routerAccount.post('/reg', account_controller.reg);

routerAccount.delete('/delete', account_controller.deleteUser);

routerAccount.put('/change', account_controller.change);

module.exports = routerAccount;