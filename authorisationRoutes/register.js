const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { hash } = require('crypto');
const { getTop250Movies, writeToFile, TOP_250 } = require('../fetchData');
const { checkUserInfo, checkInformation, correctPosition } = require('../check');

let usersArray = [];

try{
    const jsonData = fs.readFileSync(path.join(__dirname, '../manager.json'), 'utf8');
    usersArray = JSON.parse(jsonData);
} catch {
    console.log('Error reading users file');
}

const registerUser = express.Router();

registerUser.post('/', (req, res) => {
    const { body } = req;

    if (usersArray.length === 0) {
        res.status(500);
        res.send('Server cannot read user file');
    }

    const message = checkUserInfo(body);

    if (message) {
        res.status(400);
        res.send(message);
    } else {
        const check = checkUser(body.email);
    
        if (!check) {
            res.status(400);
            res.send(`User with email ${body.email} already exists`);
        } else {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.send('Salt generation error');
                } else {
                    bcrypt.hash(body.password, salt, (err, hash) => {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send('Hashing error');
                        } else {
                            const newUser = {
                                id: usersArray.length + 1,
                                email: body.email,
                                password: hash,
                                super: false
                            }
                            usersArray.push(newUser);
                            writeToFile(usersArray, path.join(__dirname, '../manager.json'));
                            res.status(201);
                            res.json('New user is created');
                        }
                    });
                }
            });   
        }
    }

});

function checkUser(email) {
    const searchUser = usersArray.filter(item => item.email === email);
    return searchUser.length > 0 ? false : true;
}

module.exports = {
    registerUser,
    usersArray
}