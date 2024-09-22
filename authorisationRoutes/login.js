const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { hash } = require('crypto');
const jwt = require('jsonwebtoken');
const { registerUser, usersArray, checkUser } = require('./register');
const { checkUserInfo, checkInformation, correctPosition } = require('../check');

const logIn = express.Router();

logIn.post('/', (req, res) => {
    const { body } = req;

    const message = checkUserInfo(body);

    if (message) {
        res.status(400);
        res.send(message);
    } else {
        const searchUser = usersArray.filter(item => item.email === body.email);

        if (searchUser.length === 0) {
            res.status(400);
            res.send(`There is no such user with email ${body.email}`);
        } else {
            bcrypt.compare(body.password, searchUser[0].password, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.send('Error comparing passwords error');
                }
            
            if (result) {
                const token = jwt.sign({
                    id: searchUser[0].id,
                    email: searchUser[0].email
                  },
                  'secret',
                  {
                    expiresIn: 300
                  }
                );
                res.status(200);
                res.cookie("token", token);
                res.send(token);
            } else {
                console.log("Passwords don't match");
                res.status(401);
                res.send('Wrong password');
            }
            });
        }
    }
});


module.exports = {
    logIn
}