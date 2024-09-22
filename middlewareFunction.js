const express = require('express');
const jwt = require('jsonwebtoken');
const { registerUser, usersArray, checkUser } = require('./authorisationRoutes/register');

function createMiddleware(req, res, next) {
    if (req.originalUrl.startsWith('/api/auth')) next();
    
    if (!req.headers.authorization) {
        res.status(401);
        res.send('You need to log in');
    } else {
        const parts = req.headers.authorization.split(' ');
        console.log(parts);
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(400);
            res.send('Wrong authorization header');
        }

        try{
            const decodedInfo = jwt.verify(parts[1], 'secret');
            console.log(decodedInfo);

            if (!decodedInfo) {
                res.status(403);
                res.send('Forbidden');
            } else {
                const isTokenExp = isTokenExpired(decodedInfo);
                if (isTokenExp) {
                    res.status(403);
                    res.send('Token expired');
                } else {
                    const searchUser = usersArray.filter(item => item.id === decodedInfo.id);
                    if (searchUser.length !== 0) {
                        req.user = searchUser[0];
                        console.log(req.user);
                        next();
                    } else {
                        res.status(403);
                        res.send('There is no such user');
                    }
                }
            }
        } catch(err) {
            res.status(400);
            res.send('Wrong authorization token');
        }
    }
}

function isTokenExpired(decodedInfo) {
    if (!decodedInfo.exp) {
        return false;
    } else {
        return decodedInfo.exp < Math.floor(Date.now() / 1000);
    }
}

module.exports = {
    createMiddleware
}